type RequestError = Error & {
    status: number;
    url: string;
};
type RequestOptions = {
    withCredentials?: boolean;
    headers?: object;
    data?: any;
    url: string;
    name: string;
    file: string | Blob;
    progress?: (data: {
        lengthComputable: any;
        loaded: number;
        target: any;
        total: number;
        percent: number;
    }, options: RequestOptions) => void;
    abort?: (error: RequestError, options: RequestOptions) => void;
    error?: (error: RequestError, options: RequestOptions) => void;
    success?: (data: any, options: RequestOptions) => void;
};
export declare function uploadRequest(options: RequestOptions): {
    abort(): void;
};
export {};
