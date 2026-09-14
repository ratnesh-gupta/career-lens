<?php

namespace App\Providers;

use App\Modules\Ai\AiManager;
use App\Modules\Ai\Contracts\AiProvider;
use App\Modules\Ai\Providers\FakeAiProvider;
use App\Modules\Resume\Security\ClamAvMalwareScanner;
use App\Modules\Resume\Security\MalwareScanner;
use App\Modules\Resume\Security\MalwareScannerManager;
use App\Modules\Resume\Security\NoneMalwareScanner;
use App\Modules\Resume\Security\PassthroughMalwareScanner;
use App\Modules\Resume\Storage\ResumeObjectStore;
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

        $this->app->singleton(ResumeObjectStore::class);
        $this->app->singleton(PassthroughMalwareScanner::class);
        $this->app->singleton(NoneMalwareScanner::class);
        $this->app->singleton(ClamAvMalwareScanner::class);
        $this->app->singleton(MalwareScannerManager::class);
        $this->app->bind(MalwareScanner::class, function ($app) {
            return $app->make(MalwareScannerManager::class)->driver();
        });
    }

    public function boot(): void
    {
        //
    }
}
