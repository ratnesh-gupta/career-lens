<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Career Score is owned by career_profile (canonical), not by resume alone.
 * evidence_resume_id is optional evidence — FK deferred until resumes table (#6).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('career_scores', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();

            $table->foreignId('career_profile_id')
                ->constrained('career_profiles')
                ->cascadeOnDelete();

            // Optional evidence — stored as UUID string until resumes module lands
            $table->uuid('evidence_resume_uuid')->nullable()->index();
            $table->uuid('target_role_uuid')->nullable()->index();

            $table->unsignedSmallInteger('score'); // 0–100
            $table->string('score_version', 32);
            $table->string('status', 32)->default('completed');
            $table->string('grade', 4)->nullable();
            $table->unsignedSmallInteger('percentile')->nullable();
            $table->string('market_readiness', 32)->nullable();

            $table->json('breakdown_json')->nullable();
            $table->json('meta_json')->nullable();

            $table->string('share_token', 64)->nullable()->unique();
            $table->boolean('is_public')->default(false);

            $table->timestamp('generated_at');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index(['career_profile_id', 'generated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('career_scores');
    }
};
