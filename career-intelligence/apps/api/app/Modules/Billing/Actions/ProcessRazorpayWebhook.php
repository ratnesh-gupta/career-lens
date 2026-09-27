<?php

namespace App\Modules\Billing\Actions;

use App\Models\Payment;
use App\Models\PaymentEvent;
use App\Models\User;
use App\Modules\Billing\Contracts\RazorpayClient;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class ProcessRazorpayWebhook
{
    public function __construct(
        private readonly RazorpayClient $razorpay,
        private readonly ActivateProFromPayment $activatePro,
    ) {}

    /**
     * @param  array<string, mixed>  $payload
     * @return array{status: string, eventId: string}
     */
    public function __invoke(string $rawBody, string $signature, array $payload): array
    {
        if (! $this->razorpay->verifyWebhookSignature($rawBody, $signature)) {
            return ['status' => 'invalid_signature', 'eventId' => ''];
        }

        $eventId = (string) ($payload['event_id'] ?? $payload['id'] ?? '');
        if ($eventId === '') {
            // Razorpay webhooks often use payload structure without top-level id — synthesize
            $eventId = hash('sha256', $rawBody);
        }

        $eventType = (string) ($payload['event'] ?? 'unknown');

        return DB::transaction(function () use ($eventId, $eventType, $payload) {
            $existing = PaymentEvent::query()
                ->where('provider', 'razorpay')
                ->where('event_id', $eventId)
                ->lockForUpdate()
                ->first();

            if ($existing !== null && in_array($existing->status, [
                PaymentEvent::STATUS_PROCESSED,
                PaymentEvent::STATUS_IGNORED,
            ], true)) {
                return ['status' => 'duplicate', 'eventId' => $eventId];
            }

            $event = $existing ?? PaymentEvent::query()->create([
                'provider' => 'razorpay',
                'event_id' => $eventId,
                'event_type' => $eventType,
                'payload_json' => $payload,
                'status' => PaymentEvent::STATUS_RECEIVED,
            ]);

            try {
                $this->handleEvent($eventType, $payload);
                $event->status = PaymentEvent::STATUS_PROCESSED;
                $event->processed_at = now();
                $event->save();

                return ['status' => 'processed', 'eventId' => $eventId];
            } catch (\Throwable $e) {
                Log::error('razorpay_webhook_failed', [
                    'event_id' => $eventId,
                    'event_type' => $eventType,
                    'message' => $e->getMessage(),
                ]);
                $event->status = PaymentEvent::STATUS_FAILED;
                $event->save();

                return ['status' => 'failed', 'eventId' => $eventId];
            }
        });
    }

    /** @param  array<string, mixed>  $payload */
    private function handleEvent(string $eventType, array $payload): void
    {
        // payment.captured | order.paid — primary success paths for one-time checkout
        if (in_array($eventType, ['payment.captured', 'order.paid'], true)) {
            $this->handlePaymentSuccess($payload);

            return;
        }

        if (in_array($eventType, ['payment.failed'], true)) {
            $this->handlePaymentFailed($payload);
        }

        // Other events ignored intentionally in R1b
    }

    /** @param  array<string, mixed>  $payload */
    private function handlePaymentSuccess(array $payload): void
    {
        $entity = $payload['payload']['payment']['entity']
            ?? $payload['payload']['order']['entity']
            ?? null;

        if (! is_array($entity)) {
            return;
        }

        $orderId = (string) ($entity['order_id'] ?? $entity['id'] ?? '');
        $paymentId = (string) ($entity['id'] ?? '');

        if ($orderId === '') {
            return;
        }

        $payment = Payment::query()
            ->where('provider', 'razorpay')
            ->where('provider_order_id', $orderId)
            ->first();

        if ($payment === null) {
            // Try notes for recovery
            $notes = $entity['notes'] ?? [];
            $userUuid = is_array($notes) ? ($notes['user_uuid'] ?? null) : null;
            if (! is_string($userUuid) || $userUuid === '') {
                return;
            }

            $user = User::query()->where('uuid', $userUuid)->first();
            if ($user === null) {
                return;
            }

            ($this->activatePro)(
                $user,
                is_array($notes) ? (string) ($notes['interval'] ?? 'month') : 'month',
            );

            return;
        }

        if ($payment->status === Payment::STATUS_PAID) {
            return;
        }

        $payment->status = Payment::STATUS_PAID;
        $payment->provider_payment_id = $paymentId !== '' ? $paymentId : $payment->provider_payment_id;
        $payment->paid_at = now();
        $payment->save();

        $user = $payment->user;
        if ($user === null) {
            return;
        }

        ($this->activatePro)(
            $user,
            $payment->interval ?? 'month',
        );
    }

    /** @param  array<string, mixed>  $payload */
    private function handlePaymentFailed(array $payload): void
    {
        $entity = $payload['payload']['payment']['entity'] ?? null;
        if (! is_array($entity)) {
            return;
        }

        $orderId = (string) ($entity['order_id'] ?? '');
        if ($orderId === '') {
            return;
        }

        $payment = Payment::query()
            ->where('provider', 'razorpay')
            ->where('provider_order_id', $orderId)
            ->first();

        if ($payment === null || $payment->status === Payment::STATUS_PAID) {
            return;
        }

        $payment->status = Payment::STATUS_FAILED;
        $payment->save();
    }
}
