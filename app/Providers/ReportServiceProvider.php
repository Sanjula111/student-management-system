<?php

namespace App\Providers;

use App\Services\ReportService;
use Illuminate\Support\ServiceProvider;

class ReportServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton('report.service', function ($app) {
            return new ReportService();
        });
    }

    public function boot(): void
    {
        //
    }
}
