<?php

namespace App\Providers;

use App\Facades\StudentFacade;
use App\Services\StudentService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(StudentService::class);
        $this->app->singleton(StudentFacade::class, fn($app) =>
            new StudentFacade($app->make(StudentService::class))
        );
    }

    public function boot(): void {}
}
