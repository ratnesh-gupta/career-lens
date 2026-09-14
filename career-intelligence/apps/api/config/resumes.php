<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Object storage disk for resume binaries
    |--------------------------------------------------------------------------
    |
    | Prefer "s3" (MinIO locally, AWS in staging/prod). "local" remains for
    | unit tests and offline dev without object storage.
    |
    */
    'disk' => env('RESUMES_DISK', env('FILESYSTEM_DISK', 's3')),

    'max_upload_bytes' => (int) env('RESUMES_MAX_UPLOAD_BYTES', 5 * 1024 * 1024),

    'allowed_mimes' => [
        'application/pdf',
    ],

    'upload_url_ttl_minutes' => (int) env('RESUMES_UPLOAD_URL_TTL_MINUTES', 15),

    /*
    |--------------------------------------------------------------------------
    | Malware scanning
    |--------------------------------------------------------------------------
    |
    | none     — skip scan (tests only; not for production)
    | passthrough — always clean (local without ClamAV)
    | clamav   — TCP ClamAV daemon (clamd)
    |
    */
    'malware' => [
        'driver' => env('MALWARE_SCANNER', 'passthrough'),
        'required' => filter_var(env('MALWARE_SCAN_REQUIRED', false), FILTER_VALIDATE_BOOL),
        'clamav' => [
            'host' => env('CLAMAV_HOST', '127.0.0.1'),
            'port' => (int) env('CLAMAV_PORT', 3310),
            'timeout' => (int) env('CLAMAV_TIMEOUT', 30),
        ],
    ],
];
