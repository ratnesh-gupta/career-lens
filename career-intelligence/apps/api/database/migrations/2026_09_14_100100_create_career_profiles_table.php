<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Canonical career aggregate (baseline DATABASE-SCHEMA-V1.1).
 * Resume is evidence only — never treat resume as the user identity.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('career_profiles', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();

            $table->string('first_name', 100)->nullable();
            $table->string('last_name', 100)->nullable();
            $table->string('display_name', 200)->nullable();
            $table->string('headline', 255)->nullable();
            $table->text('bio')->nullable();

            $table->string('location', 200)->nullable();
            $table->string('country', 100)->nullable();
            $table->string('current_job_title', 200)->nullable();
            $table->decimal('experience_years', 5, 2)->nullable();
            $table->string('career_level', 50)->nullable();
            $table->string('industry', 150)->nullable();

            $table->string('profile_photo', 1000)->nullable();
            $table->string('linkedin_url', 500)->nullable();
            $table->string('github_url', 500)->nullable();
            $table->string('portfolio_url', 500)->nullable();

            $table->unsignedInteger('current_salary')->nullable();
            $table->unsignedInteger('desired_salary')->nullable();

            $table->boolean('is_open_to_work')->default(false);
            $table->boolean('is_profile_public')->default(false);
            $table->string('public_slug', 120)->nullable()->unique();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('career_profiles');
    }
};
