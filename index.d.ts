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
    cancelKey?: string;

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

    /**
     * Allows to handle progress of the request download
     *
     * @type {function}
     * @memberof KinkaRequestOptions
     */
    onDownloadProgress?: (progressEvent: ProgressEvent)=>any

    /**
     * Allows to handle progress of the request upload
     *
     * @type {function}
     * @memberof KinkaRequestOptions
     */
    onUploadProgress?: (progressEvent: ProgressEvent)=>any

    /**
     * query params for your http request
     * Example:
     * kinka.get('/all', { 
     * query: { 
     *     disabled: true, 
     *     sortBy: 'date' 
     * }})
     * // request will have url {{baseURL}}/all?disabled=true&sortBy=date
     *
     * @type {object}
     * @memberof KinkaRequestOptions
     */
    query?: object;

    /**
     * Allows to set specific success status for your http request
     * If you added this property with 201 value then all another responses
     * with success status codes will be catches an exception,
     * or will have fulfilled `err` property
     *
     * @type {number}
     * @memberof KinkaRequestOptions
     */
    successStatus?: number;

    /**
     * Sets the number of milliseconds after which request automatically will be terminated. 0 value means no timeout.
     * Read more: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
     *
     * @type {number}
     * @memberof KinkaRequestOptions
     */
    timeout?: number;

    /**
     * Indicates that this request should use credentials (like cookies or specific auth headers)
     * Sets flag {request.withCredentials}
     * Read more: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
     *
     * @type {boolean}
     * @memberof KinkaRequestOptions
     */
    withAuth?: boolean;
}

/**
 * Object which sending when user creating a new instance
 * @interface KinkaInstanceOptions
 */
export declare interface KinkaInstanceOptions{

    /**
     * Allows to attach auth mixin for requests in your kinka instance.
     * It mixin will be modify your request options before sending request.
     * Example:
     * 
     * const api = kinka.create({
     *  baseURL: `${baseURL}/${apiPath}`,
     *    auth: ({ username, password }) => ({
     *        headers: {
     *        Auth: `Token ${username}:${stringToSHA256(password)}`,
     *       },
     *    }),
     *  })
     *  api.get('/data', {
     *    auth: { username: 'TheFlash', password: 'SpeedF0rce' },
     *  })
     * 
     * @type {function}
     * @memberof KinkaInstanceOptions
     */
    auth?: (authData:any)=>(KinkaRequestOptions|any)

    /**
     * Sets the `baseURL` for instance.
     * Allows to set base url address for server.
     * Example:
     * const api = kinka.create({ baseURL: 'https://api.com' })
     * api.get('/data') //GET: https://api.com/data
     *
     * @type {string}
     * @memberof KinkaInstanceOptions
     */
    baseURL?: string;

    /**
     * Allows to create instance methods which will have special http methods.
     *
     * @type {((string[] | null))}
     * @memberof KinkaInstanceOptions
     */
    customMethods?: (string[] | null);

    /**
     * Allows to set specific headers for each request created via instance
     * Example:
     * const api = kinka.create({
     *   baseURL: 'https://api.com',
     *   headers: {
     *    'API_VERSION': '01',
     *   },
     * })
     * api.get('/data')
     * GET: https://api.com/data
     * headers: {
     *   "API_VERSION": "01"
     * }
     *
     * @type {object}
     * @memberof KinkaInstanceOptions
     */
    headers?: object;

    /**
     * Allows to attach inspectors to your kinka instance.
     * Inspectors it is watchers for requests or responses
     * which allows dynamically change request options or response data.
     * If needed to change request options or response data then
     * need to return modified options/response.
     * Example:
     * const api = kinka.create({
     *   baseURL: `${baseURL}/${apiPath}`,
     *   inspectors: {
     *     request: (url, method, options) => {
     *       console.log(`request ${url}`, options)
     *       // here request will be not modified
     *     },
     *     response: (url, method, response) => {
     *       console.log(`response ${url}`, response)
     *       if(!response.data){
     *           response.data = null
     *       }
     *       // here response will be modified
     *       // and data will be null 
     *       return response
     *     },
     *   },
     * })
     * 
     * @type {{ request?: function, response?: function }} object with optionable `request` and `response` keys
     * @memberof KinkaInstanceOptions
     */
    inspectors?: {

        /**
         * callback which will be called always when request will been created
         * 
         * @type {function}
         */
        request?: (url: string, method: string, options?: KinkaRequestOptions)=>(KinkaRequestOptions|any),

        /**
         * callback which will be called always when request returned response
         *
         * @type {function}
         */
        response?: <T = any, R = KinkaResponse<T>>(url: string, method: string, response: R)=>(R|any), 
    }

