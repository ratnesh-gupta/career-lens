<?php

namespace App\Modules\Resume\Jobs;

use App\Models\Resume;
use App\Models\ResumeAnalysis;
use App\Modules\Ai\AiManager;
use App\Modules\Resume\Support\PiiSanitizer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

/**
 * Pipeline: processing → extract → PII sanitize → AI Manager → analysis row → analyzed.
 * Idempotent-ish: re-running on analyzed is a no-op; failed can be re-queued by admin (#11).
 */
class ProcessResumeJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(
        public readonly int $resumeId,
    ) {}

    public function handle(PiiSanitizer $sanitizer, AiManager $ai): void
    {
        $resume = Resume::query()->with('careerProfile')->find($this->resumeId);

        if ($resume === null) {
            return;
        }

        if ($resume->status === Resume::STATUS_ANALYZED) {
            return;
        }

        $resume->status = Resume::STATUS_PROCESSING;
        $resume->failure_reason = null;
        $resume->save();

        try {
            $rawText = $this->extractText($resume);
            $sanitized = $sanitizer->sanitize($rawText);

            $result = $ai->driver()->analyzeResumeText($sanitized['text'], [
                'display_name' => $resume->careerProfile?->display_name,
                'resume_uuid' => $resume->uuid,
            ]);

            ResumeAnalysis::query()->updateOrCreate(
                ['resume_id' => $resume->id],
                [
                    'analysis_version' => 'r1a-ai-stub-1.0',
                    'ats_score' => $result['ats_score'] ?? null,
                    'readability_score' => $result['readability_score'] ?? null,
                    'keyword_density' => $result['keyword_density'] ?? null,
                    'keywords_json' => $result['keywords'] ?? [],
                    'formatting_issues_json' => $result['formatting_issues'] ?? [],
                    'content_suggestions_json' => $result['content_suggestions'] ?? [],
                    'missing_keywords_json' => $result['missing_keywords'] ?? [],
                    'sections_json' => $result['sections'] ?? [],
                    'raw_ai_json' => [
                        'provider' => $result['provider'] ?? null,
                    ],
                    'sanitized_text_meta_json' => [
                        'redactions' => $sanitized['redactions'],
                        'char_count' => mb_strlen($sanitized['text']),
                    ],
                    'status' => 'completed',
                    'analyzed_at' => now(),
                ],
            );

            // Optional soft enrichment — only fill empty profile fields (profile stays canonical)
            $profile = $resume->careerProfile;
            if ($profile && empty($profile->headline) && ! empty($result['suggested_headline'])) {
                $profile->headline = $result['suggested_headline'];
                $profile->save();
            }

            $resume->status = Resume::STATUS_ANALYZED;
            $resume->word_count = str_word_count($sanitized['text']);
            $resume->page_count = max(1, (int) ceil(($resume->word_count ?: 1) / 400));
            $resume->processed_at = now();
            $resume->save();
        } catch (Throwable $e) {
            Log::error('ProcessResumeJob failed', [
                'resume_id' => $resume->id,
                'message' => $e->getMessage(),
            ]);

            $resume->status = Resume::STATUS_FAILED;
            $resume->failure_reason = $e->getMessage();
            $resume->save();

            throw $e;
        }
    }

    private function extractText(Resume $resume): string
    {
        // R1a: real PDF parsers land with production extraction. Stub uses stored object
        // presence + filename-derived placeholder text so the pipeline is end-to-end testable.
        $disk = config('resumes.disk', 'local');

        if (! Storage::disk($disk)->exists($resume->storage_path)) {
            // Allow analysis path without binary in unit tests when path is virtual
            return $this->placeholderText($resume);
        }

        $bytes = Storage::disk($disk)->get($resume->storage_path);

        // Prefer UTF-8 readable fragments from the blob (works for text-ish fixtures)
        $snippet = is_string($bytes) ? preg_replace('/[^\P{C}\n]+/u', ' ', $bytes) : '';
        $snippet = is_string($snippet) ? trim($snippet) : '';

        if ($snippet === '' || mb_strlen($snippet) < 20) {
            return $this->placeholderText($resume);
        }

        return $snippet;
    }

    private function placeholderText(Resume $resume): string
    {
        $name = pathinfo($resume->original_filename, PATHINFO_FILENAME);

        return "Professional summary for {$name}. Experience with TypeScript and React. "
            .'Led delivery of product features across web platforms. '
            .'Contact placeholder should be redacted if present: user@example.com +1-415-555-0100.';
    }
}
