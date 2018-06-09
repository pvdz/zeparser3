#!/usr/bin/env node

// [input:str|str[], output:num|num[], [mode:flag|flags[]=0], [desc:str], [skipVersion:string|string[]='']
// (mode is a constant defined below, like script-type, regexDiv, strict mode, etc)
// if mode is not given, both sloppy and strict mode are tested
// desc is required when skipVersion is used
// if input is an array, all inputs should match the same output
// if output is an array, input should yield multiple (those) tokens

const fs = require('fs');

let {
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

  COLLECT_TOKENS_NONE,

  LOG,
  THROW,
} = require('./utils');

let {
  default: ZeTokenizer,
  $CRLF,
  $EOF,
  $NL,
  $SPACE,

  LF_FOR_REGEX,
  LF_IN_TEMPLATE,
  LF_STRICT_MODE,
  LF_SLOPPY_MODE,

  WEB_COMPAT_OFF,
  WEB_COMPAT_ON,

  RETURN_ANY_TOKENS,

  debug_toktype,
  LF_DEBUG,
} = require('../src/zetokenizer');

const FAIL_FAST = true;

let dir = __dirname + '/testcases/lexer';
let files = [];
function read(path, file) {
  let combo = path + file;
  //console.log([path, file], combo)
  console.log('read:', path + file);
  if (fs.statSync(combo).isFile()) {
    files.push(combo);
  } else {
    fs.readdirSync(combo + '/').forEach(s => read(combo + '/', s));
  }
}
read(dir, '');

files = files.filter(f => f.indexOf('string_body') < 0);

files.sort((a, b) => {
  // push test262 to the back so our own unit tests can find problems first
  if (a.indexOf('test262') >= 0) return 1;
  if (b.indexOf('test262') >= 0) return -1;
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
});

let testIndex = 0;
let all = [];
files.forEach(path => {
  console.log('Getting tests from', path);
  all.push(...require(path).map(a => [a, 'From: ' + path]));
});

