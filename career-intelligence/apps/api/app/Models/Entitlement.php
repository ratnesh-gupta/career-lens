<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Entitlement extends Model
{
    protected $fillable = [
        'uuid',
        'plan_id',
        'feature_code',
        'limit_value',
        'metadata_json',
    ];

    protected function casts(): array
    {
        return [
            'limit_value' => 'integer',
            'metadata_json' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Entitlement $row): void {
            if (empty($row->uuid)) {
                $row->uuid = (string) Str::uuid();
            }
        });
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function isUnlimited(): bool
    {
        return $this->limit_value === null;
    }

    public function isBooleanEnabled(): bool
    {
        // Boolean features: limit_value 1 = on, 0 = off, null treated as on
        if ($this->limit_value === null) {
            return true;
        }

        return $this->limit_value > 0;
    }
}
