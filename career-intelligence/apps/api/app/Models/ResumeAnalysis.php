<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ResumeAnalysis extends Model
{
    protected $fillable = [
        'uuid',
        'resume_id',
        'analysis_version',
        'ats_score',
        'readability_score',
        'keyword_density',
        'keywords_json',
        'formatting_issues_json',
        'content_suggestions_json',
        'missing_keywords_json',
        'sections_json',
        'raw_ai_json',
        'sanitized_text_meta_json',
        'status',
        'analyzed_at',
    ];

    protected function casts(): array
    {
        return [
            'ats_score' => 'integer',
            'readability_score' => 'integer',
            'keyword_density' => 'float',
            'keywords_json' => 'array',
            'formatting_issues_json' => 'array',
            'content_suggestions_json' => 'array',
            'missing_keywords_json' => 'array',
            'sections_json' => 'array',
            'raw_ai_json' => 'array',
            'sanitized_text_meta_json' => 'array',
            'analyzed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (ResumeAnalysis $analysis): void {
            if (empty($analysis->uuid)) {
                $analysis->uuid = (string) Str::uuid();
            }
        });
    }

    public function resume(): BelongsTo
    {
        return $this->belongsTo(Resume::class);
    }
}
