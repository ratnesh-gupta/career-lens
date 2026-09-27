<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PaymentEvent extends Model
{
    public const STATUS_RECEIVED = 'received';

    public const STATUS_PROCESSED = 'processed';

    public const STATUS_IGNORED = 'ignored';

    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'uuid',
        'provider',
        'event_id',
        'event_type',
        'payload_json',
        'status',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'payload_json' => 'array',
            'processed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (PaymentEvent $row): void {
            if (empty($row->uuid)) {
                $row->uuid = (string) Str::uuid();
            }
        });
    }
}
