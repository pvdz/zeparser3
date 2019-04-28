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

const BOLD = '\x1b[;1;1m';
const BLINK = '\x1b[;5;1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

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
  console.log('error args:', rest.length ? util.inspect(rest, false, null) : '<none>');
  throw new Error(`Toktest error! ${str} ${rest.length ? util.inspect(rest, false, null) : ''}`);
}

function toPrint(s) {
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

//export {
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

  _LOG,
  LOG,
  toPrint,
  THROW,
};
