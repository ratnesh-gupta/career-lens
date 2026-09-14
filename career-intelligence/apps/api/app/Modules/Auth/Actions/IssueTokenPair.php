<?php

namespace App\Modules\Auth\Actions;

use App\Models\User;
use App\Modules\Auth\Http\Resources\UserResource;

final class IssueTokenPair
{
    /**
     * @return array{user: array<string, mixed>, accessToken: string, refreshToken: string, expiresAt: string}
     */
    public function __invoke(User $user, string $deviceName = 'web'): array
    {
        // Revoke previous tokens for this device label to limit sprawl
        $user->tokens()->where('name', $deviceName)->delete();
        $user->tokens()->where('name', $deviceName.'-refresh')->delete();

        $access = $user->createToken($deviceName, ['*']);
        $refresh = $user->createToken($deviceName.'-refresh', ['refresh']);

        $expiresAt = now()->addDays(7);

        return [
            'user' => (new UserResource($user))->resolve(),
            'accessToken' => $access->plainTextToken,
            'refreshToken' => $refresh->plainTextToken,
            'expiresAt' => $expiresAt->toIso8601String(),
        ];
    }
}
