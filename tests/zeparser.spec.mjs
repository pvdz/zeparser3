#!/usr/bin/env node --experimental-modules

// For as long as node does not support it out of the box and you use nvm you can only execute this through:
//
//     node --experimental-modules tests/zeparser.spec.mjs
//

if (!(process.version.slice(1, 3) >= 10)) throw new Error('Requires node 10+, did you forget `nvm use 10`?');

Error.stackTraceLimit = Infinity; // TODO: cut off at node boundary...

console.log('Start of ZeParser3 test suite');

const INPUT_OVERRIDE = process.argv.includes('-i') ? process.argv[process.argv.indexOf('-i') + 1] : '';
const TARGET_FILE = process.argv.includes('-f') ? process.argv[process.argv.indexOf('-f') + 1] : '';
const SEARCH = process.argv.includes('-s');
const SKIP_BUILDS = process.argv.includes('-b') || SEARCH;
const TEST262 = process.argv.includes('-t');
const SKIP_TO = TEST262 ? 0 : 0; // skips the first n tests (saves me time)
const STOP_AFTER_TEST_FAIL = process.argv.includes('-q');
const STOP_AFTER_FILE_FAIL = process.argv.includes('-Q');
const TRUNC_STACK_TRACE = !process.argv.includes('-S');
const AUTO_UPDATE = process.argv.includes('-u') || process.argv.includes('-U');
const CONFIRMED_UPDATE = process.argv.includes('-U');
const AUTO_GENERATE = process.argv.includes('-g');
const AUTO_GENERATE_CONSERVATIVE = process.argv.includes('-G');
const REDUCING = process.argv.includes('--min');
const ALL_VARIANTS = process.argv.includes('--all');
let [a,b,c,d] = [process.argv.includes('--sloppy'), process.argv.includes('--strict'), process.argv.includes('--module'), process.argv.includes('--web')];
const RUN_SLOPPY = ALL_VARIANTS || (a || (!b && !c && !d)) || ((INPUT_OVERRIDE || !REDUCING) && !(b || c || d));
const RUN_STRICT = ALL_VARIANTS || b || (!a && !c && !d && !INPUT_OVERRIDE && !REDUCING);
const RUN_MODULE = ALL_VARIANTS || c || (!a && !b && !d && !INPUT_OVERRIDE && !REDUCING);
const RUN_WEB = ALL_VARIANTS || d || (!a && !b && !c && !INPUT_OVERRIDE && !REDUCING);
const TARGET_ES6 = process.argv.includes('--es6');
const TARGET_ES7 = process.argv.includes('--es7');
const TARGET_ES8 = process.argv.includes('--es8');
const TARGET_ES9 = process.argv.includes('--es9');
const TARGET_ES10 = process.argv.includes('--es10');
const RUN_VERBOSE_IN_SERIAL = process.argv.includes('--serial') || INPUT_OVERRIDE || TARGET_FILE || SKIP_BUILDS || STOP_AFTER_TEST_FAIL || STOP_AFTER_FILE_FAIL;

if (process.argv.includes('-?') || process.argv.includes('--help')) {
  console.log(`
  ZeParser Test Runner

  Usage:
    \`tests/zeparser.spec.mjs\` [options]
  But for the time being:
    \`node --experimental-modules tests/zeparser.spec.mjs\`
  And suggested if also testing builds:
    \`node --experimental-modules cli/build.mjs; node --experimental-modules tests/zeparser.spec.mjs\` [options]

  Options:
    -b            Quick: don't run builds as well (implied if the files don't exist)
    -f "path"     Only test this file / dir
    -i "input"    Test input only (sloppy, strict, module), implies --sloppy unless at least one mode explicitly given
    -g            Regenerate computed test case blocks (process all autogen.md files)
    -G            Same as -g except it skips existing files
    -Q            Stop after first fail, but test all four modes (sloppy/strict/module/web) regardless
    -q            Stop after first fail
    -s            Use HIT() in code and only print tests that execute at least one HIT(), implies -q
    -t            Run test262 suite
    -u            Unconditionally auto-update tests with the results (tests silently updated inline, use source control to diff)
    -U            Auto-update but confirm before each test case is updated inline (use with -q for controlled updating)
    --sloppy      Only run tests in sloppy mode (can be combined with other modes like --strict)
    --strict      Only run tests in strict mode (can be combined with other modes like --module)
    --module      Only run tests with module goal (can be combined with other modes like --strict)
    --web         Only run tests in sloppy mode with web compat mode on (can be combined with other modes like --strict)
    --all         Force to run all four modes (on input)
    --esX         Where X is one of 6 through 10, like --es6. For -i only, forces the code to run in that version
    --serial      Test all targeted files in serial, verbosely, instead of using parallel phases (which is faster)
                  (Note: -q, -i, -b, and -f implicitly enable --serial)
    --min         Brute-force simplify a test case that throws an error while maintaining the same error message, only with -f, implies --sloppy
      -- write    For reducer only; write result to new file
`);
  process.exit();
}

