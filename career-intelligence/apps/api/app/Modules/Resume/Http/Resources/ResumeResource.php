<?php

namespace App\Modules\Resume\Http\Resources;

use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Resume
 */
class ResumeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Resume $resume */
        $resume = $this->resource;
        $analysis = $resume->relationLoaded('analysis') ? $resume->analysis : null;

        return [
            'id' => $resume->uuid,
            'userId' => $resume->user?->uuid ?? (string) $resume->user_id,
            'careerProfileId' => $resume->careerProfile?->uuid,
            'fileName' => $resume->original_filename,
            'fileSize' => $resume->file_size,
            'mimeType' => $resume->mime_type,
            'storageKey' => $resume->storage_path,
            'status' => $resume->status,
            'pageCount' => $resume->page_count,
            'wordCount' => $resume->word_count,
            'analysis' => $analysis ? [
                'id' => $analysis->uuid,
                'resumeId' => $resume->uuid,
                'sections' => $analysis->sections_json ?? [],
                'keywords' => $analysis->keywords_json ?? [],
                'atsScore' => $analysis->ats_score,
                'readabilityScore' => $analysis->readability_score,
                'keywordDensity' => $analysis->keyword_density,
                'formattingIssues' => $analysis->formatting_issues_json ?? [],
                'contentSuggestions' => $analysis->content_suggestions_json ?? [],
                'missingKeywords' => $analysis->missing_keywords_json ?? [],
                'analyzedAt' => $analysis->analyzed_at?->toIso8601String(),
            ] : null,
            'isPrimary' => (bool) $resume->is_primary,
            'uploadedAt' => $resume->uploaded_at?->toIso8601String(),
            'processedAt' => $resume->processed_at?->toIso8601String(),
            'failureReason' => $resume->failure_reason,
        ];
    }
}
