<?php

namespace App\Models;

use Database\Factories\CareerProfileFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class CareerProfile extends Model
{
    /** @use HasFactory<CareerProfileFactory> */
    use HasFactory;

    protected $fillable = [
        'uuid',
        'user_id',
        'first_name',
        'last_name',
        'display_name',
        'headline',
        'bio',
        'location',
        'country',
        'current_job_title',
        'experience_years',
        'career_level',
        'industry',
        'profile_photo',
        'linkedin_url',
        'github_url',
        'portfolio_url',
        'current_salary',
        'desired_salary',
        'is_open_to_work',
        'is_profile_public',
        'public_slug',
    ];

    protected function casts(): array
    {
        return [
            'experience_years' => 'float',
            'current_salary' => 'integer',
            'desired_salary' => 'integer',
            'is_open_to_work' => 'boolean',
            'is_profile_public' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (CareerProfile $profile): void {
            if (empty($profile->uuid)) {
                $profile->uuid = (string) Str::uuid();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
