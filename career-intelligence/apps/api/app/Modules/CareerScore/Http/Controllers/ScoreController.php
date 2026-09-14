<?php

namespace App\Modules\CareerScore\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CareerScore;
use App\Modules\CareerProfile\Actions\EnsureCareerProfileForUser;
use App\Modules\CareerScore\Actions\CreateScoreShare;
use App\Modules\CareerScore\Actions\GenerateCareerScore;
use App\Modules\CareerScore\Http\Requests\GenerateCareerScoreRequest;
use App\Modules\CareerScore\Http\Resources\CareerScoreResource;
use App\Modules\CareerScore\Http\Resources\PublicScoreResource;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    public function index(
        Request $request,
        EnsureCareerProfileForUser $ensure,
    ): JsonResponse {
        $profile = $ensure($request->user());

        $scores = CareerScore::query()
            ->where('career_profile_id', $profile->id)
            ->with(['careerProfile.user'])
            ->orderByDesc('generated_at')
            ->get();

        $data = $scores->map(
            fn (CareerScore $s) => (new CareerScoreResource($s))->resolve()
        )->values()->all();

        return ApiResponse::success($data);
    }

    public function store(
        GenerateCareerScoreRequest $request,
        EnsureCareerProfileForUser $ensure,
        GenerateCareerScore $generate,
    ): JsonResponse {
        $user = $request->user();
        $profile = $ensure($user);

        // Optional: client may send careerProfileId — must match the user's profile
        if ($request->filled('careerProfileId') && $request->string('careerProfileId')->toString() !== $profile->uuid) {
            return ApiResponse::error(
                'FORBIDDEN',
                'careerProfileId does not belong to the authenticated user.',
                [],
                403,
            );
        }

        $score = $generate(
            $profile,
            $request->input('evidenceResumeId'),
            $request->input('targetRoleId'),
        );
        $score->load(['careerProfile.user']);

        return ApiResponse::success(
            (new CareerScoreResource($score))->resolve(),
            [],
            201,
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $score = CareerScore::query()
            ->where('uuid', $id)
            ->with(['careerProfile.user'])
            ->first();

        if ($score === null) {
            return ApiResponse::error('NOT_FOUND', 'Score not found.', [], 404);
        }

        if ($score->careerProfile?->user_id !== $request->user()->id) {
            return ApiResponse::error('FORBIDDEN', 'Forbidden.', [], 403);
        }

        return ApiResponse::success(
            (new CareerScoreResource($score))->resolve()
        );
    }

    public function share(
        Request $request,
        string $id,
        CreateScoreShare $createShare,
    ): JsonResponse {
        $score = CareerScore::query()
            ->where('uuid', $id)
            ->with(['careerProfile.user'])
            ->first();

        if ($score === null) {
            return ApiResponse::error('NOT_FOUND', 'Score not found.', [], 404);
        }

        if ($score->careerProfile?->user_id !== $request->user()->id) {
            return ApiResponse::error('FORBIDDEN', 'Forbidden.', [], 403);
        }

        $score = $createShare($score);

        return ApiResponse::success([
            'token' => $score->share_token,
            'url' => url('/score/'.$score->share_token),
        ], [], 201);
    }

    public function publicShow(string $token): JsonResponse
    {
        $score = CareerScore::query()
            ->where('share_token', $token)
            ->where('is_public', true)
            ->with('careerProfile')
            ->first();

        if ($score === null) {
            return ApiResponse::error('NOT_FOUND', 'Score not found.', [], 404);
        }

        return ApiResponse::success(
            (new PublicScoreResource($score))->resolve()
        );
    }
}
