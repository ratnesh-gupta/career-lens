<?php

namespace App\Modules\Billing\Actions;

use App\Models\Payment;
use App\Models\Plan;
use App\Models\User;
use App\Modules\Billing\Contracts\RazorpayClient;
use App\Modules\Billing\Services\PriceResolver;
use Illuminate\Support\Str;

final class CreateCheckoutOrder
{
    public function __construct(
        private readonly PriceResolver $prices,
        private readonly RazorpayClient $razorpay,
    ) {}

    /**
     * @return array{
     *   keyId: string,
     *   orderId: string,
     *   amount: int,
     *   currency: string,
     *   planCode: string,
     *   interval: string,
     *   countryCode: string,
     *   paymentId: string,
     *   name: string,
     *   description: string
     * }
     */
    public function __invoke(
        User $user,
        string $planCode,
        string $interval,
        ?string $countryCode,
    ): array {
        $price = $this->prices->resolve($planCode, $countryCode, $interval);
        $plan = $price->plan;

        $receipt = 'cl_'.Str::lower(Str::random(20));

        $order = $this->razorpay->createOrder([
            'amount' => $price->amount_minor,
            'currency' => $price->currency,
            'receipt' => $receipt,
            'notes' => [
                'user_uuid' => $user->uuid,
                'plan_code' => $plan->code,
                'interval' => $interval,
                'country_code' => $price->country_code,
            ],
        ]);

        $payment = Payment::query()->create([
            'user_id' => $user->id,
            'provider' => 'razorpay',
            'provider_order_id' => $order['id'],
            'amount_minor' => $price->amount_minor,
            'currency' => $price->currency,
            'status' => Payment::STATUS_CREATED,
            'plan_id' => $plan->id,
            'interval' => $interval,
            'country_code' => $price->country_code,
            'metadata_json' => [
                'receipt' => $receipt,
                'plan_code' => $plan->code,
            ],
        ]);

        $keyId = (string) config('billing.razorpay.key_id');
        if ($keyId === '' && config('billing.razorpay.fake')) {
            $keyId = 'rzp_test_fake';
        }

        return [
            'keyId' => $keyId,
            'orderId' => $order['id'],
            'amount' => $price->amount_minor,
            'currency' => $price->currency,
            'planCode' => $plan->code,
            'interval' => $interval,
            'countryCode' => $price->country_code,
            'paymentId' => $payment->uuid,
            'name' => $plan->name,
            'description' => $plan->description ?? $plan->name,
        ];
    }
}
