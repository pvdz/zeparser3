let PASS = true;
let FAIL = false;
let MODE_MODULE = true; // see zetokenizer.js
let MODE_SCRIPT = false; // see zetokenizer.js
let USE_SLOPPY_MODE = 1;
let USE_STRICT_MODE = 2;
let PARSE_MODE_DIV = 0;
let PARSE_MODE_REGEX = 4;
let PARSE_MODE_TICK = 8;
let WEB_COMPAT_ALWAYS = 16;
let WEB_COMPAT_NEVER = 32;

import util from 'util';
import fs from 'fs';
import readline from 'readline';

const BOLD = '\x1b[;1;1m';
const BLINK = '\x1b[;5;1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

const INPUT_HEADER = '\n## Input\n';
const OUTPUT_HEADER = '\n## Output\n';
const OUTPUT_HEADER_SLOPPY = '\n### Sloppy mode\n';
const OUTPUT_HEADER_STRICT = '\n### Strict mode\n';
const OUTPUT_HEADER_MODULE = '\n### Module goal\n';
const OUTPUT_HEADER_WEB = '\n### Web compat mode\n';
const OUTPUT_QUINTICK = '\n`````\n';
const OUTPUT_QUINTICKJS = '\n`````js\n';

let prefixLogOrigin = false; // this slows things down considerably so just used for debugging
const _LOG = console.log; // global hijack :(
console.log = (...args) => {
  if (prefixLogOrigin && (args.length > 1 || (args.length === 1 && (typeof args[0] !== 'string' || args[0].trim() !== '')))) {
    // This is probably v8 specific but allows me to more easily locate console.logs :)
    // Assumes this console.log is always one step away from the actual call site
    let origin = new Error().stack.split(' at ')[2].split('/').slice(-1)[0].trim()
    let parts = origin.split(':').slice(0, 2);
    parts[1] = parseInt(parts[1], 10).toString().padStart(4, '_');
    origin = parts.join(':');
    origin = '\x1b[;2m' + origin + ':' + RESET;
    args.unshift(origin);
  }
  _LOG(...args);
};

function LOG(...args) {
  let pre = args[0].slice(0, 4);
  if (pre !== 'PASS' && pre !== 'SKIP') {
    _LOG.apply(console, args);
  }
}

function THROW(str, ...rest) {
  _LOG('error args:', rest.length ? util.inspect(rest, false, null) : '<none>');
  throw new Error(`Test env error! ${str} ${rest.length ? util.inspect(rest, false, null) : ''}`);
}
function ASSERT(b, ...args) {
  if (!b) THROW('test env ASSERT error:', ...args);
}

function toPrint(s) {
  ASSERT(typeof s === 'string', 'nonstring', s);
  s = s
    .replace(/[^\u0000-\u00ff\u2028]/g, function(s) {
      return (
        '\\u' +
        s
          .charCodeAt(0)
          .toString(16)
          .toUpperCase()
      );
    })
    .replace(/[\xa0\x0b\x0c]/g, function(s) {
      return (
        '\\x' +
        s
          .charCodeAt(0)
          .toString(16)
          .toUpperCase()
      );
    })
    .replace(/\t/g, '\\t')
    .replace(/\u2028/g, '\u21a9')
    .replace(/\u000a/g, '\u21b5')
    .replace(/\u000d/g, '\\r');
  if (s.length > 100) return s.slice(0, 100) + '... <TRUNCED>';
  return s;
}

export class Tob {
  constructor(file, data) {
    ASSERT(!data || data.indexOf('\n##'));
    this.file = file;
    this.fileShort = file.slice(file.indexOf('zeparser3'));
    this.oldData = data;
    this.newData = data;

    this.aboveTheFold = '';

    this.inputHead = '';
    this.inputOptions = {};
    this.inputCode = '';

    this.parserRawOutput = {sloppy: {}, strict: {}, module: {}, web: {}}; // {r, e, tok, stdout}

    this.oldOutputSloppy = false;
    this.newOutputSloppy = false;
    this.oldOutputStrict = false;
    this.newOutputStrict = false;
    this.oldOutputModule = false;
    this.newOutputModule = false;
    this.oldOutputWeb = false;
    this.newOutputWeb = false;
  }
}

