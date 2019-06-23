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
const STOP_AFTER_FAIL = process.argv.includes('-q');
const TRUNC_STACK_TRACE = !process.argv.includes('-S');
const AUTO_UPDATE = process.argv.includes('-u');
const AUTO_GENERATE = process.argv.includes('-g');
let [a,b,c,d] = [process.argv.includes('--sloppy'), process.argv.includes('--strict'), process.argv.includes('--module'), process.argv.includes('--web')];
const RUN_SLOPPY = (a || (!b && !c && !d)) || (INPUT_OVERRIDE && !(b || c || d));
const RUN_STRICT = b || (!a && !c && !d && !INPUT_OVERRIDE);
const RUN_MODULE = c || (!a && !b && !d && !INPUT_OVERRIDE);
const RUN_WEB = d || (!a && !b && !c && !INPUT_OVERRIDE);
const TARGET_ES6 = process.argv.includes('--es6');
const TARGET_ES7 = process.argv.includes('--es7');
const TARGET_ES8 = process.argv.includes('--es8');
const TARGET_ES9 = process.argv.includes('--es9');
const TARGET_ES10 = process.argv.includes('--es10');

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
    -b            Quick: don't run builds as well (implied if they don't exist)
    -f "path"     Only test this file / dir
    -i "input"    Test input only (sloppy, strict, module), implies --sloppy unless at least one mode explicitly given
    -g            Regenerate computed test case blocks (process all autogen.md files)
    -q            Stop after first fail
    -s            Use HIT() in code and only print tests that execute at least one HIT(), implies -q
    -t            Run test262 suite
    -u            Auto-update tests with the results (tests silently updated inline, use source control to diff)
    --sloppy      Only run tests in sloppy mode (can be combined with other modes like --strict)
    --strict      Only run tests in strict mode (can be combined with other modes like --module)
    --module      Only run tests with module goal (can be combined with other modes like --strict)
    --web         Only run tests in sloppy mode with web compat mode on (can be combined with other modes like --strict)
    --esX         Where X is one of 6 through 10, like --es6. For -i only, forces the code to run in that version
