/**
 * Object which will returns as result of completed request
 * Example:
 * kinka.get('/data').then(response => {
 *  // response it is this interface
 * })
 * @interface KinkaResponse
 * @template T
 */
export declare interface KinkaResponse<T = any>  {
    /**
     * response data of the request.
     * 
     * @type {((T | null | any))}
     * @memberof KinkaResponse
     */
    data: (T | null | any);

    /**
     * this property indicates that request been failed too.
     * And also return error message, or bad response, or empty object.
     * 
     * @type {((object | T | null | any))}
     * @memberof KinkaResponse
     */
    err: (object | T | null | any);

    /**
     * Map of the response headers.
     * 
     * @type {object}
     * @memberof KinkaResponse
     */
    headers: object;

    /**
     * This property indicates that request has been failed.
     * 
     * @type {boolean}
     * @memberof KinkaResponse
     */
    isError: boolean;

    /**
     * This property indicates that request has been completed successfully.
     * 
     * @type {boolean}
     * @memberof KinkaResponse
     */
    isSuccess: boolean,

    /**
     * Raw response data from http request.
     * Read more: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response
     * 
     * @type {((ArrayBuffer | Blob | Document | Object | string | any))}
     * @memberof KinkaResponse
     */
    response: (ArrayBuffer | Blob | Document | Object | string | any),

    /**
     * Status code of http request.
     * Status codes list: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
     * 
     * @type {number}
     * @memberof KinkaResponse
     */
    status: number,

    /**
     * Status message of http request.
     * Read more: https://developer.mozilla.org/en-US/docs/Web/API/Response/statusText
     * 
     * @type {string}
     * @memberof KinkaResponse
     */
    statusText: string,

    /**
     * Original response type from http request.
     * Read more: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
     * 
     * @type {(('arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'ms-stream' | 'moz-chunked-arraybuffer'))}
     * @memberof KinkaResponse
     */
    type: ('arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'ms-stream' | 'moz-chunked-arraybuffer'),
}


/**
 * Configuration object for your request
 * All properties in this object will override instance options
 * Example:
 * kinka.get('/url', { baseURL: 'https://overriden-api.com' })
 * @interface KinkaRequestOptions
 */
export declare interface KinkaRequestOptions{

    /**
     * With abortable key your request have ability to cancel last request if request with the same key is start launching
     *
     * @type {string}
     * @memberof KinkaRequestOptions
     */
    abortableKey?: string;

    /**
     * Sets data for the instance `auth` mixin.
     * Only works if `auth` mixin is setted in instance options
     *
     * @type {*}
     * @memberof KinkaRequestOptions
     */
    auth?:any;

    /**
     * Sets the `baseURL` for instance.
     * Allows to set base url address for server.
     *
     * @type {string}
     * @memberof KinkaRequestOptions
     */
    baseURL?: string;

    /**
     * Sets the request body. It is content which needed to send on server
     *
     * @type {*}
     * @memberof KinkaRequestOptions
     */
    data?: any;

    /**
     * Allows to set request headers for this request
     *
     * @type {object}
     * @memberof KinkaRequestOptions
     */
    headers?: object;

    /**
     * With {true} your responses will not be throwing exceptions and you don't need to wrap your requests in try/catch.
     * And if you want to catch exception you can get this from {response.err} or {response.isError}
     * Example:
     * const { err, status } = await kinka.get('/bad-request')
     * if(err){
     *   // catched exception
     * }
     * Another example:
     * try {
     *   const response = await kinka.get('/bad-request', {
     *     omitCatches: false
     *   })
     * } catch (e) {
     *   console.error(e.err)
     *   // catched exception
     * }
     *
     * @type {boolean}
     * @memberof KinkaRequestOptions
     */
    omitCatches?: boolean;
    onDownloadProgress?: (progressEvent: ProgressEvent)=>any
    onUploadProgress?: (progressEvent: ProgressEvent)=>any
    query?: object;
    successStatus?: number;
    timeout?: number;
    withAuth?: boolean;
}

/**
 * Object which sending when user creating a new instance
 * @interface KinkaInstanceOptions
 */
export declare interface KinkaInstanceOptions{
    auth?: (authData:any)=>(KinkaRequestOptions|any)
    baseURL?: string;
    customMethods?: (string[] | null);
    headers?: object;
    inspectors?: { 
        request?: (url: string, method: string, options?: KinkaRequestOptions)=>(KinkaRequestOptions|any), 
        response?: <T = any, R = KinkaResponse<T>>(url: string, method: string, response: R)=>(R|any), 
    }
    omitCatches?: boolean;
    timeout?: number;
}

/**
 * List of methods which have kinka instance
 * @export
 * @interface KinkaInstance
 */
export interface KinkaInstance {
    abort(abortableKey: string):undefined;
    all<T>(promises: Promise<T>[]): Promise<T[]>;
    create(options?: KinkaInstanceOptions): KinkaInstance;
    custom<T = any, R = KinkaResponse<T>>(method: string, path: string, options?: KinkaRequestOptions): Promise<R>;
    delete<T = any, R = KinkaResponse<T>>(path: string, options?: KinkaRequestOptions): Promise<R>;
    get<T = any, R = KinkaResponse<T>>(path: string, options?: KinkaRequestOptions): Promise<R>;
    head<T = any, R = KinkaResponse<T>>(path: string, options?: KinkaRequestOptions): Promise<R>;
    options<T = any, R = KinkaResponse<T>>(path: string, options?: KinkaRequestOptions): Promise<R>;
    patch<T = any, R = KinkaResponse<T>>(path: string, data?: any, options?: KinkaRequestOptions): Promise<R>;
    post<T = any, R = KinkaResponse<T>>(path: string, data?: any, options?: KinkaRequestOptions): Promise<R>;
    put<T = any, R = KinkaResponse<T>>(path: string, data?: any, options?: KinkaRequestOptions): Promise<R>;
    
    /**
     * custom method works only if 
     * this method name send to 'customMethods' to instance options when you was created new kinka instance.
     * Otherwise will be catched an error - "kinka['property'] is not a function"
     */
    [customMethod: string]: <T = any, R = KinkaResponse<T>>(path: string, options?: KinkaRequestOptions) => Promise<R>;
}

declare const kinka: KinkaInstance;

export default kinka