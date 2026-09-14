<?php

namespace App\Modules\CareerScore\Support;

/**
 * Versioned category weights (baseline). Full deterministic engine is sequence #7;
 * this stub version drives R1a ownership + API shape.
 */
final class ScoreVersion
{
    public const CURRENT = 'r1a-stub-1.0';

    /**
     * @return array<string, float> category => weight (sum = 1.0)
     */
    public static function weights(string $version = self::CURRENT): array
    {
        return match ($version) {
            self::CURRENT => [
                'profile_completeness' => 0.25,
                'experience_signal' => 0.20,
                'skills_signal' => 0.20,
                'positioning' => 0.15,
                'market_alignment' => 0.10,
                'evidence_resume' => 0.10,
            ],
            default => self::weights(self::CURRENT),
        };
    }
}
