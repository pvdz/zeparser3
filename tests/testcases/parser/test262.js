// requires a clone of https://github.com/tc39/test262.git
// test is skipped if that dir cannot be found

let fs = require('fs');
let path = require('path');

const PATH262 = process.env.HOME + '/apps/test262/test';

if (!fs.statSync(PATH262).isDirectory()) {
  module.exports = () => undefined;
} else {
  let files = {};
  function read(path, file) {
    let combo = path + file;
    if (fs.statSync(combo).isFile()) {
      if (file.slice(-3) === '.js') {
        let lcname = combo.toLowerCase();
        files[combo] = {path: combo, contents: fs.readFileSync(combo), skip: !(
          lcname.indexOf('for-await') < 0 && // TODO: for await is not final yet
          lcname.indexOf('decimal-escape') < 0 && // TODO: web compat: decimal escape classes in regex
          lcname.indexOf('leading-escape') < 0 && // TODO: edge case escape char in regex
          lcname.indexOf('trailing-escape') < 0 && // TODO: edge case escape char in regex
          lcname.indexOf('this-val-regexp') < 0 && // TODO: new regex flags
          lcname.indexOf('unicode-reference') < 0 && // TODO: named back references are not final yet
          lcname.indexOf('named-groups') < 0 && // TODO: named groups are not final yet
          lcname.indexOf('regexp/y-') < 0 && // TODO: y-flag in regexes
          lcname.indexOf('bigint') < 0 && // TODO: adds new number syntax
          lcname.indexOf('lookbehind') < 0 && // TODO: regex ?<= lookbehind https://github.com/tc39/proposal-regexp-lookbehind
          lcname.indexOf('spread-sngl-obj') < 0 && // TODO: object spread is es8 or something
          lcname.indexOf('class-definition-evaluation-scriptbody-duplicate-binding') < 0 && // TODO: duplicate bindings are early error
          lcname.indexOf('yield-star-sync-throw') < 0 && // TODO: async generators are part of the `for await` proposal
          lcname.indexOf('use-strict-with-non-simple-param') < 0 && // wtf even. TODO. I guess.
          lcname.indexOf('vals-rus') < 0 && // TODO: non-ascii idents
          lcname.indexOf('property-escapes') < 0 // TODO: regex \P escape https://github.com/tc39/proposal-regexp-unicode-property-escapes
        )};
      }
    } else {
      fs.readdirSync(combo).forEach(s => read(combo  + '/', s));
    }
  }
  read(PATH262, '');

  module.exports = function f(describe, test, list = files) {
    for (let key in list) if (list.hasOwnProperty(key)) {
      //console.log('->', key)
      let obj = list[key];
      if (key[0] === '#') {
        describe(key.slice(1), f.bind(undefined, describe, test, obj))
      } else {
        let code = obj.contents.toString();
        let headerEndMarker = '---*/';
        let headerEnd = code.indexOf(headerEndMarker);
        if (headerEnd < 0) {
          if (obj.path.indexOf('FIXTURE') < 0) {
            throw new Error('test262: file missing header: ' + key);
          }
          // let's just skip the fixtures for now, they have no header
          continue;
        }

        // some 262 tests target stuff still in staging. simply start those lines with ZIGNORE to exclude them.
        let testObj = {
          code: code.slice(headerEnd + headerEndMarker.length), // dont care so much about the (mandatory) header
          tokens: true,
          debug: 'test6262 file path: ' + obj.path,
        };

        if (obj.skip) {
          testObj.SKIP = true;
        } else {
          // TODO: can we make this check the opposite instead? throw/pass when that's not expected
          if (code.indexOf('[noStrict]')) {
            testObj.STRICT = {SKIP:true};
            testObj.MODULE = {SKIP:true};
          }
          if (code.indexOf('[onlyStrict]') >= 0) testObj.SLOPPY = {SKIP:true};
          if (code.indexOf('[module]') >= 0) testObj.SCRIPT = {SKIP:true};

          if (code.indexOf('negative:') >= 0 && code.indexOf('  phase: runtime') < 0) {
            // "negative:" means the test is expected to throw
            // "  phase: runtime" means the error is a runtime error and we're expected to parse it properly
            testObj.throws = true;
          } else {
            testObj.ast = true;
          }
        }

        test(key, testObj);
      }
    }
  };
}
