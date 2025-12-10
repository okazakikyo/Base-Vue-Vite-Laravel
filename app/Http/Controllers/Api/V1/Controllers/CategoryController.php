<?php

namespace App\Http\Controllers\Api\V1\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\ResponseService;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    private ResponseService $responseService;

    public function __construct(ResponseService $responseService)
    {
        $this->responseService = $responseService;
    }
    /**
     * Return list of categories
     *
     * @param $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $categories = Category::all();
        $categories = ($categories->sortBy('position'))->values()->all();

        return $this->responseService->responseSuccess(
            200,
            '',
            [
                'data' => $categories
            ]
        );
    }
}
