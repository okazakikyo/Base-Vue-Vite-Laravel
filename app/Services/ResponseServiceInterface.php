<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;

interface ResponseServiceInterface
{
    /**
     * @param int|string $code
     * @param string $message
     * @param array|object $data
     * @param null $opt
     * @param int $statusCode
     * @return JsonResponse
     */
    public function responseSuccess(int|string $code = 200, string $message = '', array|object $data = [],mixed $opt = null, int $statusCode = 200): JsonResponse;

    /**
     * @param int|string $code
     * @param string $message
     * @param array $data
     * @param int $statusCode
     * @return JsonResponse
     */
    public function responseError(int|string $code = 200, string $message = '', array $data = [], int $statusCode = 500): JsonResponse;
}
