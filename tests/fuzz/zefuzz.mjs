// ./t fuzz

console.log('\n---------------\n');

import fs from 'fs';

import {GOAL_MODULE, GOAL_SCRIPT} from "../../src/zetokenizer.mjs";
import Par from "../../src/zeparser.mjs";

import ESLump from 'eslump/src/index.js'; // can only import cjs as default
import ESFuzz from 'esfuzz/lib/index.js';
import bindingPatterns from './binding-patterns.mjs';
import classMethodHeaders from './class-method-header.mjs';

let VERBOSE = true;
const REDUCE = process.argv.includes('-r') ? process.argv[process.argv.indexOf('-r') + 1] : '';

const BOLD = '\x1b[;1;1m';
const DIM = '\x1b[30;1m';
const BLINK = '\x1b[;5;1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

let buffer = [];
let p = (input, trimming) => Par(input, GOAL_SCRIPT, true, {
  strictMode: false,
  webCompat: true,
  // astRoot: ast,
  // tokenStorage: tokens,
  // getTokenizer: tok => tokenizer = tok,
  // targetEsVersion: ES || Infinity,
  fullErrorContext: true,

  // Collect output but don't print it in case the retry fails
  $log: (...args) => trimming || buffer.push(args), // shhh
  $warn: (...args) => trimming || buffer.push(args), // shhh
  $error: (...args) => trimming || buffer.push(args), // shhh
});

let attempts = 0;
let stopNext = false;

const { generateRandomJS: eslumpGen } = ESLump;
let fuzzEslump = () => eslumpGen({
  sourceType: "script", // module or script
  maxDepth: 4, // ast size
  comments: false, // generate comments?
  whitespace: false, // generate whitespace?
});
let fuzzEsfuzz = () => {
  // ESFuzz quality tends to generate some poor inputs, while others are rich
  // This test will scrub out some scrappy inputs like semi's only, or `xxx;`
  let input = '';
  do {
    input = ESFuzz.render(ESFuzz.generate());
  } while (input.replace(/[;:\w{}]+/g, '').trim() === '');
  return input;
};
let fuzzZefuzz_classMethods = () => {
  return classMethodHeaders();
};
let fuzzZefuzz_bindingPatterns = () => {
  return bindingPatterns();
};

