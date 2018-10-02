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

function LOG(...args) {
  let pre = args[0].slice(0, 4);
  if (pre !== 'PASS' && pre !== 'SKIP') {
    console.log.apply(console, args);
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

  LOG,
  toPrint,
  THROW,
};
