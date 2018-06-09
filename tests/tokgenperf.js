#!/usr/bin/env node

let {toPrint} = require('./utils.js');
let {default: generate, pieces, r} = require('./fuzz_tokens');
//import ZeTokenizer, {
let {
  default: ZeTokenizer,
  $ASI,
  $COMMENT,
  $COMMENT_SINGLE,
  $COMMENT_MULTI,
  $CRLF,
  $EOF,
  $ERROR,
  $IDENT,
  $NL,
  $NUMBER,
  $NUMBER_HEX,
  $NUMBER_DEC,
  $NUMBER_BIN,
  $NUMBER_OCT,
  $NUMBER_OLD,
  $PUNCTUATOR,
  $REGEX,
  $REGEXU,
  $SPACE,
  $STRING,
  $STRING_DOUBLE,
  $STRING_SINGLE,
  $TAB,
  $TICK_BODY,
  $TICK_HEAD,
  $TICK_PURE,
  $TICK_TAIL,
  $WHITE,

  debug_toktype,
} = require('../src/zetokenizer'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from '../src/zetokenizer';

function repeat(n, parts) {
  let s = '';
  while (n-- > 0) {
    let obj = r(parts);
    let code = generate(obj);
    s += code;
  }
  return s;
}

let code = repeat(100000, [
  [pieces.comment.single, pieces.comment.multi],
  [pieces.number.hex, pieces.number.bin, pieces.number.oct, pieces.number.dec.int, pieces.number.dec.dot, pieces.number.dec.exp, pieces.number.dec.all],
  [pieces.string.single, pieces.string.double],
  pieces.template,
  pieces.ident,
  [pieces.regex.sloppy, pieces.regex.strict],

  [pieces.error.string.single, pieces.error.string.double, pieces.error.template, pieces.error.regex.sloppy, pieces.error.regex.strict],
]);

console.log(code);