`);
  process.exit();
}

if (AUTO_UPDATE && AUTO_GENERATE) throw new Error('Cannot use auto update and auto generate together');
if (AUTO_UPDATE && (a || b || c || d)) throw new Error('Cannot use --sloppy (etc) together with -u');

import fs from 'fs';
import path from 'path';
import util from 'util';

let babelCore;
let babelTypes;
let babelGenerate;
let babelTemplate;

let prettierFormat = () => { return 'prettier not loaded'; }; // if available, loaded through import() below
let babelParse = undefined; // if available, loaded through import() below

import {
  ASSERT,
  getTestFiles,
  toPrint,
  _LOG,
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

// node does not expose __dirname under module mode, but we can use import.meta to get it
let filePath = import.meta.url.replace(/^file:\/\//,'');
let dirname = path.dirname(filePath);

const RUN_MODE_MODULE = {};
const RUN_MODE_SCRIPT = {};

const BOLD = '\x1b[;1;1m';
const BLINK = '\x1b[;5;1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

const TEST_SLOPPY = 'sloppy';
const TEST_STRICT = 'strict';
const TEST_MODULE = 'module';
const TEST_WEB = 'web';

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

async function readFiles(files) {
  console.time('$$ Test file read time');
  let list = await Promise.all(files.map(file => {
    let res,rej,p = new Promise((resolve, reject) => (res = resolve, rej = reject));
    fs.readFile(file, 'utf8', (err, data) => err ? rej(err) : res({file, _data: data, data}));
    return p;
  }));
  console.timeEnd('$$ Test file read time');
  console.log('Read', list.length, 'files');
  return list;
}
async function extractFiles(list) {
  console.time('$$ Test file extraction time');
  let bytes = 0;
  list.forEach(obj => {
    const {file, data} = obj;
    ({options: obj.params, input: obj.input} = parseTestFile(data, file, obj));
    bytes += obj.input.length;
  });
  console.timeEnd('$$ Test file extraction time');
  console.log('Total input size:', bytes, 'bytes');
}
async function coreTest(input, zeparser, goal, options) {
  wasHit = false;
  let tok;
  let r, e = '';
  try {
    r = zeparser(
      input,
      goal,
      COLLECT_TOKENS_SOLID,
      {
        ...options,
        getTokenizer: tokenizer => tok = tokenizer,
        $log: INPUT_OVERRIDE ? undefined : () => {},
        $warn: INPUT_OVERRIDE ? undefined : () => {},
        $error: INPUT_OVERRIDE ? undefined : () => {},
      },
    );
  } catch (_e) {
    e = _e;
    if (INPUT_OVERRIDE || TARGET_FILE) {
      console.log(_e.stack);
    }
  }

  if (SEARCH) {
    // If you use -q -i then you just want to know whether or not some codepath hits some code
    if (INPUT_OVERRIDE) {
      PRINT_HIT(`[${(e.includes('TODO')?'T':e?RED+'x':GREEN+'v')+RESET}] Input ${wasHit ? 'WAS' : 'was NOT'} hit` + (wasHit === true ? '' : '    (' + wasHit + ')'));
    } else if (wasHit) {
      if (!foundCache.has(input)) {
        PRINT_HIT(`// [${(e.includes('TODO')?'T':e?RED+'x':GREEN+'v')+RESET}]: \`${toPrint(input)}\`` + (wasHit === true ? '' : '    (' + wasHit + ')'));
        foundCache.add(input);
      }
    }
    return; // dont care about further result
  }

  return {r, e, tok};
}
async function postProcessResult({r, e, tok}, testVariant, file) {
  // This is where by far the most time is spent... roughly 90% of the time is this function.
  // Most of that is Prettier. If we replace it with JSON.stringify the total runtime goes down 2 minutes to 11 seconds
  let errorMessage = '';
  if (e) {
    errorMessage = e.message;
    if (errorMessage.includes('Assertion fail')) {
      console.error('####\nThe following assertion error was thrown:\n');
      console.error(errorMessage);
      console.error('####');
      console.error(e.stack);
      throw new Error('Assertion error. Mode = ' + testVariant + ', file = ' + file + '; ' + errorMessage.message);
    }
    if (errorMessage.startsWith('Parser error!')) {
      errorMessage = errorMessage.slice(0, 'Parser error!'.length) + '\n  ' + errorMessage.slice('Parser error!'.length + 1);
    }
    else if (errorMessage.startsWith('Tokenizer error!')) {
      errorMessage = errorMessage.slice(0, 'Tokenizer error!'.length) + '\n    ' + errorMessage.slice('Tokenizer error!'.length + 1);
    }
    else {
      console.error('####\nThe following unexpected error was thrown:\n');
      console.error(errorMessage);
      console.error(e.stack);
      console.error('####');
      throw new Error('Non-graceful error, fixme. Mode = ' + testVariant + ', file = ' + file + '; ' + errorMessage.message);
    }

    if (tok) {
      let context = tok.getErrorContext();
      if (context.slice(-1) === '\n') context = context.slice(0, -1);
      context = context.split('\n').map(s => s.trimRight()).join('\n'); // The error snippet can contain trailing whitespace
      if (INPUT_OVERRIDE) context = '```\n' + context + '\n```\n';
      errorMessage += '\n\n' + context;
    }
  }

  return (
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
}
async function runTest(list, zeparser, testVariant) {
  console.log(' - Now testing', INPUT_OVERRIDE ? 'for:' : 'all cases for:', testVariant);
  console.time('  $$ Batch for ' + testVariant);


  let bytes = 0;
  let ok = 0;
  let fail = 0;
  if (!INPUT_OVERRIDE) console.log('   Parsing all inputs');
  console.time('   $$ Parse time for all tests');
  let set = await Promise.all(list.map(async obj => {
    let {input, params} = obj;
    bytes += input.length;
    let result = await coreTest(input, zeparser, testVariant === TEST_MODULE ? GOAL_MODULE : GOAL_SCRIPT, {
      strictMode: testVariant === TEST_STRICT,
      webCompat: testVariant === TEST_WEB,
      targetEsVersion: params.es,
    });
    if (SEARCH) return;
    if (result.e) ++fail;
    else if (result.r) ++ok;
    else throw new Error('invariant');
    return {obj, result};
  }));
  if (!INPUT_OVERRIDE) console.log('   Have', set.length, 'results, totaling', bytes, 'bytes, ok = ', ok, ', fail =', fail);
  console.timeEnd('   $$ Parse time for all tests');
  if (SEARCH) return;


  if (!INPUT_OVERRIDE) console.log('   Processing', set.length, 'result for all tests');
  console.time('   $$ Parse result post processing time');
  await Promise.all(set.map(async ({obj, result}) => {
    // Caching it like this takes up more memory but makes deduping other modes so-much-easier
    obj.newoutput[testVariant] = await postProcessResult(result, testVariant, obj.file);
  }));
  console.timeEnd('   $$ Parse result post processing time');


  console.timeEnd('  $$ Batch for ' + testVariant);
}
async function runTests(list, zeparser) {
  console.time('$$ Total runtime');
  if (!INPUT_OVERRIDE) console.log('Now actually running all', list.length, 'test cases... 4x! Single threaded! This may take some time (~20s on my machine)');
  list.forEach(obj => obj.newoutput = {});
  if (RUN_SLOPPY) await runTest(list, zeparser, TEST_SLOPPY);
  if (RUN_STRICT) await runTest(list, zeparser, TEST_STRICT);
  if (RUN_MODULE) await runTest(list, zeparser, TEST_MODULE);
  if (RUN_WEB) await runTest(list, zeparser, TEST_WEB);
  console.timeEnd('$$ Total runtime');
}
async function constructNewOutput(list) {
  console.time('$$ New output construction time');
  list.forEach(obj => {
    obj.data = generateOutputBlock(obj.data, obj.newoutput.sloppy, obj.newoutput.strict, obj.newoutput.module, obj.newoutput.web);
    // TODO: compat table; what do other parsers do with this input?
  });
  console.timeEnd('$$ New output construction time');
}
async function writeNewOutput(list) {
  console.time('$$ Write updated test files');
  let updated = 0;
  await Promise.all(list.map(obj => {
    if (updated && STOP_AFTER_FAIL) return;
    const {data, _data, file} = obj;
    if (data !== _data) {
      if (AUTO_UPDATE) {
        ++updated;
        let res,rej,p = new Promise((resolve, reject) => (res = resolve, rej = reject));
        fs.writeFile(file, data, 'utf8', (err, data) => err ? rej(err) : res());
        return p;
      } else {
        console.error('Output mismatch for', file);
        return Promise.resolve();
      }
    }
  }));
  if (updated && STOP_AFTER_FAIL) {
    console.log('Found error, exiting now...');
    process.exit();
  }
  console.timeEnd('$$ Write updated test files');
  console.log('Updated', updated, 'files');
}
async function loadParserAndPrettier() {
  let zeparser;
  console.time('$$ Parser and Prettier load');
  [
    {default: zeparser},
    {default: {format: prettierFormat}}
  ] = await Promise.all([
    await import(path.join(dirname, '../src/zeparser.mjs')),
    await import('prettier'),
  ]);
  console.timeEnd('$$ Parser and Prettier load');

  return zeparser;
}

async function cli() {
  let zeparser = await loadParserAndPrettier();

  let forcedTarget = TARGET_ES6 ? 6 : TARGET_ES7 ? 7 : TARGET_ES8 ? 8 : TARGET_ES9 ? 9 : TARGET_ES10 ? 10 : undefined;
  if (forcedTarget) console.log('Forcing target version: ES' + forcedTarget);

  let list = [{
    file: '<cli>',
    input: INPUT_OVERRIDE,
    params: {
      es: TARGET_ES6 ? 6 : TARGET_ES7 ? 7 : TARGET_ES8 ? 8 : TARGET_ES9 ? 9 : TARGET_ES10 ? 10 : undefined,
    }
  }];
  await runTests(list, zeparser);

  console.log('=============================================');
  if (RUN_SLOPPY) {
    console.log('### Sloppy mode:');
    console.log(list[0].newoutput.sloppy);
    console.log('=============================================\n');
  }
  if (RUN_STRICT) {
    console.log('### Strict mode:');
    console.log(list[0].newoutput.strict);
    console.log('=============================================\n');
  }
  if (RUN_MODULE) {
    console.log('### Module goal:');
    console.log(list[0].newoutput.module);
    console.log('=============================================\n');
  }
  if (RUN_WEB) {
    console.log('### Web compat mode:');
    console.log(list[0].newoutput.web);
    console.log('=============================================\n');
  }
}

async function main() {
  let zeparser = await loadParserAndPrettier();

  if (TARGET_FILE) {
    console.log('Using explicit file:', TARGET_FILE);
    files = [TARGET_FILE];
  } else {
    files = files.filter(f => !f.endsWith('autogen.md'));
  }

  let list = await readFiles(files);
  await extractFiles(list);
  await runTests(list, zeparser);
  if (!SEARCH) {
    await constructNewOutput(list);
    await writeNewOutput(list);
  }

  console.timeEnd('$$ Whole test run');
}

function san(dir) {
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
  list.forEach(obj => {
    let genDir = path.join(path.dirname(obj.file), 'gen');
    if (fs.existsSync(genDir)) {
      // Drop all files in this dir (this is `gen`, should be fine to fully regenerate anything in here at any time)
      let oldFiles = [];
      getTestFiles(genDir, '', oldFiles, true, true);
      // Note: the folder should only contain generated files and folders which should delete just fine
      oldFiles.forEach(file => { try { fs.unlinkSync(file); } catch (e) { fs.rmdirSync(file); } });
    }
    fs.mkdirSync(genDir, {recursive: true});

    let caseOffset = obj.data.indexOf(CASE_HEAD);
    let templateOffset = obj.data.indexOf(TPL_HEAD, CASE_HEAD);
    let outputOffset = obj.data.indexOf(OUT_HEAD, TPL_HEAD);
    ASSERT(caseOffset >= 0 || templateOffset >= 0 || outputOffset >= 0, 'missing required parts of autogen', obj.file);
//    ASSERT(obj.data.slice(caseOffset + CASE_HEAD.length, templateOffset).split('> `````js\n').length > 2, 'expecting 2+ cases', obj.file);
    let cases = obj.data
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
            ASSERT(s[0] === '>' && s[1] === ' ', 'cases should be md quoted entirely, with one space', obj.file, s);
            return s.slice(2);
          })
          .join('\n'); // Not likely to be multi line but why not
      })
    ;

    let params = obj.data
      .slice(templateOffset + TPL_HEAD.length, obj.data.indexOf('####', templateOffset + TPL_HEAD.length))
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
    let templates = obj.data
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

    templates.forEach(({title, code}) => {
      let caseDir = path.join(genDir, san(String(title)));
      fs.mkdirSync(caseDir, {recursive: true});
      cases.forEach(c => {
        let testFile = path.join(caseDir, san(String(c)) + '.md');

        // immediately generate a test case for it, as well
        fs.writeFileSync(testFile, createAutoGeneratedTestFileContents(obj, caseDir, title, c, params, code));
      });
    });
  });
}
function createAutoGeneratedTestFileContents(obj, caseDir, title, c, params, code) {
  return `# ZeParser parser autogenerated test case

- From: ${obj.file.slice(obj.file.indexOf('zeparser3'))}
- Path: ${caseDir.slice(caseDir.indexOf('zeparser3'))}

> :: test: ${title.split('\n').join('\n>          ')}
> :: case: ${c.split('\n')    .join('\n>          ')}

## Input

${
    Object
    .getOwnPropertyNames(params)
    .map(key => '- `' + key + ' = ' + params[key].replace(/#/g, c) + '`\n')
    .join('')
    }
\`\`\`\`\`js
${code.replace(/#/g, c)}
\`\`\`\`\`
`;
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

const INPUT_HEADER = '\n## Input\n';
const INPUT_START = '\n`````js\n';
const INPUT_END = '\n`````\n';
function parseTestFile(data, file, obj) {

  if (data[0] === '@') {
    // This should be a new test that still has to be generated
    // Its format basically starts with an @ for easy parsing here
    //
    // ```
    // @ some more information here, optional because the file name / path forms the description
    // ###
    // the rest is the test case, as is. only trailing whitespace (if any) is trimmed from each line and the start/end
    // ```
    ASSERT(data.includes('\n###\n'), 'expected format');

    console.log('Generating test case from', file);

    let [comment, ...code] = data.slice(1).split('###\n');
    code = code.join('###'); // unlikely
    code = code.split('\n').map(s => s.trimRight()).join('\n').trim();

    let relfile = file.slice(file.indexOf('zeparser3'));

    let descPath = path
      .dirname(relfile.slice(relfile.indexOf('tests/testcases/parser/') + 'tests/testcases/parser/'.length))
      .split('/')
      .map(s =>
        s
        .replace(/_/g, ' ')
        .replace(/x([a-z\d]{4})/g, (_, s) => String.fromCharCode(parseInt(s, 16)))
      )
      .join(' : ');
    let descFile = path.basename(relfile)
      .slice(0, -3)
      .replace(/_/g, ' ')
      .replace(/x([a-z\d]{4})/g, (_, s) => String.fromCharCode(parseInt(s, 16)));

    obj.data = data = `# ZeParser parser test case

- Path: ${relfile}

> :: ${descPath}
>
> ::> ${descFile}${comment ? '\n>\n>' + comment : ''}
${INPUT_HEADER}${INPUT_START}${code}${INPUT_END}
`;
    fs.writeFileSync(file, data);
  }

  // find the input
  let inputOffset = data.indexOf(INPUT_HEADER);
  ASSERT(inputOffset >= 0, 'should have an input header', file);
  let start = data.indexOf(INPUT_START, inputOffset);
  ASSERT(start >= 0, 'Should have the start of a test case', file);
  let end = data.indexOf(INPUT_END, inputOffset);
  ASSERT(end >= 0, 'Should have the end of a test case', file);

  // Find the parameters between input header and START
  let options = data
  .slice(inputOffset + INPUT_HEADER.length, start)
  .split('\n')
  .filter(s => s.trim()[0] === '-') // Only dash-lists in this position should be for parameters
  .reduce((obj, s) => {
    s = s.trim();
    // Each line should be ``- `name = value` ``
    ASSERT(s[0] === '-', 'expecting whitespace and a list of options between input header and start', file, s);
    ASSERT(s[2] === '`' && s.slice(-1) === '`', 'backtick quote the contents', file, s, s[2], s.slice(-1));
    let [k, is, ...v] = s.slice(3, -1).split(' ');
    ASSERT(is === '=', 'key=value', file, s);

    let value = v.join(' ');
    if (String(parseFloat(value)) === value) value = parseFloat(v);
    else if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (value === 'undefined') value = undefined;
    else if (value === 'null') value = null;

    obj[k] = value;

    return obj;
  }, {});

  // Find the test case between START and END
  let input = data.slice(start + INPUT_START.length, end);

  return {options, input};
}

const OUTPUT_HEADER = '\n## Output\n';
const OUTPUT_HEADER_SLOPPY = '\n### Sloppy mode\n';
const OUTPUT_HEADER_STRICT = '\n### Strict mode\n';
const OUTPUT_HEADER_MODULE = '\n### Module goal\n';
const OUTPUT_HEADER_WEB = '\n### Web compat mode\n';
const OUTPUT_CODE = '\n`````\n';
function generateOutputBlock(currentOutput, sloppyOutput, strictOutput, moduleOutput, webOutput) {
  // Replace the whole output block with the current results. We then compare the old to the new and write if different.
  // Note: The file may not have output yet
  let outputIndex = currentOutput.indexOf(OUTPUT_HEADER);
  if (outputIndex < 0) outputIndex = currentOutput.length;

  return ''+
    currentOutput.slice(0, outputIndex) +
    OUTPUT_HEADER + '\n' +
    '_Note: the whole output block is auto-generated. Manual changes will be overwritten!_\n\n' +
    'Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).\n\n' +
    'Note that the output parts are auto-generated by the test runner to reflect actual result.\n' +
    OUTPUT_HEADER_SLOPPY + '\n' +
    'Parsed with script goal and as if the code did not start with strict mode header.\n' +
    OUTPUT_CODE + sloppyOutput + OUTPUT_CODE +
    OUTPUT_HEADER_STRICT + '\n' +
    'Parsed with script goal but as if it was starting with `"use strict"` at the top.\n' +
    (strictOutput === sloppyOutput ? '\n_Output same as sloppy mode._' : (OUTPUT_CODE + strictOutput) + OUTPUT_CODE) +
    '\n' +
    OUTPUT_HEADER_MODULE + '\n' +
    'Parsed with the module goal.\n' +
    (moduleOutput === sloppyOutput ? '\n_Output same as sloppy mode._' : moduleOutput === strictOutput ? '\n_Output same as strict mode._' : (OUTPUT_CODE + moduleOutput + OUTPUT_CODE)) +
    '\n' +
    OUTPUT_HEADER_WEB + '\n' +
    'Parsed in sloppy script mode but with the web compat flag enabled.\n' +
    (webOutput === sloppyOutput ? '\n_Output same as sloppy mode._' : (OUTPUT_CODE + webOutput + OUTPUT_CODE)) +
    '\n' +
  '';
}

console.time('$$ Whole test run');

let files = [];
if (INPUT_OVERRIDE) {
  LOG('Using override input and only testing that...');
  if (!a && !b && !c && !d) LOG('Sloppy mode implied (override with --strict --module or --web)');
  LOG('=============================================\n');
} else {
  console.time('$$ Test search discovery time');
  getTestFiles(path.join(dirname, 'testcases/parser'), '', files, true);
  console.timeEnd('$$ Test search discovery time');
  console.log('Read all test files, gathered', files.length, 'files');

  files = files.filter(f => f.indexOf('test262') >= 0 === TEST262);
}

if (AUTO_GENERATE) {
  gen();
} else if (INPUT_OVERRIDE) {
  cli();
} else {
  main();
}
