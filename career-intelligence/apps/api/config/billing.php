<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Billing provider (R1b locked: razorpay)
    |--------------------------------------------------------------------------
    */
    'provider' => env('BILLING_PROVIDER', 'razorpay'),

    'razorpay' => [
        'key_id' => env('RAZORPAY_KEY_ID', ''),
        'key_secret' => env('RAZORPAY_KEY_SECRET', ''),
        'webhook_secret' => env('RAZORPAY_WEBHOOK_SECRET', ''),
        /**
         * When true (local/testing), skip live HTTP and return deterministic fake orders.
         * Webhooks can still be exercised with signed fixtures in Pest.
         */
        'fake' => filter_var(env('RAZORPAY_FAKE', env('APP_ENV') === 'testing' || env('APP_ENV') === 'local'), FILTER_VALIDATE_BOOL),
    ],

    'default_country' => env('BILLING_DEFAULT_COUNTRY', '*'),
    'default_interval' => 'month',
];
