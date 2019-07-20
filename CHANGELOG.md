# CHANGELOG

<!-- TEMPLATE OF NEW VERSION -->

<!-- 
## [VERSION](https://github.com/acacode/kinka/releases/tag/VERSION)

### Changed
### Fixed
### Added
### Removed
 -->

## [3.0.0-alpha.1]  

### Fixed  
- problem with using IP as baseURL ([issue](https://github.com/acacode/kinka/issues/19))  

### Added
- More additional builds and rollup  

### Changed  
- Reduced library size (.3KB)

### Removed  
- `withAuth` property because it is deprecated property  
- non promised builds (just use polyfills)  
- [Internal] Webpack build  


## [2.5.6](https://github.com/acacode/kinka/releases/tag/2.5.6)

### Fixed
- BREAKING CHANGE: Prev. version is haven't build files. This version is solved problem.

## [2.5.5](https://github.com/acacode/kinka/releases/tag/2.5.5)

### Fixed
- Production builds

## [2.5.4](https://github.com/acacode/kinka/releases/tag/2.5.4)

### Added
- Warnings/Checks linked with non valid type or empty value for develop kinka version  
- Extra builds with the partially `Promise` support
- method `kinka.clone()` to copy current kinka instance
- Manual tests
- `credentials` property can be seated in kinka instance

### Changed
- [internal] Creating of new kinka instance ( methods always will be binded to instance )  
- [internal] Renamed `instanceOptions` to `config` ( for `kinka.create(config)` and `kinka.instanceOptions` -> `kinka.config` )  
- Renamed `withAuth` to `credentials` for more name readability  

### Fixed
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