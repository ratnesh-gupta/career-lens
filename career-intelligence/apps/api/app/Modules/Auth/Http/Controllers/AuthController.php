<?php

namespace App\Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Auth\Actions\IssueTokenPair;
use App\Modules\Auth\Http\Requests\LoginRequest;
use App\Modules\Auth\Http\Requests\RegisterRequest;
use App\Modules\Auth\Http\Resources\UserResource;
use App\Modules\Billing\Actions\EnsureFreeSubscriptionForUser;
use App\Modules\CareerProfile\Actions\EnsureCareerProfileForUser;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(
        RegisterRequest $request,
        IssueTokenPair $issue,
        EnsureCareerProfileForUser $ensureProfile,
        EnsureFreeSubscriptionForUser $ensureFreeSubscription,
    ): JsonResponse {
        $user = User::query()->create([
            'name' => $request->string('displayName')->toString(),
            'email' => $request->string('email')->toString(),
            'password' => $request->string('password')->toString(),
        ]);

        $ensureProfile($user);
        $ensureFreeSubscription($user);

        return ApiResponse::success($issue($user), [], 201);
    }

    public function login(LoginRequest $request, IssueTokenPair $issue): JsonResponse
    {
        $user = User::query()->where('email', $request->string('email')->toString())->first();

        if ($user === null || ! Hash::check($request->string('password')->toString(), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        return ApiResponse::success($issue($user));
    }

    public function me(Request $request): JsonResponse
    {
        return ApiResponse::success(
            (new UserResource($request->user()))->resolve()
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return ApiResponse::success(null);
    }

    public function refresh(Request $request, IssueTokenPair $issue): JsonResponse
    {
        $request->validate([
            'refreshToken' => ['sometimes', 'string'],
        ]);

        // Bearer token already authenticated via sanctum — re-issue pair
        $user = $request->user();
        if ($user === null) {
            return ApiResponse::error('UNAUTHENTICATED', 'Unauthenticated.', [], 401);
        }

        return ApiResponse::success($issue($user));
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        // R1a: no mailer wiring yet — acknowledge without leaking existence
        return ApiResponse::success(['message' => 'If that email exists, a reset link will be sent.']);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
            'newPassword' => ['required', 'string', 'min:8'],
        ]);

        return ApiResponse::error(
            'NOT_IMPLEMENTED',
            'Password reset is not available yet.',
            [],
            501,
        );
    }

    public function verifyEmail(Request $request): JsonResponse
    {
        $request->validate(['token' => ['sometimes', 'string']]);

        return ApiResponse::success(['message' => 'Email verification acknowledged.']);
    }
}
