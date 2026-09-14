<?php

namespace App\Modules\Auth\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var User $user */
        $user = $this->resource;

        return [
            'id' => $user->uuid,
            'email' => $user->email,
            'displayName' => $user->name,
            'avatarUrl' => null,
            'role' => 'free',
            'isEmailVerified' => $user->email_verified_at !== null,
            'createdAt' => $user->created_at?->toIso8601String(),
            'updatedAt' => $user->updated_at?->toIso8601String(),
        ];
    }
}