function getTestFiles(path, file, files, silent, dirsToo) {
  let combo = path + file;
  if (!fs.statSync(combo).isFile()) {
    if (!silent) LOG('getTestFiles dir:', path + file);
    fs.readdirSync(combo + '/').forEach(s => getTestFiles(combo + '/', s, files, silent, dirsToo));
    if (dirsToo) files.push(combo);
  } else {
    if (combo.slice(-3) === '.md' && combo.slice(-'README.md'.length) !== 'README.md') {
      if (!silent) LOG('getTestFiles file:', path + file);
      files.push(combo);
    }
  }
}

function parseTestFile(tob) {

  // Note: a "quintick" is a line that only consists of five backticks. They are used to safely fence of actual
  // arbitrary content while using the markdown system for a code block. Five backticks should not appear in actual JS
  // code so they should not be ambiguous with realistic inputs that test a JS parser.

  // Each test file should have
  // - An arbitrary file header, which runs up to
  // - A line `\n## Input\n`
  //   - optionally followed by a list of options for this test case (``\n - `option = value`\n``)
  //   - optionally followed by arbitrary comments about the test case
  //   - Followed by the test case, wrapped in quinticks
  //   - Remainder of block is ignored
  // - Then optionally the output block;
  //   - A line `\n## Output\n`
  //     - Should have four blocks, each block starting with `\n### <type>\n`
  //     - There will be some generic description that we (this library) adds for clarity
  //     - The actual output, wrapped in quinticks
  //     - Remainder of block is ignored

  // The bits we want to parse are the file header, input options, the input code, and the outputs for sloppy, strict,
  // module, and web compat mode. The rest is procedurally generated by this test runner.

  let {file, oldData} = tob;
  if (!oldData) return;

  ASSERT(oldData.includes(INPUT_HEADER));
  tob.aboveTheFold = oldData.slice(0, oldData.indexOf(INPUT_HEADER));

  let inputHeaderOffset = oldData.indexOf(INPUT_HEADER) + INPUT_HEADER.length;
  ASSERT(oldData.includes(OUTPUT_QUINTICK, inputHeaderOffset));
  tob.inputHead = oldData.slice(inputHeaderOffset, oldData.indexOf(OUTPUT_QUINTICKJS, inputHeaderOffset));

  let inputCodeOffset = oldData.indexOf(OUTPUT_QUINTICKJS, inputHeaderOffset) + OUTPUT_QUINTICKJS.length;
  ASSERT(oldData.includes(OUTPUT_QUINTICK, inputCodeOffset));
  tob.inputCode = oldData.slice(inputCodeOffset, oldData.indexOf(OUTPUT_QUINTICK, inputCodeOffset));

  if (oldData.includes(OUTPUT_HEADER, inputCodeOffset)) {
    let outputOffset = oldData.indexOf(OUTPUT_HEADER, inputCodeOffset);

    ASSERT(oldData.includes(OUTPUT_HEADER_SLOPPY, outputOffset), 'missing sloppy header', file);
    ASSERT(oldData.includes(OUTPUT_HEADER_STRICT, outputOffset), 'missing strict header', file);
    ASSERT(oldData.includes(OUTPUT_HEADER_MODULE, outputOffset), 'missing module header', file);
    ASSERT(oldData.includes(OUTPUT_HEADER_WEB, outputOffset), 'missing web header', file);

    let outputSloppyHeaderOffset = oldData.indexOf(OUTPUT_HEADER_SLOPPY, outputOffset);
    ASSERT(outputSloppyHeaderOffset >= 0);
    let outputSloppyOffset = oldData.indexOf(OUTPUT_QUINTICK, outputSloppyHeaderOffset);
    ASSERT(outputSloppyOffset >= 0, 'every test has at least a sloppy output', file);
    outputSloppyOffset += OUTPUT_QUINTICK.length;
    ASSERT(oldData.includes(OUTPUT_QUINTICK, outputSloppyOffset));
    tob.oldOutputSloppy = oldData.slice(outputSloppyOffset, oldData.indexOf(OUTPUT_QUINTICK, outputSloppyOffset));

    let outputStrictHeaderOffset = oldData.indexOf(OUTPUT_HEADER_STRICT, outputSloppyHeaderOffset);
    ASSERT(outputStrictHeaderOffset >= 0);
    let outputStrictOffset = oldData.indexOf(OUTPUT_QUINTICK, outputStrictHeaderOffset);
    if (outputStrictOffset >= 0) {
      outputStrictOffset += OUTPUT_QUINTICK.length;
      ASSERT(oldData.includes(OUTPUT_QUINTICK, outputStrictOffset + OUTPUT_QUINTICK.length));
      tob.oldOutputStrict = oldData.slice(outputStrictOffset, oldData.indexOf(OUTPUT_QUINTICK, outputStrictOffset));
    } else {
      tob.oldOutputStrict = tob.oldOutputSloppy;
    }

    let outputModuleHeaderOffset = oldData.indexOf(OUTPUT_HEADER_MODULE, outputStrictHeaderOffset);
    ASSERT(outputModuleHeaderOffset >= 0);
    let outputModuleOffset = oldData.indexOf(OUTPUT_QUINTICK, outputModuleHeaderOffset);
    if (outputModuleOffset >= 0) {
      outputModuleOffset += OUTPUT_QUINTICK.length;
      ASSERT(oldData.includes(OUTPUT_QUINTICK, outputModuleOffset));
      tob.oldOutputModule = oldData.slice(outputModuleOffset, oldData.indexOf(OUTPUT_QUINTICK, outputModuleOffset));
    } else {
      tob.oldOutputModule = tob.oldOutputStrict; // meh? module probably mimics strict, rather than sloppy
    }

    let outputWebHeaderOffset = oldData.indexOf(OUTPUT_HEADER_WEB, outputModuleHeaderOffset);
    ASSERT(outputWebHeaderOffset >= 0);
    let outputWebOffset = oldData.indexOf(OUTPUT_QUINTICK, outputWebHeaderOffset);
    let nextHash = oldData.indexOf('\n##', outputWebHeaderOffset + 5);
    if (outputWebOffset >= 0 && (nextHash < 0 || nextHash > outputWebOffset)) {
      outputWebOffset += OUTPUT_QUINTICK.length;
      ASSERT(oldData.includes(OUTPUT_QUINTICK, outputWebOffset));
      tob.oldOutputWeb = oldData.slice(outputWebOffset, oldData.indexOf(OUTPUT_QUINTICK, outputWebOffset));
    } else {
      tob.oldOutputWeb = tob.oldOutputSloppy;
    }
  }

  // Parse the parameters between input header and START
  tob.inputOptions = tob.inputHead
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.slice(0, 3) === '- `' && s.slice(-1) === '`')
    .reduce((obj, s) => {
      // Each line should be ``- `name = value` ``
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
}

async function readFiles(files) {
  return await Promise.all(files.map(promiseToReadFile));
}
function promiseToReadFile(file) {
  let res,rej,p = new Promise((resolve, reject) => (res = resolve, rej = reject));
  fs.readFile(file, 'utf8', (err, data) => err ? rej(err) : res(new Tob(file, data)));
  return p;
}

function promiseToWriteFile(file, data) {
  let res,rej,p = new Promise((resolve, reject) => (res = resolve, rej = reject));
  fs.writeFile(file, data, 'utf8', err => err ? rej(err) : res());
  return p;
}

async function question(msg) {
  // Probably massive overkill :/
  let resolve, p = new Promise(ok => resolve = ok);
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question(msg + ' ', answer => resolve(answer));
  let r = await p;
  rl.close();
  return r;
}
async function yn(msg = 'Answer?') {
  // Keep asking the question in console until the user types `y`, `yes`, `n`, or `no`.
  let answer = String(await question(msg)).toLowerCase();
  answer = String(answer).toLowerCase();

  if (answer === 'n' || answer === 'no' || answer === 'q') return false;
  while (answer !== 'y' && answer !== 'yes') {
    answer = await question(msg + ': [y, n]');
    answer = String(answer).toLowerCase();

    if (answer === 'n' || answer === 'no' || answer === 'q') return false;
  }

  return true;
}

export {
  PASS,
  FAIL,
  MODE_MODULE,
  MODE_SCRIPT,
  USE_SLOPPY_MODE,
  USE_STRICT_MODE,
  PARSE_MODE_DIV,
  PARSE_MODE_REGEX,
  PARSE_MODE_TICK,
  WEB_COMPAT_ALWAYS,
  WEB_COMPAT_NEVER,

  INPUT_HEADER,
  OUTPUT_HEADER,
  OUTPUT_HEADER_SLOPPY,
  OUTPUT_HEADER_STRICT,
  OUTPUT_HEADER_MODULE,
  OUTPUT_HEADER_WEB,
  OUTPUT_QUINTICK,
  OUTPUT_QUINTICKJS,

  ASSERT,
  getTestFiles,
  _LOG,
  LOG,
  parseTestFile,
  promiseToReadFile,
  promiseToWriteFile,
  readFiles,
  toPrint,
  THROW,
  yn,
};
