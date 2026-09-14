<?php

namespace App\Modules\Resume\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Resume;
use App\Modules\CareerProfile\Actions\EnsureCareerProfileForUser;
use App\Modules\Resume\Actions\ConfirmResumeUpload;
use App\Modules\Resume\Actions\CreateResumeUpload;
use App\Modules\Resume\Http\Resources\ResumeResource;
use App\Modules\Resume\Jobs\ProcessResumeJob;
use App\Modules\Resume\Storage\ResumeObjectStore;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ResumeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $resumes = Resume::query()
            ->where('user_id', $request->user()->id)
            ->with(['analysis', 'user', 'careerProfile'])
            ->orderByDesc('uploaded_at')
            ->get();

        $data = $resumes->map(
            fn (Resume $r) => (new ResumeResource($r))->resolve()
        )->values()->all();

        return ApiResponse::success($data);
    }

    public function createUploadUrl(
        Request $request,
        EnsureCareerProfileForUser $ensure,
        CreateResumeUpload $create,
    ): JsonResponse {
        $request->validate([
            'fileName' => ['sometimes', 'string', 'max:255'],
        ]);

        $profile = $ensure($request->user());
        $result = $create($request->user(), $profile, $request->input('fileName'));

        return ApiResponse::success([
            'uploadUrl' => $result['uploadUrl'],
            'resumeId' => $result['resume']->uuid,
            'expiresAt' => $result['expiresAt']->toIso8601String(),
            'headers' => $result['headers'],
            'storageDriver' => $result['storageDriver'],
        ]);
    }

    /**
     * Local/dev binary intake when presigned S3 is unavailable.
     * Production clients should PUT directly to the presigned uploadUrl.
     */
    public function uploadBinary(
        Request $request,
        string $id,
        ResumeObjectStore $store,
    ): JsonResponse {
        $resume = $this->ownedResume($request, $id);

        $request->validate([
            'file' => ['required', 'file', 'mimes:pdf', 'max:5120'],
        ]);

        $file = $request->file('file');
        $contents = file_get_contents($file->getRealPath());
        $store->put($resume, $contents === false ? '' : $contents);

        $resume->file_size = $file->getSize();
        $resume->mime_type = $file->getMimeType() ?: 'application/pdf';
        $resume->save();

        return ApiResponse::success([
            'resumeId' => $resume->uuid,
            'bytes' => $resume->file_size,
        ]);
    }

    public function confirm(
        Request $request,
        string $id,
        ConfirmResumeUpload $confirm,
    ): JsonResponse {
        $resume = $this->ownedResume($request, $id);

        try {
            $resume = $confirm($resume);
        } catch (RuntimeException $e) {
            $code = str_contains(strtolower($e->getMessage()), 'malware')
                ? 'MALWARE_DETECTED'
                : (str_contains(strtolower($e->getMessage()), 'pdf')
                    ? 'INVALID_FILE'
                    : 'UPLOAD_INCOMPLETE');

            $status = in_array($code, ['MALWARE_DETECTED', 'INVALID_FILE'], true) ? 422 : 409;

            return ApiResponse::error($code, $e->getMessage(), [], $status);
        }

        $resume->load(['analysis', 'user', 'careerProfile']);

        return ApiResponse::success((new ResumeResource($resume))->resolve());
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $resume = $this->ownedResume($request, $id);
        $resume->load(['analysis', 'user', 'careerProfile']);

        return ApiResponse::success((new ResumeResource($resume))->resolve());
    }

    public function status(Request $request, string $id): JsonResponse
    {
        $resume = $this->ownedResume($request, $id);

        $progress = match ($resume->status) {
            Resume::STATUS_ANALYZED => 100,
            Resume::STATUS_PROCESSING => 55,
            Resume::STATUS_FAILED => 100,
            default => 15,
        };

        return ApiResponse::success([
            'id' => $resume->uuid,
            'status' => $resume->status,
            'progress' => $progress,
            'failureReason' => $resume->failure_reason,
        ]);
    }

    public function analysis(Request $request, string $id): JsonResponse
    {
        $resume = $this->ownedResume($request, $id);
        $resume->load('analysis');

        if ($resume->status !== Resume::STATUS_ANALYZED || $resume->analysis === null) {
            return ApiResponse::error('NOT_READY', 'Analysis not ready yet', [], 409);
        }

        $a = $resume->analysis;

        return ApiResponse::success([
            'id' => $a->uuid,
            'resumeId' => $resume->uuid,
            'sections' => $a->sections_json ?? [],
            'keywords' => $a->keywords_json ?? [],
            'atsScore' => $a->ats_score,
            'readabilityScore' => $a->readability_score,
            'keywordDensity' => $a->keyword_density,
            'formattingIssues' => $a->formatting_issues_json ?? [],
            'contentSuggestions' => $a->content_suggestions_json ?? [],
            'missingKeywords' => $a->missing_keywords_json ?? [],
            'analyzedAt' => $a->analyzed_at?->toIso8601String(),
        ]);
    }

    public function destroy(
        Request $request,
        string $id,
        ResumeObjectStore $store,
    ): JsonResponse {
        $resume = $this->ownedResume($request, $id);
        $store->delete($resume);
        $resume->delete();

        return ApiResponse::success(null);
    }

    public function setPrimary(Request $request, string $id): JsonResponse
    {
        $resume = $this->ownedResume($request, $id);

        Resume::query()
            ->where('user_id', $request->user()->id)
            ->update(['is_primary' => false]);

        $resume->is_primary = true;
        $resume->save();
        $resume->load(['analysis', 'user', 'careerProfile']);

        return ApiResponse::success((new ResumeResource($resume))->resolve());
    }

    public function reprocess(Request $request, string $id): JsonResponse
    {
        $resume = $this->ownedResume($request, $id);
        $resume->status = Resume::STATUS_PROCESSING;
        $resume->failure_reason = null;
        $resume->save();

        ProcessResumeJob::dispatch($resume->id);

        return ApiResponse::success([
            'id' => $resume->uuid,
            'status' => $resume->status,
        ]);
    }

    private function ownedResume(Request $request, string $id): Resume
    {
        $resume = Resume::query()->where('uuid', $id)->first();

        if ($resume === null || $resume->user_id !== $request->user()->id) {
            throw new NotFoundHttpException('Resume not found.');
        }

        return $resume;
    }
}
