<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class TargetRole extends Model
{
    use SoftDeletes;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_ARCHIVED = 'archived';

    protected $fillable = [
        'uuid',
        'user_id',
        'career_profile_id',
        'role_name',
        'industry',
        'seniority',
        'location',
        'status',
        'sort_order',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (TargetRole $row): void {
            if (empty($row->uuid)) {
                $row->uuid = (string) Str::uuid();
            }
            if (empty($row->status)) {
                $row->status = self::STATUS_ACTIVE;
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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
