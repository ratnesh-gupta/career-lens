<?php

namespace App\Modules\Ai\Contracts;

/**
 * Provider-agnostic AI surface. Controllers must never call vendors directly.
 */
interface AiProvider
{
    /**
     * Analyze sanitized resume text. Returns structured payload (no PII required).
     *
     * @return array<string, mixed>
     */
    public function analyzeResumeText(string $sanitizedText, array $context = []): array;

    public function name(): string;
}
