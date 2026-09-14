<?php

namespace App\Models;

use Database\Factories\ResumeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Resume extends Model
{
    /** @use HasFactory<ResumeFactory> */
    use HasFactory, SoftDeletes;

    public const STATUS_PENDING = 'pending';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_ANALYZED = 'analyzed';

    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'uuid',
        'user_id',
        'career_profile_id',
        'original_filename',
        'storage_path',
        'mime_type',
        'file_size',
        'status',
        'is_primary',
        'page_count',
        'word_count',
        'failure_reason',
        'uploaded_at',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'page_count' => 'integer',
            'word_count' => 'integer',
            'is_primary' => 'boolean',
            'uploaded_at' => 'datetime',
            'processed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Resume $resume): void {
            if (empty($resume->uuid)) {
                $resume->uuid = (string) Str::uuid();
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

    public function analysis(): HasOne
    {
        return $this->hasOne(ResumeAnalysis::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
