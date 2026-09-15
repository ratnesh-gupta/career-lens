<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * R1b Sequence #1 — Entitlements foundation (DATABASE-SCHEMA-V1.1 boundary tables).
 * No payment provider yet; subscriptions may use provider=internal for free plan.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name', 100);
            $table->string('code', 50)->unique();
            $table->text('description')->nullable();
            $table->string('status', 30)->default('active'); // active|inactive
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('entitlements', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('plan_id')->constrained('plans')->cascadeOnDelete();
            $table->string('feature_code', 80);
            // null limit_value => unlimited (or pure boolean when metadata says so)
            $table->integer('limit_value')->nullable();
            $table->json('metadata_json')->nullable();
            $table->timestamps();

            $table->unique(['plan_id', 'feature_code']);
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('provider', 40)->default('internal'); // internal|stripe
            $table->string('provider_customer_id', 191)->nullable();
            $table->string('provider_subscription_id', 191)->nullable();
            $table->foreignId('plan_id')->constrained('plans')->restrictOnDelete();
            $table->string('status', 40)->default('active'); // active|canceled|past_due|trialing|expired
            $table->timestamp('started_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['provider', 'provider_subscription_id']);
        });

        Schema::create('entitlement_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('feature_code', 80);
            // Calendar month key for soft monthly quotas: YYYY-MM
            $table->string('period_key', 7);
            $table->unsignedInteger('used_count')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'feature_code', 'period_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entitlement_usages');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('entitlements');
        Schema::dropIfExists('plans');
    }
};
