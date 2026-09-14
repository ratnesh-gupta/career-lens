<?php

namespace App\Modules\CareerScore\Support;

use InvalidArgumentException;

/**
 * Versioned category weights for the deterministic Career Score engine.
 */
final class ScoreVersion
{
    public static function current(): string
    {
        return (string) config('score.current_version', 'r1a-1.0');
    }

    /**
     * @return array<string, float>
     */
    public static function weights(?string $version = null): array
    {
        $version ??= self::current();
        $weights = config("score.versions.{$version}.weights");

        if (! is_array($weights) || $weights === []) {
            throw new InvalidArgumentException("Unknown score version [{$version}].");
        }

        return $weights;
    }

    /**
     * @return array<string, string>
     */
    public static function labels(?string $version = null): array
    {
        $version ??= self::current();

        return config("score.versions.{$version}.labels", []);
    }
}
