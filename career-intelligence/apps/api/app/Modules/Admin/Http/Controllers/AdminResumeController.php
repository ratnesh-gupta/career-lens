<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Resume;
use App\Modules\Resume\Jobs\ProcessResumeJob;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminResumeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $q = Resume::query()
            ->with(['user:id,uuid,name,email', 'careerProfile:id,uuid,display_name'])
            ->orderByDesc('updated_at');

        if (is_string($status) && $status !== '' && $status !== 'all') {
            $q->where('status', $status);
        }

        $resumes = $q->limit(100)->get();

        $data = $resumes->map(fn (Resume $r) => [
            'id' => $r->uuid,
            'fileName' => $r->original_filename,
            'status' => $r->status,
            'failureReason' => $r->failure_reason,
            'fileSize' => $r->file_size,
            'user' => [
                'id' => $r->user?->uuid,
                'email' => $r->user?->email,
                'displayName' => $r->user?->name,
            ],
            'careerProfileId' => $r->careerProfile?->uuid,
            'uploadedAt' => $r->uploaded_at?->toIso8601String(),
            'processedAt' => $r->processed_at?->toIso8601String(),
            'updatedAt' => $r->updated_at?->toIso8601String(),
        ])->values()->all();

        return ApiResponse::success($data);
    }

    public function reprocess(string $id): JsonResponse
    {
        $resume = Resume::query()->where('uuid', $id)->first();

        if ($resume === null) {
            return ApiResponse::error('NOT_FOUND', 'Resume not found.', [], 404);
        }

        $resume->status = Resume::STATUS_PROCESSING;
        $resume->failure_reason = null;
        $resume->save();

        ProcessResumeJob::dispatch($resume->id);

        return ApiResponse::success([
            'id' => $resume->uuid,
            'status' => $resume->status,
            'message' => 'Reprocess job queued.',
        ]);
    }
}
