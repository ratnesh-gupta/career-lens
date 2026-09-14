<?php

namespace App\Modules\CareerProfile\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CareerProfile\Actions\EnsureCareerProfileForUser;
use App\Modules\CareerProfile\Actions\UpdateCareerProfile;
use App\Modules\CareerProfile\Http\Requests\UpdateCareerProfileRequest;
use App\Modules\CareerProfile\Http\Resources\CareerProfileResource;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(
        Request $request,
        EnsureCareerProfileForUser $ensure,
    ): JsonResponse {
        $profile = $ensure($request->user());
        $profile->loadMissing('user');

        return ApiResponse::success(
            (new CareerProfileResource($profile))->resolve()
        );
    }

    public function update(
        UpdateCareerProfileRequest $request,
        EnsureCareerProfileForUser $ensure,
        UpdateCareerProfile $update,
    ): JsonResponse {
        $profile = $ensure($request->user());
        $profile = $update($profile, $request->validated());
        $profile->loadMissing('user');

        return ApiResponse::success(
            (new CareerProfileResource($profile))->resolve()
        );
    }
}
