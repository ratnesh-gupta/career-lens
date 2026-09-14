<?php

return [
    'disk' => env('RESUMES_DISK', 'local'),

    'max_upload_bytes' => (int) env('RESUMES_MAX_UPLOAD_BYTES', 5 * 1024 * 1024),

    'allowed_mimes' => [
        'application/pdf',
    ],

    'upload_url_ttl_minutes' => 15,
];
