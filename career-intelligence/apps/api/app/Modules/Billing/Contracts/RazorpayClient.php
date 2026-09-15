<?php

namespace App\Modules\Billing\Contracts;

interface RazorpayClient
{
    /**
     * @param  array{amount: int, currency: string, receipt: string, notes?: array<string, string>}  $payload
     * @return array{id: string, amount: int, currency: string, status: string, receipt?: string}
     */
    public function createOrder(array $payload): array;

    public function verifyWebhookSignature(string $payload, string $signature): bool;

    public function verifyPaymentSignature(string $orderId, string $paymentId, string $signature): bool;
}