if (AUTO_UPDATE && (AUTO_GENERATE || AUTO_GENERATE_CONSERVATIVE)) throw new Error('Cannot use auto update and auto generate together');
if (AUTO_UPDATE && (a || b || c || d)) throw new Error('Cannot use --sloppy (etc) together with -u');

import fs from 'fs';
import path from 'path';
import util from 'util';
import {execSync} from 'child_process';

let prettierFormat = () => { return 'prettier not loaded'; }; // if available, loaded through import() below

import {
  ASSERT,
  getTestFiles,
  parseTestFile,
  promiseToWriteFile,
  readFiles,
  Tob,
  toPrint,
  _LOG,
  yn,

  INPUT_HEADER,
  OUTPUT_HEADER,
  OUTPUT_HEADER_SLOPPY,
  OUTPUT_HEADER_STRICT,
  OUTPUT_HEADER_MODULE,
  OUTPUT_HEADER_WEB,
  OUTPUT_QUINTICK,
  OUTPUT_QUINTICKJS,
} from './utils.mjs';
let LOG = _LOG; // I want to be able to override this and imports are constants

import ZeParser, {
  COLLECT_TOKENS_NONE,
  COLLECT_TOKENS_SOLID,
  COLLECT_TOKENS_ALL,

  GOAL_MODULE,
  GOAL_SCRIPT,
} from '../src/zeparser.mjs';

import {
  $EOF,

  debug_toktype,
} from '../src/zetokenizer.mjs';
import {
  generateTestFile,
} from './generate_test_file.mjs';
import {
  reduceAndExit,
} from './test_case_reducer.mjs';

