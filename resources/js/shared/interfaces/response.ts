export interface MetaPaging {
    page: number;
    current_page?: number;
    last_page?: number;
    per_page: number;
    total?: number;
}

export interface Response<T = ResultResponse> {
    code?: number;
    message?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    result: T;
}

export interface ImageData {
    file: File | string | null;
    link: string | null;
    'absolute-path': string | null;
    width: number;
    height: number;
    mime: string;
    size: number;
}

export interface ImageResponse {
    code?: number;
    message?: string;
    result: ImageData;
}

export interface ResultResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    meta?: MetaPaging;
    image: ImageResponse;
    code?: number;
    message?: string;
}

export interface ErrorResponse<T = ResultResponse> {
    status: number;
    data: T;
}
