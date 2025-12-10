<?php

namespace App\Http\Controllers\Api\V1\Controllers;

use App\Services\Auth\UserService;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\Eloquent\UserRepository;
use App\Services\ResponseService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    private ResponseService $responseService;
    private UserService $authService;
    private UserRepository $userRepository;

    public function __construct(ResponseService $responseService, UserService $authService, UserRepository $userRepository)
    {
        $this->responseService = $responseService;
        $this->authService = $authService;
        $this->userRepository = $userRepository;
    }
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = $this->userRepository->findOneBy('email', $request->email);

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->responseService->responseError(401, 'Invalid email or password');
        }

        $this->authService->authenticate(
            $user,
            $request->password
        );
        $token = $user->createToken('token')->plainTextToken;
        $user->remember_token = $token;
        $user->save();
        $response = [
            'token' => $token,
            'user' => $user
        ];

        return $this->responseService->responseSuccess(
            200,
            '',
            $response
        );
    }
}
