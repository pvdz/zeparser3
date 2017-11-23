// requires a clone of https://github.com/tc39/test262.git
// test is skipped if that dir cannot be found

let fs = require('fs');
let path = require('path');

const PATH262 = process.env.HOME + '/apps/test262/src';

if (!fs.statSync(PATH262).isDirectory()) {
  module.exports = () => undefined;
} else {
  let files = {};
  function read(obj, path, file) {
    if (files[file]) throw 'not sure this should happen [key='+file+']'; // this would mean there is a file with same name as dir
    let combo = path + file;
    if (fs.statSync(combo).isFile()) {
      if (file.slice(-5) === '.case') obj[file] = {path: combo, contents: fs.readFileSync(combo)};
    } else {
      fs.readdirSync(combo).forEach(s => read(files['#' + file] = {}, combo  + '/', s));
    }
  }
  read(files, PATH262, '/');

  module.exports = function f(describe, test, list = files) {
    for (let key in list) {
      let obj = list[key];
      if (key[0] === '#') {
        describe(key.slice(1), f.bind(undefined, describe, test, obj))
      } else {
        let code = obj.contents.toString();
        test(key, {
          code: code.slice(code.indexOf('---*/') + '---*/'.length), // dont care so much about the (mandatory) header
          ast: true,
          tokens: true,
          debug: 'test6262 file path: ' + obj.path,
        });
      }
    }
  };
}
