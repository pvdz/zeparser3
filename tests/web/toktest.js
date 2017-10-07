function require(url) {
  console.warn('require: importing', url, require['__' + url]);
  return require['__' + url]
}
module = {exports: {}};