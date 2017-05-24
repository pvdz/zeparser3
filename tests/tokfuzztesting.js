#!/usr/bin/env node

let {
  toPrint,
} = require('./utils.js');
let { default: generate,
  pieces,
  r,
} = require('./fuzz_tokens');
//import ZeTokenizer, {
let { default: ZeTokenizer,
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


function repeat(n, arr) {
  for (let i = 0; i < n; ++i) {
    //if (i % 1000 === 0) mr = Math.random() * 0.3; // make sure the seed remains spicy
    let obj = r(arr);
    let code = generate(obj);
    let out = parseSafe(code, obj);
    let token = obj.token;
    if (true && obj.evallable) {
      let compileError = uncompilableToken(code);
      if ((!!compileError) !== (token === $ERROR)) {
        let pp = toPrint(code);
        console.log(i + '   !!!BAD TEST!!!   ' + pp);
        console.log('Compiled result:', compileError || '(expected an error but none was thrown)');
        throw 'stop because a test expected a different result from real world';
      }
    }
    if (typeof token === 'function') token = token(code);
    if (typeof out === 'string') {
      let pp = toPrint(code);
      console.log(i + '   !!!CRASH!!!   ' + pp);
      console.log(out);
      throw 'stop because a test crashed';
    } else {
      let ok = out.type === token;
      let printing = !ok || (i % 5e4 === 0);
      if (printing) {
        let pp = toPrint(code);
        let white1 = ' '.repeat(Math.max(5, 20-debug_toktype(out.type).length));
        let white2 = ' '.repeat(Math.max(5, 50-pp.length));
        if (ok) {
          console.log(i + ' PASS  ' + debug_toktype(out.type) + white1 + pp);
        } else {
          console.log(i +' FAIL!! ' + debug_toktype(out.type) + white1 + pp + white2 + ' --> expected ' + debug_toktype(token));
        }
      }
      if (!ok) throw 'stop because a test failed';
    }
  }
}
function parseSafe(code, obj) {
  try {
    let tok = ZeTokenizer(code, false);
    return tok(!!obj.slashIsRegex, !!obj.strictMode, !!obj.fromTemplate, true);
  } catch (e) {
    return new Error(e).stack;
  }
}

function uncompilableToken(code) {
  try {
    Function('return ' + code);
    return false;
  } catch (e) {
    return new Error(e.message) || 'unknown error';
  }
}

repeat(Infinity, [
  [pieces.comment.single, pieces.comment.multi],
  [pieces.number.hex, pieces.number.bin, pieces.number.oct, pieces.number.dec.int, pieces.number.dec.dot, pieces.number.dec.exp, pieces.number.dec.all],
  [pieces.string.single, pieces.string.double],
  pieces.template,
  pieces.ident,
  [pieces.regex.sloppy, pieces.regex.strict],

  [pieces.error.string.single, pieces.error.string.double, pieces.error.template, pieces.error.regex.sloppy, pieces.error.regex.strict],
]);