LOG('### Running...');
let fails = 0;
for (let [[input, output, modi, desc, skip], fromPath] of all) {
  if (typeof modi === 'string') {
    skip = desc;
    desc = modi;
    modi = [MODE_MODULE | PARSE_MODE_REGEX, MODE_MODULE | PARSE_MODE_REGEX]; // by default, check both strict and sloppy mode
  }
  if (!(input instanceof Array)) input = [input];
  if (!(output instanceof Array)) output = [output];
  if (!(skip instanceof Array)) skip = [skip];
  if (!(modi instanceof Array)) modi = [modi];
  if (output.some(v => v === undefined)) throw 'Bad test: expected type is undefined:' + output;

  for (let outerCode of input) {
    for (let _mode of modi) {
      let sloppystricts = [];
      if ((_mode & USE_SLOPPY_MODE) !== USE_SLOPPY_MODE) sloppystricts.push(LF_STRICT_MODE);
      if ((_mode & USE_STRICT_MODE) !== USE_STRICT_MODE) sloppystricts.push(LF_SLOPPY_MODE);
      if ((_mode & USE_SLOPPY_MODE) === USE_SLOPPY_MODE && (_mode & USE_STRICT_MODE) === USE_STRICT_MODE)
        THROW('Test `' + input + '` specifies strict AND sloppy, in that case specify neither\n' + fromPath);
      for (let sloppyOrStrict of sloppystricts) {
        // parse in web compat mode and without that mode unless the test explicitly opts in to either
        let webi = [];
        if ((_mode & WEB_COMPAT_NEVER) === WEB_COMPAT_NEVER) webi.push(WEB_COMPAT_OFF);
        if ((_mode & WEB_COMPAT_ALWAYS) === WEB_COMPAT_ALWAYS) webi.push(WEB_COMPAT_ON);
        if (webi.length === 0) webi.push(WEB_COMPAT_OFF, WEB_COMPAT_ON);
        for (let webMode of webi) {
          let mode = _mode;
          let orifailed = false;
          let varieties = ['original', '- prefixsp', '- suffixsp', '- prefixnl', '- suffixls', '- suffixcr', '- suffcrlf'];
          if (mode & PARSE_MODE_TICK) {
            // suffixes causing too much noise on automated template tests
            varieties = ['original', '- prefixsp', '- prefixnl'];
            if (outerCode[0] === '`') mode ^= PARSE_MODE_TICK; // remove tick mode which actually assumes you parse from }
          }
          for (let testVariety of varieties) {
            ++testIndex;
            if (orifailed) {
              LOG('SKIP: ' + testIndex + ' (original failed)');
              continue;
            }

            //if (testIndex !== 17123) continue;

            let code = outerCode;
            let outs = output.slice(0);
            switch (testVariety) {
              case '- prefixnl':
                if (skip.indexOf('prefixnl') >= 0) {
                  LOG('SKIP: ' + testIndex + ' (' + testVariety + ')');
                  continue;
                } else {
                  code = '\u2028' + code; // use 2028 to prevent cr <> crlf problems. parser should be fine with this.
                  outs.unshift($NL);
                }
                break;
              case '- suffixls':
                if (skip.indexOf('suffixls') >= 0) {
                  LOG('SKIP: ' + testIndex + ' (' + testVariety + ')');
                  continue;
                } else {
                  code = code + '\u2028';
                  outs.push($NL);
                }
                break;
              case '- suffixcr':
                if (skip.indexOf('suffixcr') >= 0) {
                  LOG('SKIP: ' + testIndex + ' (' + testVariety + ')');
                  continue;
                } else {
                  code = code + '\r';
                  outs.push($NL);
                }
                break;
              case '- suffcrlf':
                if (skip.indexOf('suffcrlf') >= 0) {
                  LOG('SKIP: ' + testIndex + ' (' + testVariety + ')');
                  continue;
                } else {
                  code = code + '\r\n';
                  outs.push($CRLF);
                }
                break;
              case '- prefixsp':
                if (skip.indexOf('prefixsp') >= 0) {
                  LOG('SKIP: ' + testIndex + ' (' + testVariety + ')');
                  continue;
                } else {
                  code = ' ' + code;
                  outs.unshift($SPACE);
                }
                break;
              case '- suffixsp':
                if (skip.indexOf('suffixsp') >= 0) {
                  LOG('SKIP: ' + testIndex + ' (' + testVariety + ')');
                  continue;
                } else {
                  code = code + ' ';
                  outs.push($SPACE);
                }
                break;
            }

            outs.push($EOF);

            let collects = [];
            let lexerFlags = 0;
            if (mode & PARSE_MODE_REGEX) {
              lexerFlags |= LF_FOR_REGEX;
            }
            let isStrict = sloppyOrStrict === USE_STRICT_MODE;
            if (isStrict) lexerFlags |= LF_STRICT_MODE;
            if (mode & PARSE_MODE_TICK) lexerFlags |= LF_IN_TEMPLATE;

            let failed = false;
            try {
              // function ZeTokenizer(input, goal, collectTokens = COLLECT_TOKENS_NONE, webCompat = WEB_COMPAT_ON)
              let tok = ZeTokenizer(code, COLLECT_TOKENS_NONE, webMode);

              let token;
              for (let exp of outs) {
                if (exp === undefined) {
                  console.log('Failing because tokenizer is parsing more tokens than expected');
                }
                token = tok(lexerFlags, RETURN_ANY_TOKENS);
                collects.push(token.type);
                if (token.type !== exp) {
                  failed = true;
                  LOG(
                    '(1) failed=',
                    failed,
                    'because we got',
                    debug_toktype(token.type || 0),
                    'but expected',
                    debug_toktype(exp || 0),
                    'token:',
                    token,
                    'exp:',
                    debug_toktype(exp),
                  );
                }
                if (token.type === $EOF) break;
              }

              // keep parsing even if it failed. EOF must always be emitted, even if
              // an error occurred, and it must mean the pointer is beyond the input
              if (!failed && token.type !== $EOF) {
                failed = true;
                LOG('FAIL (2) because last token wasnt EOF');
                do {
                  token = tok(lexerFlags, RETURN_ANY_TOKENS);
                  collects.push(token.type);
                } while (token.type !== $EOF);
              }

              LOG(
                (failed ? 'FAIL: ' : 'PASS: ') +
                  'i' +
                  testIndex +
                  ' (' +
                  (isStrict ? 'strict' : 'sloppy') +
                  ')(' +
                  testVariety +
                  ')[' +
                  LF_DEBUG(lexerFlags) +
                  sloppystricts +
                  '][' +
                  (webMode === WEB_COMPAT_ALWAYS ? 'WEBC' : 'SPEC') +
                  ']: ',
                [toPrint(code)],
                '  -->  ' + outs.map(debug_toktype) + ', was; ' + collects.map(debug_toktype) + (!failed ? '' : ' => ' + desc),
              );
              if (failed) LOG(fromPath);
              if (failed) {
                ++fails;
                if (testVariety === 'original') orifailed = true;
              }
            } catch (rethrow) {
              LOG(
                'CRASH: ' +
                  'i' +
                  testIndex +
                  ' (' +
                  (isStrict ? 'strict' : 'sloppy') +
                  ')(' +
                  testVariety +
                  ')[' +
                  LF_DEBUG(lexerFlags) +
                  sloppystricts +
                  '][' +
                  (webMode === WEB_COMPAT_ALWAYS ? 'WEBC' : 'SPEC') +
                  ']: `' +
                  toPrint(code) +
                  '`  -->  ' +
                  outs.map(debug_toktype) +
                  ', was so far; ' +
                  collects.map(debug_toktype) +
                  ' => ' +
                  desc,
              );
              LOG(fromPath);
              throw rethrow;
            }
            if (failed && FAIL_FAST) throw 'FAIL_FAST';
          }
        }
      }
    }
  }
}
LOG('###\nPassed', testIndex - fails + 1, '/', testIndex + 1, 'tests (', fails, 'failures )');

function toPrint(s) {
  return s
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
}
