
declare interface KinkaResponse<T = any>  {
    data: T;
    err: (object | T | any);
    headers: object;
    isError: boolean;
    isSuccess: boolean,
    response: (ArrayBuffer | Blob | Document | Object | string | any),
    status: number,
    statusText: string,
    type: ('arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'ms-stream' | 'moz-chunked-arraybuffer'),
}

declare interface KinkaRequestOptions{
    headers?: object;
    withAuth?: boolean;
    query?: object;
    abortableKey?: string;
    successStatus?: number;
    omitCatches?: boolean;
    body?: any;
    baseURL?: string;
}

declare interface KinkaInstanceOptions{
    baseURL?: string;
    omitCatches?: boolean;
    headers: {};
    timeout?: number;
    customMethods?: (string[] | null);
}

export interface KinkaInstance {
    all<T>(promises: Promise<T>[]): Promise<T[]>;
    create(options?: KinkaInstanceOptions): KinkaInstance;
    custom<T = any, R = KinkaResponse<T>>(method: string, path: string, options?: KinkaRequestOptions): Promise<R>;
    delete<T = any, R = KinkaResponse<T>>(path: string, options?: KinkaRequestOptions): Promise<R>;
    get<T = any, R = KinkaResponse<T>>(path: string, options?: KinkaRequestOptions): Promise<R>;
    head<T = any, R = KinkaResponse<T>>(path: string, options?: KinkaRequestOptions): Promise<R>;
    options<T = any, R = KinkaResponse<T>>(path: string, options?: KinkaRequestOptions): Promise<R>;
    patch<T = any, R = KinkaResponse<T>>(path: string, body?: any, options?: KinkaRequestOptions): Promise<R>;
    post<T = any, R = KinkaResponse<T>>(path: string, body?: any, options?: KinkaRequestOptions): Promise<R>;
    put<T = any, R = KinkaResponse<T>>(path: string, body?: any, options?: KinkaRequestOptions): Promise<R>;
    
    /**
     * custom method works only if 
     * this method name send to 'customMethods' to instance options when you was created new kinka instance.
     * Otherwise will be kinka['property'] is not a function
     */
    [customMethod: string]: <T = any, R = KinkaResponse<T>>(path: string, options?: KinkaRequestOptions) => Promise<R>;
}

declare const Kinka: KinkaInstance;

export default Kinka