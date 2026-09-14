<?php

namespace App\Modules\Resume\Actions;

use App\Models\Resume;
use App\Modules\Resume\Jobs\ProcessResumeJob;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

final class ConfirmResumeUpload
{
    public function __invoke(Resume $resume, ?int $fileSize = null): Resume
    {
        if ($resume->status === Resume::STATUS_ANALYZED) {
            return $resume;
        }

        $disk = config('resumes.disk', 'local');

        if (! Storage::disk($disk)->exists($resume->storage_path)) {
            // Allow confirm after binary upload endpoint; if still missing, keep pending error
            throw new RuntimeException('Resume object not found in storage. Complete upload first.');
        }

        if ($fileSize !== null) {
            $resume->file_size = $fileSize;
        } else {
            $resume->file_size = (int) Storage::disk($disk)->size($resume->storage_path);
        }

        $resume->status = Resume::STATUS_PROCESSING;
        $resume->save();

        ProcessResumeJob::dispatch($resume->id);

        return $resume->refresh();
    }
}
