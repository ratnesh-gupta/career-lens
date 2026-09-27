<?php

namespace App\Modules\Billing;

/**
 * Canonical entitlement feature codes for R1b.
 * Limits are seeded per plan; services must not hard-code free/pro numbers.
 */
final class FeatureCodes
{
    public const TARGET_ROLES_MAX = 'target_roles_max';

    public const OPTIMIZATION_SESSIONS_PER_MONTH = 'optimization_sessions_per_month';

    public const AI_REWRITES_PER_MONTH = 'ai_rewrites_per_month';

    public const JD_ANALYSIS = 'jd_analysis';

    public const PDF_EXPORTS_PER_MONTH = 'pdf_exports_per_month';

    public const RESUME_VERSIONS_MAX = 'resume_versions_max';

    /** @return list<string> */
    public static function all(): array
    {
        return [
            self::TARGET_ROLES_MAX,
            self::OPTIMIZATION_SESSIONS_PER_MONTH,
            self::AI_REWRITES_PER_MONTH,
            self::JD_ANALYSIS,
            self::PDF_EXPORTS_PER_MONTH,
            self::RESUME_VERSIONS_MAX,
        ];
    }

    /** Features that use monthly usage counters. */
    public static function isMetered(string $code): bool
    {
        return in_array($code, [
            self::OPTIMIZATION_SESSIONS_PER_MONTH,
            self::AI_REWRITES_PER_MONTH,
            self::PDF_EXPORTS_PER_MONTH,
        ], true);
    }

    /** Boolean-style features (enabled/disabled via limit_value). */
    public static function isBoolean(string $code): bool
    {
        return $code === self::JD_ANALYSIS;
    }
}
