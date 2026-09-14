<?php

use App\Modules\CareerProfile\Http\Controllers\ProfileController;
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
     */
    Route::post('/_envelope/validate', function (Request $request) {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        return ApiResponse::success(['ok' => true]);
    });

    Route::middleware('auth:sanctum')->group(function () {
        // Career Profile is the canonical identity — not the resume
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::patch('/profile', [ProfileController::class, 'update']);
    });
});
