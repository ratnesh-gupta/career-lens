<?php

use App\Modules\Admin\Http\Controllers\AdminDashboardController;
use App\Modules\Admin\Http\Controllers\AdminResumeController;
use App\Modules\Admin\Http\Controllers\AdminUserController;
use App\Modules\Auth\Http\Controllers\AuthController;
use App\Modules\Billing\Http\Controllers\BillingController;
use App\Modules\CareerProfile\Http\Controllers\ProfileController;
use App\Modules\CareerProfile\Http\Controllers\PublicProfileController;
use App\Modules\CareerScore\Http\Controllers\ScoreController;
use App\Modules\Resume\Http\Controllers\ResumeController;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', function () {
        return ApiResponse::success([
            'status' => 'ok',
            'service' => 'careerlens-api',
        ]);
    });

    /**
     * Readiness — dependency checks for load balancers / deploy gates.
     */
    Route::get('/ready', function () {
        $checks = [
            'database' => false,
            'redis' => false,
        ];

        try {
            DB::connection()->getPdo();
            $checks['database'] = true;
        } catch (\Throwable) {
            $checks['database'] = false;
        }

        try {
            Redis::connection()->ping();
            $checks['redis'] = true;
        } catch (\Throwable) {
            // Local/sqlite CI may not run Redis — mark optional unless QUEUE uses redis
            $checks['redis'] = config('queue.default') !== 'redis';
        }

        $ready = $checks['database'] === true;

        if (! $ready) {
            return ApiResponse::error('NOT_READY', 'Service dependencies unavailable.', $checks, 503);
        }

        return ApiResponse::success([
            'status' => 'ready',
            'checks' => $checks,
        ]);
    });

    Route::post('/_envelope/validate', function (Request $request) {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        return ApiResponse::success(['ok' => true]);
    });

    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/auth/verify-email', [AuthController::class, 'verifyEmail']);

    Route::get('/public/scores/{token}', [ScoreController::class, 'publicShow']);
    Route::get('/public/profiles/{slug}', [PublicProfileController::class, 'show']);

    // R1b billing (public)
    Route::get('/billing/plans', [BillingController::class, 'plans']);
    Route::post('/billing/webhooks/razorpay', [BillingController::class, 'webhook']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/refresh', [AuthController::class, 'refresh']);

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

        // R1b billing (auth)
        Route::get('/billing/entitlements', [BillingController::class, 'entitlements']);
        Route::get('/billing/subscription', [BillingController::class, 'subscription']);
        Route::post('/billing/checkout', [BillingController::class, 'checkout']);

        Route::middleware('super_admin')->prefix('admin')->group(function () {
            Route::get('/overview', [AdminDashboardController::class, 'overview']);
            Route::get('/resumes', [AdminResumeController::class, 'index']);
            Route::post('/resumes/{id}/reprocess', [AdminResumeController::class, 'reprocess']);
            Route::get('/users', [AdminUserController::class, 'index']);
        });
    });
});
