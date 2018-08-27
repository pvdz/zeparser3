// requires a clone of https://github.com/tc39/test262.git
// test is skipped if that dir cannot be found

let fs = require('fs');
let path = require('path');

const PATH262 = __dirname + '/../../../ignore/test262/test';

if (!fs.statSync(PATH262).isDirectory()) {
  console.warn('Test 262 path is not a dir, skipping', PATH262);
  module.exports = () => undefined;
} else {
  let files = {};
  function read(path, file) {
    let combo = path + file;
    if (fs.statSync(combo).isFile()) {
      if (file.slice(-3) === '.js') {
        let lcname = combo.toLowerCase();
        function has(s) { return lcname.includes(s.toLowerCase()); }
        files[combo] = {
          path: combo,
          contents: fs.readFileSync(combo),
          annexb: lcname.indexOf('annexb') >= 0,
          skip:
            // these are tests that I choose to ignore while the parser matures
            (has('annexb') && (has('regexp') || has('escape'))) || // TODO: web compat: lots of regex/escape cruft to support

            has('async-arrow-function/early-errors-arrow-await-in-formals') || // TODO: crappy async edge case check
            has('let-block-with-newline') || // TODO: crappy let block edge case (similar to the async case)

            has('redeclare-with-') || has('function/param-eval') || has('generators/param-dflt-yield') || has('param-redecl') || has('early-dup') || // TODO: fix once we fix scoping and duplicate binding checks (class, async)
            has('/early-lex-and-var') || has('parse-err-hoist-lex') || has('redeclaration') || has('head-let-bound-names') || // more scoping
            has('head-const-bound-names') || has('function/13.1') || has('attempt-to-redeclare-let-binding-with') || has('try/early-catch') || // more scoping
            has('early-export-global') || has('early-export-unresolvable') || // TODO: cannot export something that wasnt explicitly bound (implicit globals, built-ins)
            has('duplicate') || // TODO: duplicate arg bindings
            has('import/dup-bound-names') || // TODO: dupe imports

            has('other_id_continue') || has('other_id_start') || has('vals-rus-alpha') || has('own-property-keys-sort') || // TODO: unicode identifier characters

            false
        };
      }
    } else {
      fs.readdirSync(combo).forEach(s => read(combo + '/', s));
    }
  }
  read(PATH262, '');

  module.exports = function f(describe, test, list = files) {
    for (let testFileName in list)
      if (list.hasOwnProperty(testFileName)) {
        //console.log('->', testFileName)
        let obj = list[testFileName];
        if (testFileName[0] === '#') {
          describe(testFileName.slice(1), f.bind(undefined, describe, test, obj));
        } else {
          let code = obj.contents.toString();

          // particular features (especially new ones) will be mentioned in the header so we can filter en-mass based on that here
          // generated: call arg trailing comma
          if (/features:.*(?:numeric-separator-literal|bigint|regexp-dotall|regexp-named-groups|class-fields-public|class-fields-private|optional-catch-binding)/i.test(code)) obj.skip = true;

          let headerEndMarker = '---*/';
          let headerEnd = code.indexOf(headerEndMarker);
          if (headerEnd < 0) {
            if (obj.path.indexOf('FIXTURE') < 0) {
              throw new Error('test262: file missing header: ' + testFileName);
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

          function has(s) { return testFileName.toLowerCase().includes(s.toLowerCase()); }

          if (obj.skip) {
            testObj.SKIP = true;
          } else {
            if (
              // test262 tests opt-in to module so by default they're only intended for script goal
              // most of these tests run fine for both so I'm just going to blacklist the sets of tests where it matters
              has('class/gen-method-static-yield-spread-arr-single.js') ||
              has('class/gen-method-yield-spread-arr-single.js') ||
              has('language/global-code/S10.1.7_A1_T1.js') || // (delete this == x)
              has('language/global-code/export.js') || // "do not export in script goal"
              has('language/global-code/import.js') || // "do not import in script goal"
              has('instn-resolve-') || // resolution error, not syntax error (in this file, at least)
              has('reserved-words/await-script') || // tests await as var name in script mode
              has('annexB/language/comments/multi-line-html') || // html comment in strict mode are bad
              has('annexB/language/comments/single-line-html') || // html comments in strict mode are bad
              has('await-in-generator') || // tests await being an ident inside a generator, which is outright illegal in module goal
              has('delete/11.4.1-2-6.js') || // delete null
              has('delete/11.4.1-2-3.js') || // delete true
              has('labeled/value-await-non-module-escaped.js') || // asserts `await` can be a label name in sloppy and strict, only valid in SCRIPT goal
              has('labeled/value-await-non-module.js') || // asserts `await` can be a label name in sloppy and strict, only valid in SCRIPT goal
            false) {
              testObj.MODULE = {SKIP: true};
            }

            // TODO: can we make this check the opposite instead? throw/pass when that's not expected
            if (/^\s*flags:.*?\bnoStrict\b/m.test(code)) {
              testObj.STRICT = {SKIP: true};
              testObj.MODULE = {SKIP: true};
            }
            if (/^\s*flags:.*?\bonlyStrict\b/m.test(code)) {
              testObj.SLOPPY = {SKIP: true};
            }
            if (/^\s*flags:.*?\bmodule\b/m.test(code)) {
              testObj.SCRIPT = {SKIP: true};
            }
            testObj.WEB = obj.annexb;

            if (/^\s*negative:/m.test(code) && code.indexOf('  phase: runtime') < 0) {
              // "negative:" means the test is expected to throw
              // "  phase: runtime" means the error is a runtime error and we're expected to parse it properly
              testObj.throws = true;
            } else {
              testObj.ast = true;
            }
          }

          test(testFileName, testObj);
        }
      }
  };
}
