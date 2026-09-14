<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;

/**
 * Canonical R1a JSON envelope (Engineering Baseline v1.1).
 *
 * Success: { "success": true, "data": {}, "meta": {} }
 * Error:   { "success": false, "error": { "code", "message", "details" } }
 */
final class ApiResponse
{
    public static function success(mixed $data = [], array $meta = [], int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => (object) $meta,
        ], $status);
    }

    public static function error(
        string $code,
        string $message,
        mixed $details = [],
        int $status = 400,
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'error' => [
                'code' => $code,
                'message' => $message,
                'details' => is_array($details) || is_object($details)
                    ? (object) $details
                    : (object) [],
            ],
        ], $status);
    }
}
