<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * R1b Sequence #3 — User target roles (free-text; master FKs deferred).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('target_roles', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('career_profile_id')->constrained('career_profiles')->cascadeOnDelete();
            $table->string('role_name', 200);
            $table->string('industry', 150)->nullable();
            $table->string('seniority', 80)->nullable();
            $table->string('location', 200)->nullable();
            $table->string('status', 30)->default('active');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
            $table->index(['career_profile_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('target_roles');
    }
};
