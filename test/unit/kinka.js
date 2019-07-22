import { testKinka } from '../__helpers__'

// const clearDevFunctions = () => {
//   delete global['typeCheck']
//   delete global['emptyCheck']
// }

// It's requred to test all kinka versions
// Because what if some version is not contains specific function ?
// Like typeCheck or emptyCheck
testKinka('../src/kinka.js', 'src')
testKinka('../dist/kinka.js', 'dev')
testKinka('../dist/kinka.min.js', 'prod')
testKinka('../lib/kinka.js', 'dev')
testKinka('../lib/kinka.min.js', 'prod')
testKinka('../es/kinka.js', 'dev')
