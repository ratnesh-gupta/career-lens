<?php

use App\Models\CareerProfile;
use App\Models\Resume;
use App\Models\User;
use App\Modules\Resume\Jobs\ProcessResumeJob;
use App\Modules\Resume\Support\PiiSanitizer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('local');
    config(['resumes.disk' => 'local']);
});

test('upload-url creates resume pending linked to career profile', function () {
    $user = User::factory()->create();
    CareerProfile::factory()->for($user)->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/v1/resumes/upload-url', [
        'fileName' => 'alex-chen.pdf',
    ]);

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonStructure(['data' => ['uploadUrl', 'resumeId', 'expiresAt']]);

    $this->assertDatabaseHas('resumes', [
        'uuid' => $response->json('data.resumeId'),
        'status' => Resume::STATUS_PENDING,
        'user_id' => $user->id,
    ]);

    expect(
        Resume::query()->where('uuid', $response->json('data.resumeId'))->value('career_profile_id')
    )->not->toBeNull();
});

test('confirm without binary returns upload incomplete envelope', function () {
    $user = User::factory()->create();
    $profile = CareerProfile::factory()->for($user)->create();
    $resume = Resume::factory()->create([
        'user_id' => $user->id,
        'career_profile_id' => $profile->id,
        'status' => Resume::STATUS_PENDING,
    ]);
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/v1/resumes/'.$resume->uuid.'/confirm');

    $response->assertStatus(409)
        ->assertJsonPath('error.code', 'UPLOAD_INCOMPLETE');
});

test('binary upload then confirm dispatches process job', function () {
    Queue::fake();

    $user = User::factory()->create();
    $profile = CareerProfile::factory()->for($user)->create();
    $resume = Resume::factory()->create([
        'user_id' => $user->id,
        'career_profile_id' => $profile->id,
        'status' => Resume::STATUS_PENDING,
    ]);
    Sanctum::actingAs($user);

    $file = UploadedFile::fake()->create('resume.pdf', 100, 'application/pdf');

    $this->post('/api/v1/resumes/'.$resume->uuid.'/upload-binary', [
        'file' => $file,
    ], [
        'Accept' => 'application/json',
    ])->assertOk();

    $this->postJson('/api/v1/resumes/'.$resume->uuid.'/confirm')
        ->assertOk()
        ->assertJsonPath('data.status', Resume::STATUS_PROCESSING);

    Queue::assertPushed(ProcessResumeJob::class, fn (ProcessResumeJob $job) => $job->resumeId === $resume->id);
});

test('process resume job sanitizes pii and creates analysis', function () {
    $user = User::factory()->create();
    $profile = CareerProfile::factory()->for($user)->create(['headline' => null]);
    $resume = Resume::factory()->create([
        'user_id' => $user->id,
        'career_profile_id' => $profile->id,
        'status' => Resume::STATUS_PROCESSING,
        'original_filename' => 'alex.pdf',
    ]);

    // No binary — job uses placeholder text that includes email/phone for sanitizer
    (new ProcessResumeJob($resume->id))->handle(
        app(PiiSanitizer::class),
        app(\App\Modules\Ai\AiManager::class),
    );

    $resume->refresh();
    expect($resume->status)->toBe(Resume::STATUS_ANALYZED);
    expect($resume->analysis)->not->toBeNull();
    expect($resume->analysis->ats_score)->toBeInt();
    expect($resume->analysis->sanitized_text_meta_json['redactions'] ?? [])->toContain('email');
});

test('pii sanitizer redacts email and phone', function () {
    $sanitizer = new PiiSanitizer;
    $result = $sanitizer->sanitize('Reach me at jane.doe@example.com or +1-415-555-0199 thanks');

    expect($result['text'])->toContain('[EMAIL_REDACTED]');
    expect($result['text'])->toContain('[PHONE_REDACTED]');
    expect($result['text'])->not->toContain('jane.doe@example.com');
    expect($result['redactions'])->toContain('email');
});

test('analysis endpoint not ready while processing', function () {
    $user = User::factory()->create();
    $profile = CareerProfile::factory()->for($user)->create();
    $resume = Resume::factory()->create([
        'user_id' => $user->id,
        'career_profile_id' => $profile->id,
        'status' => Resume::STATUS_PROCESSING,
    ]);
    Sanctum::actingAs($user);

    $this->getJson('/api/v1/resumes/'.$resume->uuid.'/analysis')
        ->assertStatus(409)
        ->assertJsonPath('error.code', 'NOT_READY');
});
