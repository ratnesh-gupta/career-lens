<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Payment extends Model
{
    public const STATUS_CREATED = 'created';

    public const STATUS_PENDING = 'pending';

    public const STATUS_PAID = 'paid';

    public const STATUS_FAILED = 'failed';

    public const STATUS_REFUNDED = 'refunded';

    protected $fillable = [
        'uuid',
        'user_id',
        'provider',
        'provider_payment_id',
        'provider_order_id',
        'amount_minor',
        'currency',
        'status',
        'plan_id',
        'interval',
        'country_code',
        'metadata_json',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount_minor' => 'integer',
            'metadata_json' => 'array',
            'paid_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Payment $row): void {
            if (empty($row->uuid)) {
                $row->uuid = (string) Str::uuid();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }
}
