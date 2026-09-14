<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CareerProfile;
use App\Models\CareerScore;
use App\Models\Resume;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function overview(): JsonResponse
    {
        return ApiResponse::success([
            'users' => User::query()->count(),
            'profiles' => CareerProfile::query()->count(),
            'resumes' => [
                'total' => Resume::query()->count(),
                'pending' => Resume::query()->where('status', Resume::STATUS_PENDING)->count(),
                'processing' => Resume::query()->where('status', Resume::STATUS_PROCESSING)->count(),
                'analyzed' => Resume::query()->where('status', Resume::STATUS_ANALYZED)->count(),
                'failed' => Resume::query()->where('status', Resume::STATUS_FAILED)->count(),
            ],
            'scores' => CareerScore::query()->count(),
        ]);
    }
}
