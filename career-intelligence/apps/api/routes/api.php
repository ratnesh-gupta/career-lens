<?php

use App\Modules\CareerProfile\Http\Controllers\ProfileController;
use App\Modules\CareerProfile\Http\Controllers\PublicProfileController;
use App\Modules\CareerScore\Http\Controllers\ScoreController;
use App\Modules\Resume\Http\Controllers\ResumeController;
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

    // Public surfaces — no auth; privacy enforced in controllers
    Route::get('/public/scores/{token}', [ScoreController::class, 'publicShow']);
    Route::get('/public/profiles/{slug}', [PublicProfileController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::patch('/profile', [ProfileController::class, 'update']);

        Route::get('/scores', [ScoreController::class, 'index']);
        Route::post('/scores/generate', [ScoreController::class, 'store']);
        Route::get('/scores/{id}', [ScoreController::class, 'show']);
        Route::post('/scores/{id}/share', [ScoreController::class, 'share']);

        Route::get('/resumes', [ResumeController::class, 'index']);
        Route::post('/resumes/upload-url', [ResumeController::class, 'createUploadUrl']);
        Route::post('/resumes/{id}/upload-binary', [ResumeController::class, 'uploadBinary']);
        Route::post('/resumes/{id}/confirm', [ResumeController::class, 'confirm']);
        Route::get('/resumes/{id}', [ResumeController::class, 'show']);
        Route::get('/resumes/{id}/status', [ResumeController::class, 'status']);
        Route::get('/resumes/{id}/analysis', [ResumeController::class, 'analysis']);
        Route::delete('/resumes/{id}', [ResumeController::class, 'destroy']);
        Route::post('/resumes/{id}/primary', [ResumeController::class, 'setPrimary']);
        Route::post('/resumes/{id}/reprocess', [ResumeController::class, 'reprocess']);
    });
});
