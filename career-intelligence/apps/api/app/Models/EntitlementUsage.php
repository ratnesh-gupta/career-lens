<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EntitlementUsage extends Model
{
    protected $fillable = [
        'user_id',
        'feature_code',
        'period_key',
        'used_count',
    ];

    protected function casts(): array
    {
        return [
            'used_count' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
