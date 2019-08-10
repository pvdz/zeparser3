// requires a clone of https://github.com/tc39/test262.git
// test is skipped if that dir cannot be found

import fs from 'fs';
import path from 'path';
import {GOAL_MODULE, GOAL_SCRIPT} from "../src/zetokenizer.mjs";
import {ASSERT} from "../tests/utils.mjs";
import Par from "../src/zeparser.mjs";

// node does not expose __dirname under module mode, but we can use import.meta to get it
let filePath = import.meta.url.replace(/^file:\/\//, '');
let dirname = path.dirname(filePath);

const BOLD = '\x1b[;1;1m';
const BLINK = '\x1b[;5;1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

// cd zeparser3/ignore
// git clone https://github.com/tc39/test262.git
const PATH262 = path.join(dirname, './../ignore/test262/test');

let stdout = [];
let parse = (input, strict, module, web) => (stdout=[]) && Par(
  input,
  module ? GOAL_MODULE : GOAL_SCRIPT,
  true,
  {
    strictMode: strict,
    webCompat: !!web,
    // astRoot: ast,
    // tokenStorage: tokens,
    // getTokenizer: tok => tokenizer = tok,
    // targetEsVersion: ES || Infinity,
    fullErrorContext: true,

    // Collect output but don't print it in case the retry fails
    $log: (...a) => stdout.push(a),
    $warn: (...a) => stdout.push(a),
    $error: (...a) => stdout.push(a),
  }
);


let files = {};
function read(path, file, onContent) {
  let combo = path + file;
  if (fs.statSync(combo).isFile()) {
    if (file.slice(-3) === '.js') {
      onContent(combo, fs.readFileSync(combo, 'utf8'));
      //
      // files[combo] = {
      //   path: combo,
      //   contents: fs.readFileSync(combo),
      //   annexb: lcname.indexOf('annexb') >= 0,
      //   skip:
      //     // TODO: file report; I think the following rule applies here and as such should not throw:
      //     // https://tc39.github.io/ecma262/#sec-__proto__-property-names-in-object-initializers
      //     // > it is not applied when initially parsing a CoverParenthesizedExpressionAndArrowParameterList or
      //     has('annexB/language/expressions/object/__proto__-duplicate.js') || false,
      // };
    }
  } else {
    fs.readdirSync(combo).forEach(s => read(combo + '/', s, onContent));
  }
}
let counter = 0;
read(PATH262, '', (file, content) => {
  ++counter;
  // if (counter < 27000) return;

  let displayFile = file.slice(path.resolve(dirname, '../ignore').length + 1);
  if (displayFile.includes('FIXTURE')) return;
  console.log(BOLD, counter, RESET, 'Testing', BOLD, displayFile, RESET)

  switch (displayFile) {
    case 'test262/test/annexB/language/expressions/object/__proto__-duplicate.js':
      // - Claims it should fail due to double __proto__ but the spec has an exception
      // - > In addition, it is not applied when initially parsing a CoverParenthesizedExpressionAndArrowParameterList or a CoverCallExpressionAndAsyncArrowHead.
      // - And `({` is most definitely initially parsing a CoverParenthesizedExpressionAndArrowParameterList

    case 'test262/test/built-ins/RegExp/property-escapes/character-class-range-end.js':
    case 'test262/test/built-ins/RegExp/property-escapes/character-class-range-no-dash-end.js':
      // TOFIX (\p cannot be left or right of `-` in char class

    case 'test262/test/built-ins/RegExp/property-escapes/generated/Script_-_Elymaic.js':
      // I think typo in spec, missing a value, Elym

    case 'test262/test/language/literals/regexp/named-groups/invalid-non-id-continue-groupspecifier.js':
    case 'test262/test/language/literals/regexp/named-groups/invalid-non-id-start-groupspecifier-3.js':
      // Seems to me like https://codepoints.net/U+104A4 is a valid ID Continue and as such valid to be inside an
      // identifier. As such, the regex should pass. (Note that, ironically, Chrome will accept a variable by that
      // ident but indeed rejects the regex). Maybe I'm missing an edge case to this rule where it diverts from normal
      // identifiers...? We will see!

    // case 'test262/test/language/statements/break/S12.8_A1_T2.js':
      // TODO: report incorrect reason for failure of test  (fails because the label does not appear in the labelSet,
      //       since a break with label _can_ be valid)

    // case 'test262/test/annexB/built-ins/RegExp/named-groups/non-unicode-malformed.js':
      // TODO: discuss updating the spec on this wording. Currently the grammar would never allow the parser to parse a
      //       `GroupName` in ~N mode, so the condition would never trigger for the parser to restart in `+N` mode.
      //       Additionally, this test case implies that the missing name static semantics can be skipped, even though
      //       either we parse the whole thing as an AtomEscape, in which case the semantics seem to apply (because
      //       annexB doesn't update this rule), or it doesn't parse and the GroupName is invalid, but I don't think so.


      console.log(BOLD, 'SKIP', RESET, '(see test runner code for reasoning)');
      return;
  }

  ASSERT(content.includes('/*---') && content.includes('---*/'), 'missing test262 header', file);
  let header = content.slice(content.indexOf('/*---'), content.indexOf('---*/') + 5);
  // The header is yaml... ... Whatever, split all the things :)
  let flags = header.match(/\n\s*flags: \[(.*?)\]/);
  let features = header.match(/\n\s*features: \[(.*?)\]/);
  features = features ? features[1].split(', ') : [];
  flags = flags ? flags[1].split(/\s*,\s*/g) : [];
  let negative = /\n\s*negative:/.test(header) && !/\n\s*phase:\s*runtime/.test(header) && !header.includes('phase: resolution');
  let webcompat = file.includes('annexB');

  if (features.includes('BigInt')) {
    return  console.log(BOLD, 'SKIP', RESET, '(Stage 3: BigInt)');
  } else if (features.includes('class-fields-public')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage ?: class-fields-public)');
  } else if (features.includes('class-fields-private')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage ?: class-fields-private)');
  } else if (features.includes('class-static-fields-public')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage ?: class-static-fields-public)');
  } else if (features.includes('class-static-fields-private')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage ?: class-static-fields-private)');
  } else if (features.includes('class-methods-private')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage 3: class-methods-private)');
  } else if (features.includes('class-static-methods-private')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage 3?: class-static-methods-private)');
  } else if (features.includes('hashbang')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage 3: hashbang)');
  } else if (features.includes('import.meta')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage 3: import.meta)');
  } else if (features.includes('numeric-separator-literal')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage 3: numeric-separator-literal)');
  } else if (features.includes('export-star-as-namespace-from-module')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage 1?: export-star-as-namespace-from-module)');
  }

  let webstr = webcompat ? 'web' : 'sloppy';
  if (!flags.includes('onlyStrict') && !flags.includes('module')) {
    let failed = false;
    try {
      parse(content, false, false, webcompat);
      console.log(GREEN, 'PASS', RESET, webstr, webcompat);
    } catch (e) {
      console.log(GREEN, 'FAIL', RESET, webstr, webcompat);
      failed = e;
    }

    if (failed && failed.toString().toLowerCase().includes('assertion fail')) {
      console.log('\nUnrolling output;\n');
      stdout.forEach(a => console.log.apply(console, a));
      console.log('e:', failed);
      console.log('flags:', flags);
      throw new Error('File ' + BOLD + file + RESET + BLINK + ' threw assertion error' + RESET + ' in ' + BOLD + webstr + RESET);
    }
    if (failed && !(failed.toString().toLowerCase().includes('parser error!') || failed.toString().toLowerCase().includes('tokenizer error!'))) {
      console.log('\nUnrolling output;\n');
      stdout.forEach(a => console.log.apply(console, a));
      console.log('e:', failed);
      console.log('flags:', flags);
      throw new Error('File ' + BOLD + file + RESET + BLINK + ' threw an unexpected error' + RESET + ' in ' + BOLD + webstr + RESET);
    }
    if (!!failed !== negative) {
      console.log('\nUnrolling output;\n');
      stdout.forEach(a => console.log.apply(console, a));
      console.log('e:', failed, negative);
      console.log('flags:', flags);
      throw new Error('File ' + BOLD + file + RESET + ' did not meet expectations in '+BOLD+webstr+RESET+', expecting ' + (negative?'fail':'pass') + ' but got '  + (failed?'fail':'pass'));
    }
  }

  let modstr = flags.includes('module') ? 'module' : 'strict';
  if (!webcompat && !flags.includes('noStrict')) {
    let failed = false;
    try {
      parse(content, true, flags.includes('module'), webcompat);
      console.log(GREEN, 'PASS', RESET, modstr);
    } catch (e) {
      console.log(GREEN, 'FAIL', RESET, modstr);
      failed = e;
    }

    if (failed && failed.toString().toLowerCase().includes('assertion fail')) {
      stdout.forEach(a => console.log.apply(console, a));
      console.log('e:', failed);
      console.log('flags:', flags);
      throw new Error('File ' + BOLD + file + RESET + BLINK + ' threw assertion error' + RESET + ' in ' + BOLD + modstr + RESET);
    }
    if (failed && !(failed.toString().toLowerCase().includes('parser error!') || failed.toString().toLowerCase().includes('tokenizer error!'))) {
      stdout.forEach(a => console.log.apply(console, a));
      console.log('e:', failed);
      console.log('flags:', flags);
      throw new Error('File ' + BOLD + file + RESET + BLINK + ' threw an unexpected error' + RESET + ' in ' + BOLD + modstr + RESET);
    }
    if (!!failed !== negative) {
      stdout.forEach(a => console.log.apply(console, a));
      console.log('e:', failed);
      console.log('flags:', flags);
      throw new Error('File ' + BOLD + file + RESET + ' did not meet expectations in '+BOLD+modstr+RESET+', expecting ' + (failed?'fail':'pass') + ' but got '  + (!failed?'fail':'pass'));
    }
  }


  // // particular features (especially new ones) will be mentioned in the header so we can filter en-mass based on that here
  // // generated: call arg trailing comma
  // if (/features:.*(?:numeric-separator-literal|bigint|class-fields-public|class-fields-private|optional-catch-binding)/i.test(code)) obj.skip = true;

});
console.log('The end...?');

