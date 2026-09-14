<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Resumes are evidence only — career_profiles remains canonical identity.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resumes', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('career_profile_id')->constrained('career_profiles')->cascadeOnDelete();

            $table->string('original_filename');
            $table->string('storage_path');
            $table->string('mime_type', 100)->default('application/pdf');
            $table->unsignedBigInteger('file_size')->default(0);

            // pending | processing | analyzed | failed
            $table->string('status', 32)->default('pending');
            $table->boolean('is_primary')->default(false);

            $table->unsignedSmallInteger('page_count')->nullable();
            $table->unsignedInteger('word_count')->nullable();

            $table->text('failure_reason')->nullable();
            $table->timestamp('uploaded_at')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
            $table->index(['career_profile_id', 'is_primary']);
        });

        Schema::create('resume_analyses', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('resume_id')->constrained('resumes')->cascadeOnDelete();

            $table->string('analysis_version', 32);
            $table->unsignedSmallInteger('ats_score')->nullable();
            $table->unsignedSmallInteger('readability_score')->nullable();
            $table->decimal('keyword_density', 5, 2)->nullable();

            $table->json('keywords_json')->nullable();
            $table->json('formatting_issues_json')->nullable();
            $table->json('content_suggestions_json')->nullable();
            $table->json('missing_keywords_json')->nullable();
            $table->json('sections_json')->nullable();
            $table->json('raw_ai_json')->nullable();
            $table->json('sanitized_text_meta_json')->nullable();

            $table->string('status', 32)->default('completed');
            $table->timestamp('analyzed_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resume_analyses');
        Schema::dropIfExists('resumes');
    }
};
