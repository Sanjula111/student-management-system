<?php

namespace App\Providers;

use App\Facades\StudentFacade;
use App\Services\StudentService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bind the Facade Design Pattern classes into the service container.
     *
     * StudentFacade depends on StudentService.
     * Laravel auto-injects StudentService when resolving StudentFacade.
     */
    public function register(): void
    {
        $this->app->singleton(StudentService::class);

        $this->app->singleton(StudentFacade::class, function ($app) {
            return new StudentFacade($app->make(StudentService::class));
        });
    }

    public function boot(): void {}
}
