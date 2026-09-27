<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * R1b Sequence #2 — Country pricing + payment audit tables (Razorpay).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_prices', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('plan_id')->constrained('plans')->cascadeOnDelete();
            // ISO 3166-1 alpha-2, or '*' for default fallback
            $table->string('country_code', 2);
            $table->string('currency', 3);
            $table->unsignedBigInteger('amount_minor');
            $table->string('interval', 20); // month | year
            $table->string('razorpay_plan_id', 191)->nullable();
            $table->string('status', 30)->default('active');
            $table->timestamps();

            $table->unique(['plan_id', 'country_code', 'interval'], 'plan_prices_plan_country_interval_unique');
            $table->index(['country_code', 'status']);
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('provider', 40)->default('razorpay');
            $table->string('provider_payment_id', 191)->nullable();
            $table->string('provider_order_id', 191)->nullable();
            $table->unsignedBigInteger('amount_minor');
            $table->string('currency', 3);
            $table->string('status', 40)->default('created');
            $table->foreignId('plan_id')->nullable()->constrained('plans')->nullOnDelete();
            $table->string('interval', 20)->nullable();
            $table->string('country_code', 2)->nullable();
            $table->json('metadata_json')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['provider', 'provider_payment_id']);
            $table->index(['provider', 'provider_order_id']);
            $table->index(['user_id', 'status']);
        });

        Schema::create('payment_events', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('provider', 40);
            $table->string('event_id', 191);
            $table->string('event_type', 120);
            $table->json('payload_json');
            $table->string('status', 40)->default('received'); // received | processed | ignored | failed
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->unique(['provider', 'event_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_events');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('plan_prices');
    }
};
