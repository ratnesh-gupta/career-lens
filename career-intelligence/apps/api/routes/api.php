<?php

use App\Modules\CareerProfile\Http\Controllers\ProfileController;
use App\Modules\CareerScore\Http\Controllers\ScoreController;
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

    Route::post('/_envelope/validate', function (Request $request) {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        return ApiResponse::success(['ok' => true]);
    });

    // Public score card — no auth
    Route::get('/public/scores/{token}', [ScoreController::class, 'publicShow']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::patch('/profile', [ProfileController::class, 'update']);

        Route::get('/scores', [ScoreController::class, 'index']);
        Route::post('/scores/generate', [ScoreController::class, 'store']);
        Route::get('/scores/{id}', [ScoreController::class, 'show']);
        Route::post('/scores/{id}/share', [ScoreController::class, 'share']);
    });
});
