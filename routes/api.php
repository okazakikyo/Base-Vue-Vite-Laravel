<?php

use App\Http\Controllers\Api\V1\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
    Route::post('/login', [AuthController::class, 'login']);
});

Route::fallback(['message' => 'Not Found']);
