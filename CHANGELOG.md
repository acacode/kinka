
# CHANGELOG

## [next](https://github.com/acacode/kinka/releases/tag/next)

### Added
- Warning of type checks or empty checks for develop kinka version  

### Changed
- Typo fixes in `README.md`


## [2.0.0](https://github.com/acacode/kinka/releases/tag/2.0.0)

### Removed
- Property `body` from `KinkaRequestOptions` (renamed to `data`)  
- Property `abortableKey` from `KinkaRequestOptions` (renamed to `cancelToken`)  

### Changed
- Unit tests for request methods using `nock` and `xmlhttprequest` testing libraries  
- Small code refactoring  
- Changed logic in `parseResponseData` response helper. Currently is not required availability of  `application/json` response headers

### Added
- Unit tests for request helpers:  
  - abortRequest  
  - createAbortableRequest  
  - createRequest  
  - getUrl  
  - getUrlWithQuery  
  - prepareRequestData  
  - removeAbortableKey  
  - requestIsSuccess  
  - setHeaders  
  - abortableRequests  
  - updateContentType  
- Unit tests for response helpers:  
  - createResponse  
  - parseResponseData  
  - getHeaders  
- extra `onDownloadProgress` property for `KinkaRequestOptions`  
- extra `onUploadProgress` property for `KinkaRequestOptions`  

## [1.0.4](https://github.com/acacode/kinka/releases/tag/1.0.4)

### Changed
- Renamed `abortableKey` to `cancelToken` for more readability.  
- Small changes in warning deprecation messages

## [1.0.3](https://github.com/acacode/kinka/releases/tag/1.0.3)

### Changed
- default value for `KinkaResponse`.`data` and `KinkaResponse`.`err` has been changed from `undefined` to `null`

### Fixed
- Added default error message `{}` in `KinkaResponse` if request catches error  
- Transforming/Preparing `data` of the request before sending on server  
- Transforming/Preparing `data` of the response before returning to user  

## [1.0.0](https://github.com/acacode/kinka/releases/tag/1.0.1)

### Deprecated
- property `body` in [`KinkaRequestOptions`](./index.d.ts)  
    Example: `kinka.post('/some-data', { body: { foo: 'bar' }})`    
    _This property will be removed in the next versions_  

### Fixed
- Fixed problems linked with creating request via kinka  

### Added
- TravisCI intergration  
- Unit tests for:  
  - kinka instance:  
    - kinka basic methods (`delete`, `get`, `head`, `options`, `patch`, `post`, `put`)  
    - kinka `customMethods` option ( `kinka.create({ customMethods: ['foo'] })`)  
    - `kinka.custom()` function  
    - kinka `baseURL` option ( `kinka.create({ baseURL: 'https://foo.bar' })`)  
  - base helpers:  
    - `merge()`  
    - `isObject()`  
    - `parseJSON()`  
    - `isUndefined()`  
- Initial karma config  