    /**
     * With {true} your responses will not be throwing exceptions and you don't need to wrap your requests in try/catch.
     * And if you want to catch exception you can get this from {response.err} or {response.isError}
     * Example:
     * const api = kinka.create('https://api.com', { omitCatches: true })
     * ...
     * // here the application is not been crashed
     * const { err } = await api.get('/bad-request')
     * if(err){
     *   // catched error
     *   console.log(err)
     * }
     * 
     * @type {boolean} - by default will be {true}
     * @memberof KinkaInstanceOptions
     */
    omitCatches?: boolean;

    /**
     * Sets the number of milliseconds after which
     * request automatically will be terminated. 0 value means no timeout.
     * Read more: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
     *
     * @type {number} - by default no timeout
     * @memberof KinkaInstanceOptions
     */
    timeout?: number;
}

/**
 * List of methods which have kinka instance
 * @export
 * @interface KinkaInstance
 */
export interface KinkaInstance {

    /**
     *
     *
     * @param {string} cancelKey
     * @returns {undefined} 
     * @memberof KinkaInstance
     */
    abort(cancelKey: string):undefined;

    /**
     *
     *
     * @template T
     * @param {Promise<T>[]} promises
     * @returns {Promise<T[]>}
     * @memberof KinkaInstance
     */
    all<T>(promises: Promise<T>[]): Promise<T[]>;

    /**
     *
     *
     * @param {KinkaInstanceOptions} [options]
     * @returns {KinkaInstance}
     * @memberof KinkaInstance
     */
    create(options?: KinkaInstanceOptions): KinkaInstance;

    /**
     *
     *
     * @template T
     * @template R
     * @param {string} method
     * @param {string} path
     * @param {KinkaRequestOptions} [options]
     * @returns {Promise<R>}
     * @memberof KinkaInstance
     */
    custom<T = any, R = KinkaResponse<T>>(method: string, path: string, options?: KinkaRequestOptions): Promise<R>;

    /**
     *
     *
     * @template T
     * @template R
     * @param {string} path
     * @param {KinkaRequestOptions} [options]
     * @returns {Promise<R>}
     * @memberof KinkaInstance
     */
    delete<T = any, R = KinkaResponse<T>>(path: string, options?: KinkaRequestOptions): Promise<R>;

    /**
     *
     *
     * @template T
     * @template R
     * @param {string} path
     * @param {KinkaRequestOptions} [options]
     * @returns {Promise<R>}
     * @memberof KinkaInstance
     */
    get<T = any, R = KinkaResponse<T>>(path: string, options?: KinkaRequestOptions): Promise<R>;

    /**
     *
     *
     * @template T
     * @template R
     * @param {string} path
     * @param {KinkaRequestOptions} [options]
     * @returns {Promise<R>}
     * @memberof KinkaInstance
     */
    head<T = any, R = KinkaResponse<T>>(path: string, options?: KinkaRequestOptions): Promise<R>;

    /**
     *
     *
     * @template T
     * @template R
     * @param {string} path
     * @param {KinkaRequestOptions} [options]
     * @returns {Promise<R>}
     * @memberof KinkaInstance
     */
    options<T = any, R = KinkaResponse<T>>(path: string, options?: KinkaRequestOptions): Promise<R>;

    /**
     *
     *
     * @template T
     * @template R
     * @param {string} path
     * @param {*} [data]
     * @param {KinkaRequestOptions} [options]
     * @returns {Promise<R>}
     * @memberof KinkaInstance
     */
    patch<T = any, R = KinkaResponse<T>>(path: string, data?: any, options?: KinkaRequestOptions): Promise<R>;

    /**
     *
     *
     * @template T
     * @template R
     * @param {string} path
     * @param {*} [data]
     * @param {KinkaRequestOptions} [options]
     * @returns {Promise<R>}
     * @memberof KinkaInstance
     */
    post<T = any, R = KinkaResponse<T>>(path: string, data?: any, options?: KinkaRequestOptions): Promise<R>;

    /**
     *
     *
     * @template T
     * @template R
     * @param {string} path
     * @param {*} [data]
     * @param {KinkaRequestOptions} [options]
     * @returns {Promise<R>}
     * @memberof KinkaInstance
     */
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