function scrubError(msg) {
  return msg.replace(/\{#.*?#\}/g, '<token>');
}
let diffCache = new Map;
function different(originalError, input) {
  if (diffCache.has(input)) {
    let c = diffCache.get(input);
    console.log(
      'CACHED [' + input.length + ']:',
      input.replace(/[\n\r]/g, '\\n'),
      [
        'z=' + (c.zeparserfailed?'fail':'pass'),
        'n='+(c.nodefailed?'fail':'pass'),
      ],
      c.zeparserfailed || c.nodefailed ? (c.originalError === c.errorMessage ? 'same err:' +  c.originalError + '===' + c.errorMessage: ('different error: ' + c.errorMessage)) : 'both passed'
    );
    return c.errorMessage === c.originalError && (c.zeparserfailed !== c.nodefailed);
  }
  originalError = scrubError(originalError);

  let nodefailed = false;
  let errorMessage = '';
  try {
    Function(input);
  } catch (e) {
    errorMessage = scrubError(e.message);
    nodefailed = true;
  }

  let zeparserfailed = false;
  let zepe;
  try {
    p(input, true);
  } catch (e) {
    zeparserfailed = true;
    errorMessage = scrubError(e.message);
    zepe = e;
  }

  let c = {
    zeparserfailed,
    nodefailed,
    originalError,
    errorMessage,
  };
  diffCache.set(input, c);

  console.log(
    'Tested [' + input.length + ']:',
    input.replace(/[\n\r]/g, '\\n'),
    [
      'z=' + (zeparserfailed?'fail':'pass'),
      'n='+(nodefailed?'fail':'pass'),
    ],
    zeparserfailed || nodefailed ? (originalError === errorMessage ? 'same err' : ('different error: ' + errorMessage)) : 'both passed'
  );

  if (zeparserfailed && (!errorMessage.includes('Parser error!') && !errorMessage.includes('Tokenizer error!')) || errorMessage.toLowerCase().includes('assert')) {
    console.log('\n\n\n\n####################################');
    console.log(errorMessage.toLowerCase().includes('assert') ? BLINK + 'ASSERTION error!' + RESET : BOLD + 'Non graceful error:' + RESET);
    console.log(errorMessage);
    console.log('```');
    console.log(input);
    console.log('```');
    console.log('\n####################################\n\n\n');

    console.log(zepe.stack);

    fs.writeFileSync('tests/testcases/todo/fuzz-min.md', '@By fuzzer semi-reduced, zeparser assertion failed\nError: '+errorMessage+'\n###\n'+input+'\n');
    console.log('Written to tests/testcases/todo/fuzz-min.md');
    process.exit();
  }

  return errorMessage === originalError && (zeparserfailed !== nodefailed);
}

const vlog = console.log;
const log = VERBOSE ? console.log : (...args) => VERBOSE && vlog(...args);
if (VERBOSE) console.log = console.warn = console.error = (...args) => VERBOSE && vlog(...args);

function trimPatten(different, str, pattern, repl) {
  let lastOffset = -1;
  let found = true;
  let currentStr = str;
  while (found) {
    found = false;
    currentStr = currentStr.replace(pattern, (match, offset) => {
      if (offset <= lastOffset) return match;
      if (found) return match;
      found = true;
      lastOffset = offset;
      let lastEffort = currentStr.slice(0, offset) + repl + str.slice(offset + match.length);
      if (lastEffort !== currentStr && different(lastEffort)) {
        currentStr = lastEffort;
        return repl;
      }
      return match;
    });
  }
  return currentStr;
}

let trimCache = new Map;
function trim(input, _different, inputError) {
  let org = input;
  attempts = 0;
  let different = (...args) => (++attempts, _different(inputError, ...args));
  console.log('<trim>');
  console.log('Input error:', BOLD + inputError + RESET);
  if (trimCache.has(org)) {
    console.log('Trim cached!');
    console.log('Result was:', trimCache.get(input));
  }
  if (!different(input)) return console.log('Untrimmable because v8 and zeparser already agree\n</trim>'); // this is not trimmable
  console.log('Normalizing:', input.replace(/[\n\r]/g, '\\n'));
  // Normalize newlines
  if (different(input.replace(/\r/g, '\n'))) input = input.replace(/\r/g, '\n');
  // Replace newlines with semis
  if (different(input.replace(/\n/g, ';'))) input = input.replace(/\n/g, ';');

  console.log('Trimming');
  let lastInput = '';
  while (lastInput !== input) {
    console.log('Outer repeat!');
    different(input);
    lastInput = input;

    for (let i=input.length; i>=0; --i) {
      let testingInput = input.slice(0, i) + input.slice(i + 1);
      if (different(testingInput)) {
        input = testingInput;
      }
    }

    for (let i=input.length-1; i>=0; --i) {
      if (input[i] !== 'x' && input[i] !== ' ') {
        let testingInput = input.slice(0, i) + input.slice(i + 2);
        if (different(testingInput)) {
          input = testingInput;
        }
      }
    }

    for (let i=input.length-1; i>=0; --i) {
      if (input[i] !== 'x' && input[i] !== ' ') {
        let testingInput = input.slice(0, i) + ' x ' + input.slice(i + 2);
        if (different(testingInput)) {
          input = testingInput;
        }
      }
    }

    for (let i=input.length-2; i>=0; --i) {
      if (input[i] !== 'x' && input[i] !== ' ') {
        let testingInput = input.slice(0, i) + input.slice(i + 3);
        if (different(testingInput)) {
          input = testingInput;
        }
      }
    }

    for (let i=input.length-2; i>=0; --i) {
      if (input[i] !== 'x' && input[i] !== ' ') {
        let testingInput = input.slice(0, i) + ' y ' + input.slice(i + 3);
        if (different(testingInput)) {
          input = testingInput;
        }
      }
    }

    input = trimPatten(different, input, /try\{\}(?:catch(?:\(\w\))?\{\})?(?:finally\{\})?/g, ';')
    input = trimPatten(different, input, /for\([\w\d] (?:of|in) [\w\d]\)/g, ';');
    input = trimPatten(different, input, /for\(;;\)/g, ';');
    input = trimPatten(different, input, /class(?: +[\w\d$_]*)?(?: extends [\w\d$_]*)?\s*\{\s*\}/g, ' x\n ');
    input = trimPatten(different, input, /while\([\w\d]\)/g, ';');
    input = trimPatten(different, input, /do(?:\s\w\s|;)while\([\w\d]\)/g, ';');
    input = trimPatten(different, input, /with\([\w\d]\)/g, ';');
    input = trimPatten(different, input, /if\(\w\)/g, ';');
    input = trimPatten(different, input, /else(?: \w)?/g, ';');
    input = trimPatten(different, input, /default:?/g, '');
    input = trimPatten(different, input, /case [\w\d$_]+:/g, '');
    input = trimPatten(different, input, /function(?: \w)?\(\)\{\s*\w?\s*\}/g, '');
    input = trimPatten(different, input, /function(?: \w)?\(\)\{\s*\w?\s*\}/g, ' x\n ');
    input = trimPatten(different, input, /switch\([\w\d]\)\{(?:case [\w\d]:)*\}/g, ';');
    input = trimPatten(different, input, /[\w\d]\?[\w\d]:[\w\d]/g, ' x ');
    input = trimPatten(different, input, /\w in(?:stanceof)? \w/g, ' x ');
    input = trimPatten(different, input, /\d+:[\w\d]+/g, '');
    input = trimPatten(different, input, /[\w\d$_]*\([\w\d$_]*\)\{\}[;,]?/g, '');
    input = trimPatten(different, input, /['"]use strict['"];/g, '');

    if (lastInput === input) {
      // RC. Now check for wrappers
      let t = input.replace(/try\{([\s\S]+)\}(?:finally|catch(?:\(\w\))?)\{\}/, '$1');
      if (t !== input && different(t)) input = t;

      t = input.replace(/try\{\}(?:finally|catch(?:\(\w\))?)\{([\s\S]+)\}/, '$1');
      if (t !== input && different(t)) input = t;

      t = input.replace(/switch\([\w\d]\){case [\w\d]:([\s\S]+)}/, '$1');
      if (t !== input && different(t)) input = t;

      t = input.replace(/\((.*)\)/, '$1');
      if (t !== input && different(t)) input = t;

      t = input.replace(/for\((.*);;\)/, '$1;');
      if (t !== input && different(t)) input = t;

      t = input.replace(/for\(;(.*);\)/, '$1;');
      if (t !== input && different(t)) input = t;

      t = input.replace(/for\(;;(.*)\)/, '$1;');
      if (t !== input && different(t)) input = t;
    }
  }

  different(input);

  trimCache.set(org, input);

  console.log('</trim>');
  return input;
}

if (REDUCE) {
  let err = getError(REDUCE);
  let r = trim(REDUCE, different, err);
  console.log('Reduced output:', [r]);
  process.exit();
}

let counter = 0;
let passed = 0;
while (true) {
  if (stopNext) break;
  let from = Math.floor(Math.random() * 3);
  let input = [
    fuzzEslump,
    fuzzEsfuzz,
    fuzzZefuzz_classMethods,
    fuzzZefuzz_bindingPatterns,
  ][from]();

  if (cycle(input)) break;

  // In 1% of inputs do brute force breakage tests with chars that are likely to trip the parser (like `/`)
  if (Math.random() < 0.01) {
    if (cycle(input)) break;
    for (let i=0; i<input.length; ++i) {
      let chr = [
        // Newline checks for ASI
        '\n',
        // Newline-forward-slash does regex assertion checks
        '\n/',
        // Forward slash also does regex assertion checks
        '/',
        // Equals does assignability / destructuring assertion checks
        '=',
        // Whitespace does general weirdness checks
        ' ',
      ][Math.floor(Math.random() * 5)];
      let brokenInput = input.slice(0, i) + chr + input.slice(i);
      if (cycle(brokenInput)) break;
    }
  }
}

function getError(input) {
  let errorMessage = '';
  try {
    Function(input);
  } catch (e) {
    errorMessage = e.message;
  }

  try {
    p(input);
  } catch (e) {
    errorMessage = e.message;
  }

  return errorMessage;
}

function cycle(input) {
  // vlog('Original (unicode-able) input:');
  // vlog(enc(input));
  // vlog('####');
  input = input
  // https://tc39.github.io/ecma262/#prod-WhiteSpace Normalize whitespace to regular spaces for printing
  .replace(/[\x09\x0b\x0c\xa0\uFEFF]/g, ' ')
  // https://www.compart.com/en/unicode/category/Zs
  .replace(/[\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
  // replace other unicode gunk to an x for printing (we can do separate unicode runs later, I'm not expecting serious problems here)
  .replace(/([^\x20-\x7f\n\r])/ug, 'x');
  buffer = [];

  let errorMessage = '';
  let nodefailed = false;
  try {
    let f = Function(input);
    // log('-->', f.toString())
  } catch (e) {
    errorMessage = e.message;
    nodefailed = e.message;
  }

  let zefailed = false;
  let zeparserAsserted = false;
  try {
    p(input);
  } catch (e) {
    errorMessage = e.message;
    zefailed = e.message;
    zeparserAsserted = zefailed.toLowerCase().includes('assert');
    if (zeparserAsserted) {
      const BLINK = '\x1b[;5;1m';
      const BOLD = '\x1b[;1;1m';
      const RESET = '\x1b[0m';
      console.log(BOLD + BLINK + 'ASSERTION FAIL' + RESET);
      console.log('Base64 of initial test case:', Buffer.from(input).toString('base64'))
      fs.writeFileSync('tests/testcases/todo/fuzz-assert-original.md', '@By fuzzer original, because assertion failed\nError: '+zefailed+'\n###\n'+input+'\n');
      console.log('Written to tests/testcases/todo/fuzz-assert-original.md');
    }
  }

  stopNext = stopNext || (zefailed && (zeparserAsserted || (!zefailed.includes('Parser error!') && !zefailed.includes('Tokenizer error!'))));

  if (!nodefailed !== !zefailed || stopNext) {
    if (nodefailed) {
      log('Thrown by v8:', nodefailed);
    } else {
      log('Not thrown by v8');
    }

    if (zefailed) {
      log('Thrown by zeparser:', zefailed);
    } else {
      log('Not thrown by zeparser');
    }

    if (!stopNext && nodefailed && (undefined
      // || input.includes('/?/')
      // || input.includes('/)/')
      // || input.includes('/}/')
      // || input.includes('/]/')

      || nodefailed.includes('has already been declared') // `switch(y){case y:function*d(){}function*d(){}}`
      || nodefailed.includes('Unexpected eval or arguments in strict mode') // (eval = a => { "use strict"})
      || nodefailed.includes('Unexpected strict mode reserved word') // (interface = a => { "use strict"})
    )) {
      log('Skipping case that is likely a false positive because v8 does not verify regexes in lazy parsed functions atm');
    }
    else if (!stopNext && zefailed && (undefined || ((undefined
      // // Binding patterns:
      // // v8 is allowing `([y()=0])`, patterns with assignments to calls, which lead to false positives
      // || ((input.includes('()=') || input.includes('))=')) && zefailed.includes('Cannot assign to lhs'))

      // Regexes
      // v8 is lazy parsing regexes and I'm not sure zeparser is spec compliant, especially in web compat
      || zefailed.includes('Tokenizer error! Regex:')

      // Delete
      // v8 doesn't seem to statically detect the delete-on-ident case
      || zefailed.includes('Bad delete case')
      // || zefailed.includes('delete an identifier')

      // Labels
      || zefailed.includes('same label twice')

      // `let \n keyword` case is not covered by v8, I guess (`let \n while (x);`)
      || zefailed.includes('must be a declaration in strict mode but the next ident is a reserved keyword')
    )))) {
      // ignore (based on original input)
    }
    else {
      fs.writeFileSync('tests/testcases/todo/fuzz-assert-original.md', '@By fuzzer original\nError: '+(zefailed||nodefailed)+'\n###\n'+input+'\n');

      let beforeLen = input.length;
      log('Trimming input (len was ' + input.length +')');
      input = trim(input, different, errorMessage);
      log('Finished trimming (len now ' + input.length +', down from ' + beforeLen + ' in ' + attempts + ' attempts)');

      if (0
        // Class methods:
        // Node is allowing `class x {y}` which leads to a bunch of false positives in the fuzzer
        || /class\s*\w*\s*extends\s*\w*\s*\{\s*\w+;?\s*\}/.test(input)
        || /class\s*\w*\{\w+;?\s*\}/.test(input)
      ) {
        // ignore (based on trimmed input)
      } else {
        const BLINK = '\x1b[;5;1m';
        const BOLD = '\x1b[;1;1m';
        const RESET = '\x1b[0m';

        VERBOSE = true;
        log('FAIL');
        log('### <error>');
        // Flush buffer
        // if (VERBOSE && buffer.length > 0) {
        //   log('### output buffer:');
        //   buffer.forEach(args => log(...args));
        // }
        console.log('Thrown error (pre-scrubbed):', BOLD, errorMessage, RESET);
        let newError = getError(input);
        if (errorMessage !== newError) {
          console.log('Thrown erorr (post-scrubss):', BLINK, newError, RESET);
        }
        log('### </error>');

        if (zeparserAsserted) {
          console.log(BOLD + BLINK + 'ASSERTION FAIL' + RESET);
          fs.writeFileSync('tests/testcases/todo/fuzz-min.md', '@By fuzzer reduced, zeparser assertion failed\nError: '+zefailed+'\n###\n'+input+'\n');
          console.log('Written to tests/testcases/todo/fuzz-min.md');
        } else if (zefailed) {
          fs.writeFileSync('tests/testcases/todo/fuzz-min.md', '@By fuzzer, zeparser only\nError: '+zefailed+'\n###\n'+input+'\n');
          console.log('Failed in zeparser only. Written to tests/testcases/todo/fuzz-min.md');
        } else if (nodefailed) {
          fs.writeFileSync('tests/testcases/todo/fuzz-min.md', '@By fuzzer, v8 only\nError: '+nodefailed+'\n###\n'+input+'\n');
          console.log('Failed in node only. Written to tests/testcases/todo/fuzz-min.md');
        }
        // console.log('Base64 of reduced test case:', Buffer.from(input).toString('base64'));

        log('scrubbed testcase:');
        log('oneliner:', BOLD, '`' + input + '`', RESET);

        console.log(/class\s*\w*\{\w+\s*\}/.test(input))

        return true;
      }
    }
  }

  log('input : ```\n'+input+'\n```');
  // log('newlined      : ```\n'+input.replace(/;/g, ';\n')+'\n```');
  log((nodefailed ? 'Failed' : 'Passed') + ' in both envs');
  if (!nodefailed) ++passed;

  if (VERBOSE) {
    log('\n################################################# ' + (++counter) + ', pass rate ' + ((passed/counter)*100).toPrecision(2) + '% \n');
  } else {
    ++counter;
    if ((counter % 104) === 103) process.stdout.write('\x1b[0G' + (++counter) + ' ');
  }
  return false;
}

if (stopNext) console.log('\n########\nNONGRACEFUL ERROR FOUND\n########');

function enc(s) {
  return s.replace(/\\/g, '\\\\').replace(
    /([^\n\r\x20-\x7f])/ug,
    (_, s) => {
      let p = s.codePointAt(0);
      s = p.toString(16);
      if (p<=0xff) return '\\x'+(''+s).padStart(2, '0');
      if (p<=0xffff) return '\\u'+s;
      return '\\u{' + s + '}';
    }
  );
}
