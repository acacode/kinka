
# Changelog


## [1.0.0]

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