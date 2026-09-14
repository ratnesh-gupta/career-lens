<?php

namespace App\Modules\CareerProfile\Actions;

use App\Models\CareerProfile;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Every authenticated user has exactly one Career Profile.
 * Created lazily on first access — resume is never the identity source.
 */
final class EnsureCareerProfileForUser
{
    public function __invoke(User $user): CareerProfile
    {
        $existing = $user->careerProfile;

        if ($existing !== null) {
            return $existing;
        }

        $slugBase = Str::slug($user->name ?: Str::before($user->email, '@')) ?: 'profile';

        return CareerProfile::query()->create([
            'user_id' => $user->id,
            'display_name' => $user->name,
            'public_slug' => $this->uniqueSlug($slugBase),
            'is_open_to_work' => false,
            'is_profile_public' => false,
        ]);
    }

    private function uniqueSlug(string $base): string
    {
        $slug = $base;
        $i = 0;

        while (CareerProfile::query()->where('public_slug', $slug)->exists()) {
            $i++;
            $slug = $base.'-'.$i;
        }

        return $slug;
    }
}
