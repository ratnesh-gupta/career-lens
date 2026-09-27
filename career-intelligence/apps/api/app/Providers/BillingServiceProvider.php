<?php

namespace App\Providers;

use App\Modules\Billing\Contracts\RazorpayClient;
use App\Modules\Billing\Services\FakeRazorpayClient;
use App\Modules\Billing\Services\HttpRazorpayClient;
use Illuminate\Support\ServiceProvider;

class BillingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(RazorpayClient::class, function () {
            if (config('billing.razorpay.fake')) {
                return new FakeRazorpayClient;
            }

            return new HttpRazorpayClient;
        });
    }
}
