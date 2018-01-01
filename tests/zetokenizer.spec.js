#!/usr/bin/env node

// [input:str|str[], output:num|num[], [mode:flag|flags[]=0], [desc:str], [skipVersion:string|string[]='']
// (mode is a constant defined below, like script-type, regexDiv, strict mode, etc)
// if mode is not given, both sloppy and strict mode are tested
// desc is required when skipVersion is used
// if input is an array, all inputs should match the same output
// if output is an array, input should yield multiple (those) tokens

//import {
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

  LOG,
} = require('./utils');
//} from './utils';

//import ZeTokenizer, {
let { default: ZeTokenizer,
  $CRLF,
  $EOF,
  $NL,
  $SPACE,

  GOAL_MODULE,
  GOAL_SCRIPT,

  STRICT_MODE,
  FOR_REGEX,
  IN_TEMPLATE,

  WEB_COMPAT_OFF,
  WEB_COMPAT_ON,

  debug_toktype,
} = require('../src/zetokenizer'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from '../src/zetokenizer';

//import whitespaces from './testcases/lexer/whitespaces';
let whitespaces = require('./testcases/lexer/whitespaces');
//import comments from './testcases/lexer/comments';
let comments = require('./testcases/lexer/comments');
//import punctuators from './testcases/lexer/punctuators';
let punctuators = require('./testcases/lexer/punctuators');
//import numbers from './testcases/lexer/numbers';
let numbers = require('./testcases/lexer/numbers');
//import identifiers from './testcases/lexer/identifiers';
let identifiers = require('./testcases/lexer/identifiers');
//import strings_single from './testcases/lexer/strings_single';
let strings_single = require('./testcases/lexer/strings_single');
//import strings_double from './testcases/lexer/strings_double';
let strings_double = require('./testcases/lexer/strings_double');
//import regexesn from './testcases/lexer/regexesn';
let regexesn = require('./testcases/lexer/regexesn');
//import regexesu from './testcases/lexer/regexesu';
let regexesu = require('./testcases/lexer/regexesu');
//import strings_template_static from './testcases/lexer/strings_template_static';
let strings_template_static = require('./testcases/lexer/strings_template_static');
//import strings_template_head from './testcases/lexer/strings_template_head';
let strings_template_head = require('./testcases/lexer/strings_template_head');
//import strings_template_body from './testcases/lexer/strings_template_body';
let strings_template_body = require('./testcases/lexer/strings_template_body');
//import strings_template_tail from './testcases/lexer/strings_template_tail';
let strings_template_tail = require('./testcases/lexer/strings_template_tail');

let testIndex = 0;
let all = [
  ...whitespaces,
  ...comments,
  ...punctuators,
  ...numbers,
  ...strings_single,
  ...strings_double,
  ...identifiers,
  ...regexesn,
  ...regexesu,
  ...strings_template_static,
  ...strings_template_head,
  ...strings_template_body,
  ...strings_template_tail,
];

LOG('### Running...');
let fails = 0;
for (let [input, output, modi, desc, skip] of all) {
  if (typeof modi === 'string') {
    skip = desc;
    desc = modi;
    modi = [MODE_MODULE | USE_SLOPPY_MODE | PARSE_MODE_REGEX, MODE_MODULE | USE_STRICT_MODE | PARSE_MODE_REGEX]; // by default, check both strict and sloppy mode
  }
  if (!(input instanceof Array)) input = [input];
  if (!(output instanceof Array)) output = [output];
  if (!(skip instanceof Array)) skip = [skip];
  if (!(modi instanceof Array)) modi = [modi];

  for (let outerCode of input) {
    for (let _mode of modi) {
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
          if (mode & PARSE_MODE_REGEX) lexerFlags |= FOR_REGEX;
          if (mode & USE_STRICT_MODE) lexerFlags |= STRICT_MODE;
          if (mode & PARSE_MODE_TICK) lexerFlags |= IN_TEMPLATE;
          let asModule = (mode & MODE_MODULE) ? GOAL_MODULE : GOAL_SCRIPT;

          try {
            let tok = ZeTokenizer(code, asModule, undefined, webMode);

            let failed = false;
            let token;
            for (let exp of outs) {
              token = tok(lexerFlags, true);
              collects.push(token.type);
              if (token.type !== exp) LOG('(1) failed=', failed = true, 'because', debug_toktype(token.type || 0), '!==', debug_toktype(exp.type || 0), 'token:', token, 'exp:', exp);
              if (token.type === $EOF) break;
            }

            // keep parsing even if it failed. EOF must always be emitted, even if
            // an error occurred, and it must mean the pointer is beyond the input
            if (!failed && token.type !== $EOF) {
              failed = true;
              LOG('FAIL (2) because last token wasnt EOF');
              do {
                token = tok(lexerFlags, true);
                collects.push(token.type);
              } while (token.type !== $EOF);
            }

            LOG((failed ? 'FAIL: ' : 'PASS: ') + testIndex + ' (' + ((mode & STRICT_MODE) ? 'strict' : 'sloppy') + ')(' + testVariety + ')[' + (mode & PARSE_MODE_REGEX) + (mode & PARSE_MODE_TICK) + asModule + ']['+(webMode===WEB_COMPAT_ALWAYS?'WEB':'NOR')+']: ', [toPrint(code)], '  -->  ' + outs.map(debug_toktype) + ', was; ' + collects.map(debug_toktype) + (!failed ? '' : ' => ' + desc));
            if (failed) {
              ++fails;
              if (testVariety === 'original') orifailed = true;
            }
          } catch (rethrow) {
            LOG('ERROR: ' + testIndex + ' (' + ((mode & STRICT_MODE) ? 'strict' : 'sloppy') + ')(' + testVariety + ')[' + (mode & PARSE_MODE_REGEX) + (mode & PARSE_MODE_TICK) + asModule + ']['+(webMode===WEB_COMPAT_ALWAYS?'WEB':'NOR')+']: `' + toPrint(code) + '`  -->  ' + outs.map(debug_toktype) + ', was so far; ' + collects.map(debug_toktype) + ' => ' + desc);
            throw rethrow;
          }
        }
      }
    }
  }
}
LOG('###\nPassed', (testIndex - fails) + 1, '/', testIndex + 1, 'tests (', fails, 'failures )')

function toPrint(s) {
  return s
    .replace(/[^\u0000-\u00ff\u2028]/g, function (s) {
      return '\\u' + s.charCodeAt(0).toString(16).toUpperCase();
    })
    .replace(/[\xa0\x0b\x0c]/g, function (s) {
      return '\\x' + s.charCodeAt(0).toString(16).toUpperCase();
    })
    .replace(/\t/g, '\\t')
    .replace(/\u2028/g, '\u21a9')
    .replace(/\u000a/g, '\u21b5')
    .replace(/\u000d/g, '\\r');
}
