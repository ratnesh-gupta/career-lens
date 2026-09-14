<?php

namespace App\Modules\Resume\Actions;

use App\Models\CareerProfile;
use App\Models\Resume;
use App\Models\User;
use Illuminate\Support\Str;

final class CreateResumeUpload
{
    /**
     * @return array{resume: Resume, uploadUrl: string, expiresAt: \Illuminate\Support\Carbon}
     */
    public function __invoke(User $user, CareerProfile $profile, ?string $fileName = null): array
    {
        $fileName = $fileName ?: 'resume.pdf';
        if (! str_ends_with(strtolower($fileName), '.pdf')) {
            $fileName .= '.pdf';
        }

        $uuid = (string) Str::uuid();
        $path = 'resumes/'.$user->uuid.'/'.$uuid.'/'.$fileName;

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

        // Local/dev: client PUTs to our confirm-adjacent upload endpoint (not real S3 until #8)
        $uploadUrl = url('/api/v1/resumes/'.$resume->uuid.'/upload-binary');

        return [
            'resume' => $resume,
            'uploadUrl' => $uploadUrl,
            'expiresAt' => $expiresAt,
        ];
    }
}
