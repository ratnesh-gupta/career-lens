<?php

namespace App\Providers;

use App\Modules\Ai\AiManager;
use App\Modules\Ai\Contracts\AiProvider;
use App\Modules\Ai\Providers\FakeAiProvider;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(FakeAiProvider::class);
        $this->app->singleton(AiManager::class);
        $this->app->bind(AiProvider::class, function ($app) {
            return $app->make(AiManager::class)->driver();
        });
    }

    public function boot(): void
    {
        //
    }
}
