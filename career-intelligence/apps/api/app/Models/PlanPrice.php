<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class PlanPrice extends Model
{
    public const INTERVAL_MONTH = 'month';

    public const INTERVAL_YEAR = 'year';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    public const COUNTRY_DEFAULT = '*';

    protected $fillable = [
        'uuid',
        'plan_id',
        'country_code',
        'currency',
        'amount_minor',
        'interval',
        'razorpay_plan_id',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'amount_minor' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (PlanPrice $row): void {
            if (empty($row->uuid)) {
                $row->uuid = (string) Str::uuid();
            }
            $row->country_code = strtoupper($row->country_code);
            $row->currency = strtoupper($row->currency);
        });
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }
}
