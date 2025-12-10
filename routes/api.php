<?php

use App\Http\Controllers\Api\V1\Controllers\AuthController;
use App\Http\Controllers\Api\V1\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:user')->group(function () {
        Route::prefix('categories')->group(function () {
            Route::get('', [CategoryController::class, 'index']);
        });
    });
});

Route::fallback(['message' => 'Not Found']);
