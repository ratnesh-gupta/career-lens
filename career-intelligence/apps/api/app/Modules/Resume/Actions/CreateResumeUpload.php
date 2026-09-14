<?php

namespace App\Modules\Resume\Actions;

use App\Models\CareerProfile;
use App\Models\Resume;
use App\Models\User;
use App\Modules\Resume\Storage\ResumeObjectStore;
use Illuminate\Support\Str;

final class CreateResumeUpload
{
    public function __construct(
        private readonly ResumeObjectStore $store,
    ) {}

    /**
     * @return array{
     *     resume: Resume,
     *     uploadUrl: string,
     *     expiresAt: \Illuminate\Support\Carbon,
     *     headers: array<string, string>,
     *     storageDriver: string
     * }
     */
    public function __invoke(User $user, CareerProfile $profile, ?string $fileName = null): array
    {
        $fileName = $fileName ?: 'resume.pdf';
        if (! str_ends_with(strtolower($fileName), '.pdf')) {
            $fileName .= '.pdf';
        }

        $uuid = (string) Str::uuid();
        $userUuid = $user->uuid ?: (string) $user->id;
        $path = $this->store->buildPath($userUuid, $uuid, $fileName);

        $resume = Resume::query()->create([
            'uuid' => $uuid,
            'user_id' => $user->id,
            'career_profile_id' => $profile->id,
            'original_filename' => $fileName,
            'storage_path' => $path,
            'mime_type' => 'application/pdf',
            'file_size' => 0,
            'status' => Resume::STATUS_PENDING,
            'is_primary' => ! Resume::query()->where('user_id', $user->id)->where('is_primary', true)->exists(),
            'uploaded_at' => now(),
        ]);

        $ttl = (int) config('resumes.upload_url_ttl_minutes', 15);
        $expiresAt = now()->addMinutes($ttl);
        $signed = $this->store->temporaryUploadUrl($resume, $expiresAt);

        return [
            'resume' => $resume,
            'uploadUrl' => $signed['url'],
            'expiresAt' => $expiresAt,
            'headers' => $signed['headers'],
            'storageDriver' => $signed['driver'],
        ];
    }
}
