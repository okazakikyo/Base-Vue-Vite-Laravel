<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $e, Request $request) {
            Log::error($e);
            dd($e);
            if( $e instanceof NotFoundHttpException) {
                return response()->json([
                    'result' => [
                        'code' => 'CMSE04',
                        'message' => 'エラーが発生しました。もう一度お試しください。'
                    ]
                ], 404);
            }
            return response()->json([
                'result' => [
                    'code' => 'CMSE04',
                    'message' => 'エラーが発生しました。もう一度お試しください。'
                ]
            ], 500);
        });
    })->create();
