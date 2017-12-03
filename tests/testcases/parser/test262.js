// requires a clone of https://github.com/tc39/test262.git
// test is skipped if that dir cannot be found

let fs = require('fs');
let path = require('path');

const PATH262 = process.env.HOME + '/apps/test262/test';

if (!fs.statSync(PATH262).isDirectory()) {
  module.exports = () => undefined;
} else {
  let files = {};
  function read(obj, path, file) {
    let combo = path + file;
    if (fs.statSync(combo).isFile()) {
      if (file.slice(-3) === '.js') {
        if (
          combo.indexOf('for-await') < 0 && // for await is not final yet
          file.indexOf('this-val-regexp') < 0 && // new regex flags
          file.indexOf('unicode-reference') < 0 && // named back references are not final yet
          combo.indexOf('regexp/y-') < 0 && // y-flag in regexes
          combo.indexOf('BigInt') < 0 && // adds new number syntax
          combo.indexOf('lookBehind') < 0 && // regex ?<= lookbehind https://github.com/tc39/proposal-regexp-lookbehind
          combo.indexOf('property-escapes') < 0 // regex \P escape https://github.com/tc39/proposal-regexp-unicode-property-escapes
        ) {
          obj[combo] = {path: combo, contents: fs.readFileSync(combo)};
        }
      }
    } else {
      fs.readdirSync(combo).forEach(s => read(files['#' + file] = {}, combo  + '/', s));
    }
  }
  read(files, PATH262, '');

  module.exports = function f(describe, test, list = files) {
    for (let key in list) {
      console.log('->', key)
      let obj = list[key];
      if (key[0] === '#') {
        describe(key.slice(1), f.bind(undefined, describe, test, obj))
      } else {
        let code = obj.contents.toString();
        // some 262 tests target stuff still in staging. simply start those lines with ZIGNORE to exclude them.
        if (code.indexOf('ZIGNORE') !== 0) {
          if (code.indexOf('negative:') >= 0) {
            test(key, {
              code: code.slice(code.indexOf('---*/') + '---*/'.length), // dont care so much about the (mandatory) header
              throws: true, // for now, let's not care about the actual error too much (must still be a handled path)
              tokens: true,
              debug: 'test6262 file path: ' + obj.path,
              startInStrictMode: code.indexOf('[onlyStrict]') >= 0,
            });
          } else {
            test(key, {
              code: code.slice(code.indexOf('---*/') + '---*/'.length), // dont care so much about the (mandatory) header
              ast: true,
              tokens: true,
              debug: 'test6262 file path: ' + obj.path,
              startInStrictMode: code.indexOf('[onlyStrict]') >= 0,
            });
          }
        }
      }
    }
  };
}
