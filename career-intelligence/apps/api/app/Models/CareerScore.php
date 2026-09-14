<?php

namespace App\Models;

use Database\Factories\CareerScoreFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class CareerScore extends Model
{
    /** @use HasFactory<CareerScoreFactory> */
    use HasFactory;

    protected $fillable = [
        'uuid',
        'career_profile_id',
        'evidence_resume_uuid',
        'target_role_uuid',
        'score',
        'score_version',
        'status',
        'grade',
        'percentile',
        'market_readiness',
        'breakdown_json',
        'meta_json',
        'share_token',
        'is_public',
        'generated_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
            'percentile' => 'integer',
            'breakdown_json' => 'array',
            'meta_json' => 'array',
            'is_public' => 'boolean',
            'generated_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (CareerScore $score): void {
            if (empty($score->uuid)) {
                $score->uuid = (string) Str::uuid();
            }
        });
    }

    public function careerProfile(): BelongsTo
    {
        return $this->belongsTo(CareerProfile::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
