<?php

$frontend = env('FRONTEND_URL', 'http://localhost:5173');

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter([
        $frontend,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ])),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Bearer tokens do not need cookies; keep false to simplify local SPA
    'supports_credentials' => false,

];