// export default function f(describe, test, list = files) {
//       //console.log('->', testFileName)
//         let code = obj.contents.toString();
//
//
//         let headerEndMarker = '---*/';
//         let headerEnd = code.indexOf(headerEndMarker);
//         if (headerEnd < 0) {
//           if (obj.path.indexOf('FIXTURE') < 0) {
//             throw new Error('test262: file missing header: ' + testFileName);
//           }
//           // let's just skip the fixtures for now, they have no header
//           continue;
//         }
//
//         // some 262 tests target stuff still in staging. simply start those lines with ZIGNORE to exclude them.
//         let testObj = {
//           code: code.slice(headerEnd + headerEndMarker.length), // dont care so much about the (mandatory) header
//           tokens: true,
//           debug: 'test6262 file path: ' + obj.path,
//         };
//
//         function has(s) {
//           return testFileName.toLowerCase().includes(s.toLowerCase());
//         }
//
//         if (obj.skip) {
//           testObj.SKIP = true;
//         } else {
//           if (
//             // test262 tests opt-in to module so by default they're only intended for script goal
//             // most of these tests run fine for both so I'm just going to blacklist the sets of tests where it matters
//             has('class/gen-method-static-yield-spread-arr-single.js') ||
//             has('class/gen-method-yield-spread-arr-single.js') ||
//             has('language/global-code/S10.1.7_A1_T1.js') || // (delete this == x)
//             has('language/global-code/export.js') || // "do not export in script goal"
//             has('language/global-code/import.js') || // "do not import in script goal"
//             has('instn-resolve-') || // resolution error, not syntax error (in this file, at least)
//             has('reserved-words/await-script') || // tests await as var name in script mode
//             has('annexB/language/comments/multi-line-html') || // html comment in strict mode are bad
//             has('annexB/language/comments/single-line-html') || // html comments in strict mode are bad
//             has('await-in-generator') || // tests await being an ident inside a generator, which is outright illegal in module goal
//             has('delete/11.4.1-2-6.js') || // delete null
//             has('delete/11.4.1-2-3.js') || // delete true
//             has('labeled/value-await-non-module-escaped.js') || // asserts `await` can be a label name in sloppy and strict, only valid in SCRIPT goal
//             has('labeled/value-await-non-module.js') || // asserts `await` can be a label name in sloppy and strict, only valid in SCRIPT goal
//             // tests that dont work because a func decl in global is assumed to be `var`, which is `lex` in module goal
//             has('RegExp/prototype/exec/S15.10.6.2_A1_T9') ||
//             has('RegExp/prototype/test/S15.10.6.3_A1_T9') ||
//             has('redeclaration-global/allowed-to-redeclare-function-declaration-with-var') ||
//             has('redeclaration-global/allowed-to-redeclare-var-with-function-declaration') ||
//             has('destructuring/binding/syntax/recursive-array-and-object-patterns.js') || // (TODO: report this, it defines fn4 twice for no real reason, probably copy/pasta)
//             has('language/global-code/decl-func-dup') ||
//             has('statements/function/S13.2.1_A6_T3') ||
//             has('language/statements/function/S13_A19_T1') ||
//             has('language/statements/function/S13_A6_T1') ||
//             has('language/statements/function/S13_A6_T2') ||
//             false
//           ) {
//             testObj.MODULE = {SKIP: true};
//           }
//
//           // TODO: can we make this check the opposite instead? throw/pass when that's not expected
//           if (/^\s*flags:.*?\bnoStrict\b/m.test(code)) {
//             testObj.STRICT = {SKIP: true};
//             testObj.MODULE = {SKIP: true};
//           }
//           if (/^\s*flags:.*?\bonlyStrict\b/m.test(code)) {
//             testObj.SLOPPY = {SKIP: true};
//           }
//           if (/^\s*flags:.*?\bmodule\b/m.test(code)) {
//             testObj.SCRIPT = {SKIP: true};
//           }
//           testObj.WEB = obj.annexb;
//
//           if (/^\s*negative:/m.test(code) && code.indexOf('  phase: runtime') < 0) {
//             // "negative:" means the test is expected to throw
//             // "  phase: runtime" means the error is a runtime error and we're expected to parse it properly
//             testObj.throws = true;
//           } else {
//             testObj.ast = true;
//           }
//         }
//
//         test(testFileName, testObj);
//       }
//     }
// }
