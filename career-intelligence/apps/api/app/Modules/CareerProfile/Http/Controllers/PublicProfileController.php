<?php

namespace App\Modules\CareerProfile\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CareerProfile;
use App\Modules\CareerProfile\Http\Resources\PublicProfileResource;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class PublicProfileController extends Controller
{
    public function show(string $slug): JsonResponse
    {
        $profile = CareerProfile::query()
            ->where('public_slug', $slug)
            ->where('is_profile_public', true)
            ->first();

        if ($profile === null) {
            return ApiResponse::error(
                'NOT_FOUND',
                'Public profile not found.',
                [],
                404,
            );
        }

        return ApiResponse::success(
            (new PublicProfileResource($profile))->resolve()
        );
    }
}
