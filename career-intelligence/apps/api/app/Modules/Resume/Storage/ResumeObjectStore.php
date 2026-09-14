<?php

namespace App\Modules\Resume\Storage;

use App\Models\Resume;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Private object-store access for resume binaries.
 * S3/MinIO uses presigned PUT; local disk falls back to API binary endpoint.
 */
final class ResumeObjectStore
{
    public function diskName(): string
    {
        return (string) config('resumes.disk', 's3');
    }

    public function disk()
    {
        return Storage::disk($this->diskName());
    }

    public function buildPath(string $userUuid, string $resumeUuid, string $fileName): string
    {
        $safe = Str::of($fileName)->basename()->replace(['..', '\\'], '')->toString();

        return 'resumes/'.$userUuid.'/'.$resumeUuid.'/'.$safe;
    }

    /**
     * @return array{url: string, headers: array<string, string>, driver: string}
     */
    public function temporaryUploadUrl(Resume $resume, \DateTimeInterface $expiresAt): array
    {
        $disk = $this->diskName();
        $path = $resume->storage_path;

        if ($disk === 's3' || $this->supportsTemporaryUploadUrl($disk)) {
            try {
                $url = $this->disk()->temporaryUploadUrl($path, $expiresAt, [
                    'ContentType' => $resume->mime_type ?: 'application/pdf',
                ]);

                // Laravel may return string or array depending on version/adapter
                if (is_array($url)) {
                    return [
                        'url' => $url['url'] ?? ($url[0] ?? ''),
                        'headers' => $url['headers'] ?? ['Content-Type' => 'application/pdf'],
                        'driver' => 's3',
                    ];
                }

                return [
                    'url' => (string) $url,
                    'headers' => [
                        'Content-Type' => $resume->mime_type ?: 'application/pdf',
                    ],
                    'driver' => 's3',
                ];
            } catch (\Throwable $e) {
                // Fall through to local binary URL when adapter cannot sign (misconfigured local s3)
                if (config('app.env') === 'production') {
                    throw new RuntimeException('Unable to create presigned upload URL: '.$e->getMessage(), 0, $e);
                }
            }
        }

        return [
            'url' => url('/api/v1/resumes/'.$resume->uuid.'/upload-binary'),
            'headers' => [],
            'driver' => 'local',
        ];
    }

    public function exists(Resume $resume): bool
    {
        return $this->disk()->exists($resume->storage_path);
    }

    public function size(Resume $resume): int
    {
        return (int) $this->disk()->size($resume->storage_path);
    }

    public function get(Resume $resume): string
    {
        return (string) $this->disk()->get($resume->storage_path);
    }

    public function put(Resume $resume, string $contents): void
    {
        $this->disk()->put($resume->storage_path, $contents);
    }

    public function delete(Resume $resume): void
    {
        if ($this->exists($resume)) {
            $this->disk()->delete($resume->storage_path);
        }
    }

    private function supportsTemporaryUploadUrl(string $disk): bool
    {
        try {
            $adapter = Storage::disk($disk);

            return method_exists($adapter, 'temporaryUploadUrl')
                || method_exists($adapter->getAdapter(), 'temporaryUploadUrl');
        } catch (\Throwable) {
            return false;
        }
    }
}
