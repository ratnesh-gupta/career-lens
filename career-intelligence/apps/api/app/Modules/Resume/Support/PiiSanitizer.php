<?php

namespace App\Modules\Resume\Support;

/**
 * Strips common PII patterns from extracted resume text before AI calls.
 * Not a substitute for production DLP — baseline R1a safeguard.
 */
final class PiiSanitizer
{
    /**
     * @return array{text: string, redactions: list<string>}
     */
    public function sanitize(string $text): array
    {
        $redactions = [];
        $out = $text;

        $patterns = [
            'email' => '/[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/i',
            'phone' => '/(?<!\d)(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}(?!\d)/',
            'ssn' => '/\b\d{3}-\d{2}-\d{4}\b/',
            'credit_card' => '/\b(?:\d[ -]*?){13,19}\b/',
        ];

        foreach ($patterns as $label => $pattern) {
            $replaced = preg_replace($pattern, '['.strtoupper($label).'_REDACTED]', $out);
            if (is_string($replaced) && $replaced !== $out) {
                $redactions[] = $label;
                $out = $replaced;
            }
        }

        return [
            'text' => $out,
            'redactions' => array_values(array_unique($redactions)),
        ];
    }
}
