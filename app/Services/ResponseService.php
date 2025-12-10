<?php
namespace App\Services;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ResponseService extends JsonResponse  implements ResponseServiceInterface {

    /**
     * function responseSuccess
     * @access public
     * @param int|string $code
     * @param string $message
     * @param array|object $data
     * @param mixed|null $opt
     * @param int $statusCode
     * @return JsonResponse
     * @author ThangNguyen
     * @since 2025/05/30
     */
    public function responseSuccess(int|string $code = 200, string $message = '', array|object $data = [], mixed $opt=null, int $statusCode =200): JsonResponse
    {
        if (!empty($opt)) {
            return response()->json([
                'code' => $code,
                'message' => $message,
                ...$data,
            ], $statusCode);
        }
        return response()->json([
            'code' => $code,
            'message' => $message,
            'result' => $data,
        ], $statusCode);
    }

    /**
     * function responseError
     * @access public
     * @param int|string $code
     * @param string $message
     * @param array $data
     * @param int $statusCode
     * @return JsonResponse
     * @since 2025/05/30
     * @author ThangNguyen
     */
    public function responseError(int|string $code = 200, string $message = '', array $data = [], int $statusCode = 500): JsonResponse
    {

        if (empty($message)) {
            Log::error('ResponseService: responseError called with empty message');
        }elseif (is_array($message)) {
            $message = implode(', ', $message);
            Log::error($message);
        }else {
            Log::error($message);
        }
        return response()->json([
            'result' => [
                'code' => $code,
                'message' => $message,
                'data' => $data
            ]
        ], $statusCode);
    }

}
