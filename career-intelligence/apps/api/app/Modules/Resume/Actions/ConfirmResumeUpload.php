<?php

namespace App\Modules\Resume\Actions;

use App\Models\Resume;
use App\Modules\Resume\Jobs\ProcessResumeJob;
use App\Modules\Resume\Security\MalwareScannerManager;
use App\Modules\Resume\Storage\ResumeObjectStore;
use RuntimeException;

final class ConfirmResumeUpload
{
    public function __construct(
        private readonly ResumeObjectStore $store,
        private readonly MalwareScannerManager $scanners,
    ) {}

    public function __invoke(Resume $resume, ?int $fileSize = null): Resume
    {
        if ($resume->status === Resume::STATUS_ANALYZED) {
            return $resume;
        }

        if (! $this->store->exists($resume)) {
            throw new RuntimeException('Resume object not found in storage. Complete upload first.');
        }

        $bytes = $this->store->get($resume);
        $size = $fileSize ?? strlen($bytes);

        $max = (int) config('resumes.max_upload_bytes', 5 * 1024 * 1024);
        if ($size > $max) {
            $this->store->delete($resume);
            $resume->status = Resume::STATUS_FAILED;
            $resume->failure_reason = 'File exceeds maximum upload size.';
            $resume->save();

            throw new RuntimeException('File exceeds maximum upload size.');
        }

        // PDF magic bytes (%PDF)
        if ($size < 5 || ! str_starts_with($bytes, '%PDF')) {
            $this->store->delete($resume);
            $resume->status = Resume::STATUS_FAILED;
            $resume->failure_reason = 'Only PDF resumes are accepted.';
            $resume->save();

            throw new RuntimeException('Only PDF resumes are accepted.');
        }

        $scan = $this->scanners->driver()->scanBytes($bytes, $resume->original_filename);
        $required = (bool) config('resumes.malware.required', false);

        if ($scan->status === 'infected') {
            $this->store->delete($resume);
            $resume->status = Resume::STATUS_FAILED;
            $resume->failure_reason = 'Malware detected: '.($scan->signature ?? 'unknown');
            $resume->file_size = $size;
            $resume->save();

            throw new RuntimeException('Upload rejected by malware scanner.');
        }

        if ($scan->status === 'error' && $required) {
            $resume->status = Resume::STATUS_FAILED;
            $resume->failure_reason = 'Malware scan failed: '.($scan->message ?? 'unknown');
            $resume->file_size = $size;
            $resume->save();

            throw new RuntimeException('Malware scan unavailable.');
        }

        $resume->file_size = $size;
        $resume->status = Resume::STATUS_PROCESSING;
        $resume->failure_reason = null;
        $resume->save();

        ProcessResumeJob::dispatch($resume->id);

        return $resume->refresh();
    }
}