// node does not expose __dirname under module mode, but we can use import.meta to get it
let filePath = import.meta.url.replace(/^file:\/\//,'');
let dirname = path.dirname(filePath);

const BOLD = '\x1b[;1;1m';
const DIM = '\x1b[30;1m';
const BLINK = '\x1b[;5;1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

const TEST_SLOPPY = 'sloppy';
const TEST_STRICT = 'strict';
const TEST_MODULE = 'module';
const TEST_WEB = 'web';

if (REDUCING && !TARGET_FILE && !INPUT_OVERRIDE) THROW('Can only use `--min` together with `-f` or `-i`');

let stopAsap = false;

// use -s and call HIT in some part of the code to log all test cases that visit that particular branch(es)
let wasHit = false;
let foundCache = new Set; // dont print multiples
let foundTest = (x) => wasHit = x || true;
let PRINT_HIT = console.log;
if (SEARCH) {
  global.HIT = foundTest; // faster to quickly search than exporting and having to uncomment the import...
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.dir = () => {};
  LOG = () => {};
  PRINT_HIT(BLINK + 'Suppressing __all__ further output, only printing hits...' + RESET);
} else {
  global.HIT = ()=>{};
}

async function extractFiles(list) {
  if (!RUN_VERBOSE_IN_SERIAL) console.time('$$ Test file extraction time');
  let bytes = 0;
  list.forEach((tob/*: Tob */) => {
    if (tob.oldData[0] === '@') generateTestFile(tob);
    parseTestFile(tob);
    bytes += tob.inputCode.length;
  });
  if (!RUN_VERBOSE_IN_SERIAL) console.timeEnd('$$ Test file extraction time');
  console.log('Total input size:', bytes, 'bytes');
}
function coreTest(tob, zeparser, testVariant, code = tob.inputCode) {
  wasHit = false;
  let tok;
  let r, e = '';
  let stdout = [];
  try {
    r = zeparser(
      code,
      testVariant === TEST_MODULE ? GOAL_MODULE : GOAL_SCRIPT,
      COLLECT_TOKENS_SOLID,
      {
        strictMode: testVariant === TEST_STRICT,
        webCompat: testVariant === TEST_WEB,
        targetEsVersion: tob.inputOptions.es,

        getTokenizer: tokenizer => tok = tokenizer,
        $log: INPUT_OVERRIDE ? undefined : (...a) => stdout.push(a),
        $warn: INPUT_OVERRIDE ? undefined : (...a) => stdout.push(a),
        $error: INPUT_OVERRIDE ? undefined : (...a) => stdout.push(a),
      },
    );
    if (tob.shouldFail) throw new Error('Assertion fail: test was explicitly marked to fail somehow, but it passed');
  } catch (_e) {
    e = _e;
    if (tob.shouldPass) e = new Error('Assertion fail: test was explicitly marked to pass, but it failed somehow;\n' + e.stack);
  }

  return {r, e, tok, stdout};
}
async function postProcessResult(tob/*: Tob */, testVariant/*: "sloppy" | "strict" | "module" | "web" */) {
  let {parserRawOutput: {[testVariant]: {r, e, tok, stdout}}, file} = tob;
  if (!r && !e) return; // no output for this variant

  let errorMessage = '';
  if (e) {
    errorMessage = e.message;
    if (errorMessage.includes('Assertion fail')) {
      stdout.forEach(a => console.log.apply(console, a));

      console.error('####\nAn ' + BLINK + 'assertion' + RESET + ' error was thrown in ' + testVariant + ' mode\n');
      console.error(BOLD + 'Input:' + RESET + '\n\n`````\n' + tob.inputCode + '\n`````\n\n' + BOLD + 'Error message:' + RESET + '\n');
      console.error(errorMessage);
      console.error('####');
      console.error(e.stack);
      hardExit(tob, 'postProcessResult assertion error');
      throw new Error('Assertion error. Mode = ' + testVariant + ', file = ' + file + '; ' + errorMessage.message);
    }
    else if (errorMessage.startsWith('Parser error!')) {
      errorMessage = errorMessage.slice(0, 'Parser error!'.length) + '\n  ' + errorMessage.slice('Parser error!'.length + 1);
    }
    else if (errorMessage.startsWith('Tokenizer error!')) {
      errorMessage = errorMessage.slice(0, 'Tokenizer error!'.length) + '\n    ' + errorMessage.slice('Tokenizer error!'.length + 1);
    }
    else {
      stdout.forEach(a => console.log.apply(console, a));

      // errorMessage = 'TEMP SKIPPED UNKNOWN ERROR';
      console.error('####\nThe following ' + BLINK + 'unexpected' + RESET + ' error was thrown in ' + testVariant + ' mode:\n');
      console.error(errorMessage);
      console.error(e.stack);
      console.error('####');
      hardExit(tob, 'postProcessResult unknown error');
      throw new Error('Non-graceful error, fixme. Mode = ' + testVariant + ', file = ' + file + '; ' + errorMessage.message);
    }

    if (tok) {
      let context = tok.getErrorContext();
      if (context.slice(-1) === '\n') context = context.slice(0, -1);
      context = context.split('\n').map(s => s.trimRight()).join('\n'); // The error snippet can contain trailing whitespace but we want to keep indentations
      if (INPUT_OVERRIDE) context = '```\n' + context + '\n```\n';
      errorMessage += '\n\n' + context;
    }
  }

  let outputTestString = (
    // throws: Parser error!
    // throws: Tokenizer error!
    (errorMessage ? 'throws: ' + errorMessage : '') +
    // (r ? 'ast: ' + formatAst(r.ast) + '\n\n' + formatTokens(r.tokens) : '')
    // (r ? 'ast: ' + JSON.stringify(r.ast) + '\n\n' + formatTokens(r.tokens) : '')
    // Using util.inspect makes the output formatting highly tightly bound to node's formatting rules
    // At the same time, the same could be said for Prettier (although we can lock that down by package version,
    // independent from node version). However, using prettier takes roughly 23 secods, inspect half a second. Meh.
    (r ? 'ast: ' +
      util
        .inspect(r.ast, false, null)
        // Flatten location tracking objects to a single line
        /*
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 2, col: 2 },
          source: ''
        },
        ->
        loc:{start:{line:1,col:0},end:{line:2,col:2},source:''},
        */
        // (Test cases won't contain this as string-content so the regex should be safe)
        .replace(
          /loc:\s*\{\s*start:\s*\{\s*line:\s*\d+,\s*col:\s*\d+\s*}\s*,\s*end:\s*\{\s*line:\s*\d+,\s*col:\s*\d+\s*\},\s*source:\s*'[^']*'\s*}/g,
            s => s.replace(/\s+/g, '')
        )
      + '\n\n' + formatTokens(r.tokens) : '')
  );

  // Caching it like this takes up more memory but makes deduping other modes so-much-easier
  switch (testVariant) {
    case TEST_SLOPPY:
      tob.newOutputSloppy = outputTestString;
      break;
    case TEST_STRICT:
      tob.newOutputStrict = outputTestString;
      break;
    case TEST_MODULE:
      tob.newOutputModule = outputTestString;
      break;
    case TEST_WEB:
      tob.newOutputWeb = outputTestString;
      break;
    default: FIXME;
  }
}
async function runTest(list, zeparser, testVariant/*: "sloppy" | "strict" | "module" | "web" */) {
  if (!RUN_VERBOSE_IN_SERIAL) console.log(' - Now testing', INPUT_OVERRIDE ? 'for:' : 'all cases for:', testVariant);
  if (!RUN_VERBOSE_IN_SERIAL) console.time('  $$ Batch for ' + testVariant);


  let bytes = 0;
  let ok = 0;
  let fail = 0;
  if (!RUN_VERBOSE_IN_SERIAL) console.log('   Parsing all inputs');
  if (!RUN_VERBOSE_IN_SERIAL) console.time('   $$ Parse time for all tests');
  await Promise.all(list.map(async (tob/*: Tob */) => {
    let {inputCode, inputOptions} = tob;
    bytes += inputCode.length;
    if (REDUCING) reduceAndExit(tob.inputCode, code => coreTest(tob, zeparser, testVariant, code), tob.file);
    // This is quite memory expensive but much easier to work with
    tob.parserRawOutput[testVariant] = coreTest(tob, zeparser, testVariant);
    let rawOutput = tob.parserRawOutput[testVariant];
    if (SEARCH) {
      let e = rawOutput.e;
      // If you use -q -i then you just want to know whether or not some codepath hits some code
      if (INPUT_OVERRIDE) {
        PRINT_HIT(`[${(e&&e.message.includes('TODO')?'T':e?RED+'x':GREEN+'v')+RESET}] Input ${wasHit ? 'WAS' : 'was NOT'} hit` + (wasHit === true ? '' : '    (' + wasHit + ')'));
      } else if (wasHit) {
        if (!foundCache.has(inputCode)) {
          PRINT_HIT(`// [${(e && e.message.includes('TODO')?'T':e?RED+'x':GREEN+'v')+RESET}]: \`${toPrint(inputCode)}\`` + (wasHit === true ? '' : '    (' + wasHit + ')'));
          foundCache.add(tob.inputCode);
        }
      }
      return;
    }
    if (rawOutput.e) ++fail;
    else if (rawOutput.r) ++ok;
    else throw new Error('invariant');
  }));
  if (!RUN_VERBOSE_IN_SERIAL) console.log('   Have', list.length, 'results, totaling', bytes, 'bytes, ok = ', ok, ', fail =', fail);
  if (!RUN_VERBOSE_IN_SERIAL) console.timeEnd('   $$ Parse time for all tests');
  if (SEARCH) return;

  if (!RUN_VERBOSE_IN_SERIAL) console.log('   Processing', list.length, 'result for all tests');
  if (!RUN_VERBOSE_IN_SERIAL) console.time('   $$ Parse result post processing time');
  await Promise.all(list.map(async (tob/*: Tob*/) => await postProcessResult(tob, testVariant)));
  if (!RUN_VERBOSE_IN_SERIAL) console.timeEnd('   $$ Parse result post processing time');

  if (!RUN_VERBOSE_IN_SERIAL) console.timeEnd('  $$ Batch for ' + testVariant);
}
function showDiff(tob) {
  console.log(
    '\n' +
    BOLD + '######' + RESET + '\n' +
    BOLD + '## ' + RESET + 'Now showing diff' + '\n' +
    BOLD + '## ' + RESET + 'File:', tob.file, '\n' +
    BOLD + '######' + RESET + '\n'
  );
  execSync(
    // Use base64 to prevent shell interpretation of input. Final `cat` is to suppress `diff`'s exit code when diff.
    `echo '${Buffer.from(tob.newData).toString('base64')}' | base64 -d - | colordiff --text -y -w -W200 "${tob.file}" - | cat`,
    {stdio: 'inherit'}
  );
}
function hardExit(tob, msg) {
  stopAsap = true;
  if (!msg) FIXME
  if (tob) console.log(RED + 'FAIL' + RESET + ' ' + DIM + tob.fileShort + RESET);
  console.log('Hard exit() node now because: ' + msg);
  process.exit();
}

async function runTests(list, zeparser) {
  if (!RUN_VERBOSE_IN_SERIAL) console.time('$$ Total runtime');
  if (!RUN_VERBOSE_IN_SERIAL) console.log('Now actually running all', list.length, 'test cases... 4x! Single threaded! This may take some time (~20s on my machine)');
  if (RUN_SLOPPY) await runTest(list, zeparser, TEST_SLOPPY);
  if (SEARCH) return;
  if (RUN_STRICT) await runTest(list, zeparser, TEST_STRICT);
  if (RUN_MODULE) await runTest(list, zeparser, TEST_MODULE);
  if (RUN_WEB) await runTest(list, zeparser, TEST_WEB);
  if (!RUN_VERBOSE_IN_SERIAL) console.timeEnd('$$ Total runtime');

  if (RUN_VERBOSE_IN_SERIAL && !AUTO_UPDATE && !INPUT_OVERRIDE) {
    for (let i=0; i<list.length; ++i) {
      let tob = list[i];
      if (generateOutputBlock(tob) !== tob.oldData) {
        console.log('\nTest output change detected!\n');
        // dump outputs
        if (RUN_SLOPPY) {
          console.log(BOLD + '### Terminal output for sloppy run:' + RESET);
          tob.parserRawOutput.sloppy.stdout.forEach((a) => console.log(...a));
        }
        if (RUN_STRICT) {
          console.log(BOLD + '### Terminal output for strict run:' + RESET);
          tob.parserRawOutput.strict.stdout.forEach((a) => console.log(...a));
        }
        if (RUN_MODULE) {
          console.log(BOLD + '### Terminal output for module run:' + RESET);
          tob.parserRawOutput.module.stdout.forEach((a) => console.log(...a));
        }
        if (RUN_WEB) {
          console.log(BOLD + '### Terminal output for web run:' + RESET);
          tob.parserRawOutput.web.stdout.forEach((a) => console.log(...a));
        }

        if (!TARGET_FILE && !INPUT_OVERRIDE) {
          showDiff(tob);
        }

        console.log(BOLD + '\nnode --experimental-modules tests/zeparser.spec.mjs  -q -u -f "' + tob.file + '"\n');

        if (!TARGET_FILE && !INPUT_OVERRIDE) {
          let cont = await yn('Continue?');
          if (!cont) hardExit(tob, 'Test output change detected. Aborting early.');
        }
      }
    }
  }
}
function constructNewOutput(list) {
  if (!RUN_VERBOSE_IN_SERIAL) console.time('$$ New output construction time');
  list.forEach((tob/*: Tob */) => {
    generateOutputBlock(tob);
    // TODO: create a compat table; "what do other parsers do with this input?"
  });
  if (!RUN_VERBOSE_IN_SERIAL) console.timeEnd('$$ New output construction time');
}
async function writeNewOutput(list) {
  if (!RUN_VERBOSE_IN_SERIAL) console.time('$$ Write updated test files');
  let updated = 0;

  if (CONFIRMED_UPDATE) {
    // This is slower but must process files in serial...
    for (let i=0; i<list.length; ++i) {
      let tob = list[i];
      const {newData, oldData, file} = tob;
      if (newData !== oldData) {
        let cont = await yn('Continue to overwrite test output?');
        if (cont) {
          ++updated;
          await promiseToWriteFile(file, newData);
        }
      }
    }
  } else {
    await Promise.all(list.map((tob/*: Tob */) => {
      const {newData, oldData, file} = tob;
      if (newData !== oldData) {
        if (AUTO_UPDATE) {
          if (STOP_AFTER_TEST_FAIL) stopAsap = true;
          ++updated;
          return promiseToWriteFile(file, newData);
        } else {
          console.error('Output mismatch for', file);
          return Promise.resolve();
        }
      }
    }));

    if (updated && (STOP_AFTER_TEST_FAIL || STOP_AFTER_FILE_FAIL)) {
      stopAsap = true;
      hardExit(undefined, 'updated at least one file in writeNewOutput()');
    }
  }

  if (!RUN_VERBOSE_IN_SERIAL) console.timeEnd('$$ Write updated test files');
  if (!RUN_VERBOSE_IN_SERIAL) console.log('Updated', updated, 'files');
}
async function loadParserAndPrettier() {
  let zeparser;
  if (!RUN_VERBOSE_IN_SERIAL) console.time('$$ Parser and Prettier load');
  [
    {default: zeparser},
    {default: {format: prettierFormat}}
  ] = await Promise.all([
    await import(path.join(dirname, '../src/zeparser.mjs')),
    await import('prettier'),
  ]);
  if (!RUN_VERBOSE_IN_SERIAL) console.timeEnd('$$ Parser and Prettier load');

  return zeparser;
}
async function runAndRegenerateList(list, zeparser) {
  await runTests(list, zeparser);
  if (!SEARCH) {
    constructNewOutput(list);
    if (RUN_VERBOSE_IN_SERIAL && list[0].oldData !== list[0].newData) showDiff(list[0]);
    await writeNewOutput(list);
  }
}

async function cli() {
  let zeparser = await loadParserAndPrettier();

  let forcedTarget = TARGET_ES6 ? 6 : TARGET_ES7 ? 7 : TARGET_ES8 ? 8 : TARGET_ES9 ? 9 : TARGET_ES10 ? 10 : undefined;
  if (forcedTarget) console.log('Forcing target version: ES' + forcedTarget);

  let tob = new Tob('<cli>', INPUT_OVERRIDE);
  tob.inputCode = INPUT_OVERRIDE;
  tob.inputOptions.es = forcedTarget;
  let list = [tob];
  await runTests(list, zeparser);

  console.log('=============================================');
  if (RUN_SLOPPY) {
    ASSERT(list[0].newOutputSloppy !== false, 'should update');
    console.log('### Sloppy mode:');
    console.log(list[0].newOutputSloppy);
    console.log('=============================================\n');
  }
  if (RUN_STRICT) {
    ASSERT(list[0].newOutputStrict !== false, 'should update');
    console.log('### Strict mode:');
    if (RUN_SLOPPY && list[0].newOutputSloppy === list[0].newOutputStrict) console.log('Same as sloppy');
    else console.log(list[0].newOutputStrict);
    console.log('=============================================\n');
  }
  if (RUN_MODULE) {
    ASSERT(list[0].newOutputModule !== false, 'should update');
    console.log('### Module goal:');
    if (RUN_SLOPPY && list[0].newOutputSloppy === list[0].newOutputModule) console.log('Same as sloppy');
    else if (RUN_STRICT && list[0].newOutputStrict === list[0].newOutputModule) console.log('Same as strict');
    else console.log(list[0].newOutputModule);
    console.log('=============================================\n');
  }
  if (RUN_WEB) {
    ASSERT(list[0].newOutputWeb !== false, 'should update');
    console.log('### Web compat mode:');
    if (RUN_SLOPPY && list[0].newOutputSloppy === list[0].newOutputWeb) console.log('Same as sloppy');
    else console.log(list[0].newOutputWeb);
    console.log('=============================================\n');
  }
}

async function main() {
  let zeparser = await loadParserAndPrettier();

  if (TARGET_FILE) {
    console.log('Using explicit file:', TARGET_FILE);
    if (REDUCING) console.log('And only reducing this test case to a minimal set with the same error, then exiting');
    files = [TARGET_FILE];
  } else {
    files = files.filter(f => !f.endsWith('autogen.md'));
  }

  if (!RUN_VERBOSE_IN_SERIAL) console.time('$$ Test file read time');
  let list = await readFiles(files);
  if (!RUN_VERBOSE_IN_SERIAL) console.timeEnd('$$ Test file read time');
  console.log('Read', list.length, 'files');

  await extractFiles(list);
  let beforeLen = list.length;
  if (!TARGET_FILE) list = list.filter(tob => !tob.aboveTheFold.toLowerCase().includes('\n## skip\n'));
  console.log('Filtered', beforeLen - list.length,'skipped tests (containing `## skip`)');

  if (RUN_VERBOSE_IN_SERIAL) {
    for (let i=0; i<list.length && !stopAsap; ++i) {
      let tob = list[i];
      await runAndRegenerateList([tob], zeparser);
      let count = String(i+1).padStart(String(list.length).length, ' ') + ' / ' + list.length;
      if (tob.oldData === tob.newData) console.log(BOLD + GREEN + 'PASS' + RESET + ' ' + count + ' ' + DIM + tob.fileShort + RESET);
      else console.log(RED + 'FAIL' + RESET + ' ' + count + ' ' + DIM + tob.fileShort + RESET);
    }
  } else {
    await runAndRegenerateList(list, zeparser);
  }

  console.timeEnd('$$ Whole test run');
}

function sanitize(dir) {
  return dir
  .trim()
  .replace(/(?:\s|;|,)+/g, '_')
  .replace(/[^a-zA-Z0-9_-]/g, (s)=>'x' + (s.charCodeAt(0).toString(16)).padStart(4, '0'));
}

async function gen() {
  const CASE_HEAD = '### Cases';
  const TPL_HEAD = '### Templates';
  const OUT_HEAD = '## Output';

  files = files.filter(f => f.endsWith('autogen.md'));
  let list = await readFiles(files);
  list.forEach((tob/*: Tob */) => {
    let genDir = path.join(path.dirname(tob.file), 'gen');

    if (fs.existsSync(genDir)) {
      if (!AUTO_GENERATE_CONSERVATIVE) {
        // Drop all files in this dir (this is `gen`, should be fine to fully regenerate anything in here at any time)
        let oldFiles = [];
        getTestFiles(genDir, '', oldFiles, true, true);
        // Note: the folder should only contain generated files and folders which should delete just fine
        oldFiles.forEach(file => { try { fs.unlinkSync(file); } catch (e) { fs.rmdirSync(file); } });
      }
    } else {
      fs.mkdirSync(genDir, {recursive: true});
    }

    let caseOffset = tob.oldData.indexOf(CASE_HEAD);
    let templateOffset = tob.oldData.indexOf(TPL_HEAD, CASE_HEAD);
    let outputOffset = tob.oldData.indexOf(OUT_HEAD, TPL_HEAD);
    ASSERT(caseOffset >= 0 || templateOffset >= 0 || outputOffset >= 0, 'missing required parts of autogen', tob.file);
    let cases = tob.oldData
      .slice(caseOffset + CASE_HEAD.length, templateOffset)
      .split('> `````js\n')
      .slice(1) // first element is the header
      .map(s => {
        // Note: code blocks start with > ``js and end with > `` and are (markdown) "quoted" throughout, + single space
        // So search for the quint -``js and cut up to the next quint-``, then scrub the quoting prefix `> `
        return s
          .split('\n> `````')[0] // Only get the code block, don't care about the rest
          .split('\n')
          .map(s => {
            ASSERT(s[0] === '>' && s[1] === ' ', 'cases should be md quoted entirely, with one space', tob.file, s);
            return s.slice(2);
          })
          .join('\n'); // Not likely to be multi line but why not
      })
    ;

    let params = tob.oldData
      .slice(templateOffset + TPL_HEAD.length, tob.oldData.indexOf('####', templateOffset + TPL_HEAD.length))
      .split('\n')
      .map(s => s.trim())
      .filter(s => s[0] === '-')
      .reduce((obj, s) => {
        ASSERT(s[1] === ' ' && s[2] === '`' && s[s.length - 1] === '`', 'param composition', obj.file, s);
        let [k, v] = s.slice(3, -1).split(' = ');
        if (String(parseInt(v, 10)) === v) v = parseInt(k, 10);
        else if (v === 'true') v = true;
        else if (v === 'false') v = false;
        else if (v === 'null') v = null;
        obj[k] = v;
        return obj;
      }, {});

    // Temlates have a header and also have a ``js codeblock
    let templates = tob.oldData
      .slice(templateOffset + TPL_HEAD.length, outputOffset)
      .split('\n#### ')
      .slice(1) // first element is the header
      .map(s => {
        // We split on the #### so the title should be at the start of `s` now
        let title = s.split('\n')[0].trim();
        // Get everything inside the js code block
        let code = s.split('`````js\n')[1].split('\n`````')[0];
        return {title, code};
      })
    ;

    // Now generate all cases with each # in the params and templates replaced with each case

    let wrote = 0;
    let skipped = 0;
    templates.forEach(({title, code}) => {
      let caseDir = path.join(genDir, sanitize(String(title)));
      fs.mkdirSync(caseDir, {recursive: true});
      cases.forEach(c => {
        let testFile = path.join(caseDir, sanitize(String(c)) + '.md');

        if (!AUTO_GENERATE_CONSERVATIVE || !fs.existsSync(testFile)) {
          // immediately generate a test case for it, as well
          fs.writeFileSync(testFile, createAutoGeneratedTestFileContents(tob, caseDir, title, c, params, code));
          ++wrote;
        } else {
          ++skipped;
        }
      });
    });
    console.log('Wrote', wrote, 'new test files' + (skipped ? ' and skipped ' + skipped + ' existing files' : ''), 'dir:', genDir.slice(path.join(dirname, '..').length+1));
  });
}
function createAutoGeneratedTestFileContents(tob/*: Tob */, caseDir, title, c, params, code) {
  return `# ZeParser parser autogenerated test case

- From: ${tob.fileShort}
- Path: ${caseDir.slice(caseDir.indexOf('zeparser3'))}

> :: test: ${title.split('\n').join('\n>          ')}
>
> :: case: ${c.split('\n')    .join('\n>          ')}

## Input

${
  Object
    .getOwnPropertyNames(params)
    .map(key => '- `' + key + ' = ' + params[key].replace(/#/g, c) + '`\n')
    .join('')
  }${
    OUTPUT_QUINTICKJS
  }${
    code.replace(/#/g, c)
  }${
    OUTPUT_QUINTICK
  }`;
}

function formatTokens(tokens) {
  // console.log('tokens:', tokens)

  let s = 'tokens (' + tokens.length + 'x):\n';
  let line = ' '.repeat(6);

  for (let i=0, l=tokens.length-1; i<l; ++i) {
    let next = debug_toktype(tokens[i].type);
    if ((line + ' ' + next).length > 70) {
      s += line + '\n';
      line = ' '.repeat(7) + next;
    } else {
      line += ' ' + next;
    }
  }
  s += line;
  return s;
}
function formatAst(ast) {
  // If you have no prettier installed then ignore this step. It's not crucial.
  // node_modules/.bin/prettier --no-bracket-spacing  --print-width 180 --single-quote --trailing-comma all --write <dir>

  // Note: inspect is faster than JSON.stringify, though the prettier step itself is dreadfully slow
  return prettierFormat('(' + util.inspect(ast, false, null) + ')', {
    parser:'babel',
    printWidth: 180,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
    bracketSpacing: false,
  }).replace(/(?:^;?\(?)|(?:\)[\s\n]*$)/g, '');
}


function generateOutputBlock(tob) {
  // Replace the whole output block with the current results. We then compare the old to the new and write if different.
  // Some may not have been generated (yet) and will default to the old value

  let sloppy = ifNotFalse(tob.newOutputSloppy, tob.oldOutputSloppy);
  let strict = ifNotFalse(tob.newOutputStrict, tob.oldOutputStrict);
  let module = ifNotFalse(tob.newOutputModule, tob.oldOutputModule);
  let web = ifNotFalse(tob.newOutputWeb, tob.oldOutputWeb);

  return tob.newData =
    tob.aboveTheFold +
    generateInput(tob) +
    generateOutputHeader() +
    generateOutputSloppy(sloppy) +
    generateOutputStrict(strict, sloppy) +
    generateOutputModule(module, strict, sloppy) +
    generateOutputWeb(web, sloppy) +
  '';
}
function ifNotFalse(a, b) {
  if (a === false) return b;
  return a;
}
function generateInput(tob) {
  return INPUT_HEADER + tob.inputHead + OUTPUT_QUINTICKJS + tob.inputCode + OUTPUT_QUINTICK;
}
function generateOutputHeader() {
  return OUTPUT_HEADER + '\n' +
    '_Note: the whole output block is auto-generated. Manual changes will be overwritten!_\n\n' +
    'Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).\n\n' +
    'Note that the output parts are auto-generated by the test runner to reflect actual result.\n' +
    '';
}
function generateOutputSloppy(sloppyOutput) {
  return OUTPUT_HEADER_SLOPPY + '\n' +
    'Parsed with script goal and as if the code did not start with strict mode header.\n' +
    OUTPUT_QUINTICK + sloppyOutput + OUTPUT_QUINTICK +
    '';
}
function generateOutputStrict(strictOutput, sloppyOutput) {
  return OUTPUT_HEADER_STRICT + '\n' +
    'Parsed with script goal but as if it was starting with `"use strict"` at the top.\n' +
    (strictOutput === sloppyOutput ? '\n_Output same as sloppy mode._' : (OUTPUT_QUINTICK + strictOutput + OUTPUT_QUINTICK)) + '\n' +
    '';
}
function generateOutputModule(moduleOutput, strictOutput, sloppyOutput) {
  return OUTPUT_HEADER_MODULE + '\n' +
    'Parsed with the module goal.\n' +
    (moduleOutput === sloppyOutput ? '\n_Output same as sloppy mode._' : moduleOutput === strictOutput ? '\n_Output same as strict mode._' : (OUTPUT_QUINTICK + moduleOutput + OUTPUT_QUINTICK)) +
    '\n' +
    '';
}
function generateOutputWeb(webOutput, sloppyOutput) {
  return OUTPUT_HEADER_WEB + '\n' +
    'Parsed in sloppy script mode but with the web compat flag enabled.\n' +
    (webOutput === sloppyOutput ? '\n_Output same as sloppy mode._' : (OUTPUT_QUINTICK + webOutput + OUTPUT_QUINTICK)) + '\n' +
    '';
}

console.time('$$ Whole test run');


let files = [];
if (INPUT_OVERRIDE) {
  LOG('Using override input and only testing that...');
  if (!a && !b && !c && !d) LOG('Sloppy mode implied (override with --strict --module or --web)');
  LOG('=============================================\n');
} else {
  if (!RUN_VERBOSE_IN_SERIAL) console.time('$$ Test search discovery time');
  getTestFiles(path.join(dirname, 'testcases/parser'), '', files, true);
  if (!RUN_VERBOSE_IN_SERIAL) console.timeEnd('$$ Test search discovery time');
  console.log('Read all test files, gathered', files.length, 'files');

  files = files.filter(f => f.indexOf('test262') >= 0 === TEST262);
}

if (AUTO_GENERATE || AUTO_GENERATE_CONSERVATIVE) {
  gen();
} else if (INPUT_OVERRIDE) {
  cli();
} else {
  main();
}
