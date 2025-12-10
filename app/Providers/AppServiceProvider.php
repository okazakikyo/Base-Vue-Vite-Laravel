<?php

namespace App\Providers;

use App\Services\Auth\UserService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(\App\Services\ResponseServiceInterface::class, \App\Services\ResponseService::class);
        $this->app->singleton(UserService::class, function($app) {
            return new UserService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
