<?php

use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', function () {
        return ApiResponse::success([
            'status' => 'ok',
            'service' => 'careerlens-api',
        ]);
    });

    /**
     * Envelope probe — validation must return baseline error shape.
     * Used by feature tests; safe to keep in local/dev.
     */
    Route::post('/_envelope/validate', function (Request $request) {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        return ApiResponse::success(['ok' => true]);
    });

    // auth, profile, resumes, scores ...
});
