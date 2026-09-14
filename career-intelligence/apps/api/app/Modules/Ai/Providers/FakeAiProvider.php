<?php

namespace App\Modules\Ai\Providers;

use App\Modules\Ai\Contracts\AiProvider;

/**
 * Deterministic fake provider for local/dev and tests.
 */
final class FakeAiProvider implements AiProvider
{
    public function name(): string
    {
        return 'fake';
    }

    public function analyzeResumeText(string $sanitizedText, array $context = []): array
    {
        $words = str_word_count($sanitizedText);
        $lengthFactor = min(30, (int) floor($words / 20));
        $displayName = $context['display_name'] ?? null;

        return [
            'provider' => $this->name(),
            'ats_score' => 60 + $lengthFactor,
            'readability_score' => 55 + min(25, (int) floor($words / 30)),
            'keyword_density' => round(min(8, max(1, $words / 100)), 2),
            'keywords' => [
                ['term' => 'TypeScript', 'frequency' => 3, 'isTechnical' => true, 'isInDemand' => true],
                ['term' => 'React', 'frequency' => 2, 'isTechnical' => true, 'isInDemand' => true],
                ['term' => 'leadership', 'frequency' => 1, 'isTechnical' => false, 'isInDemand' => true],
            ],
            'formatting_issues' => ['Stub: verify consistent date formats'],
            'content_suggestions' => [
                'Add quantified achievements to recent roles',
                'Include a concise professional summary',
            ],
            'missing_keywords' => ['AWS', 'system design'],
            'sections' => [
                [
                    'type' => 'summary',
                    'title' => 'Summary',
                    'rawText' => mb_substr($sanitizedText, 0, 200),
                    'items' => [],
                    'pageNumber' => 1,
                    'boundingBox' => null,
                ],
            ],
            'suggested_headline' => is_string($displayName) && $displayName !== ''
                ? $displayName.' · Professional'
                : null,
        ];
    }
}
