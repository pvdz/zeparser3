//import ZeTokenizer, {
let {
  $ASI,
  $EOF,
  $ERROR,
  $IDENT,
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
  $TICK,
  $TICK_BODY,
  $TICK_HEAD,
  $TICK_PURE,
  $TICK_TAIL,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests = [
  'return statement',
  {
    code: 'return;',
    ast: {type: 'Program', body: [
      {type: 'ReturnStatement', argument: null},
    ]},
    desc: 'return, no value, semi',
    tokens: [$IDENT, $PUNCTUATOR],
  },
  {
    code: 'return',
    ast: {type: 'Program', body: [
      {type: 'ReturnStatement', argument: null},
    ]},
    desc: 'return, no value, eof',
    tokens: [$IDENT, $ASI],
  },
  {
    code: 'return;return;',
    ast: {type: 'Program', body: [
      {type: 'ReturnStatement', argument: null},
      {type: 'ReturnStatement', argument: null},
    ]},
    desc: 'double return, no value, semi',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  },
  {
    code: 'return\nreturn',
    ast: {type: 'Program', body: [
      {type: 'ReturnStatement', argument: null},
      {type: 'ReturnStatement', argument: null},
    ]},
    desc: 'double return, no value, eof',
    tokens: [$IDENT, $ASI, $IDENT, $ASI],
  },
  {
    code: 'return foo;',
    ast: {type: 'Program', body: [
      {type: 'ReturnStatement', argument: {type: 'Identifier', name: 'foo'}},
    ]},
    desc: 'return, no value, semi',
    tokens: [$IDENT, $IDENT, $PUNCTUATOR],
  },
  {
    code: 'return 15;',
    ast: {type: 'Program', body: [
      {type: 'ReturnStatement', argument: {type: 'Literal', value: '<TODO>', raw: '15'}},
    ]},
    desc: 'return, no value, semi',
    tokens: [$IDENT, $NUMBER_DEC, $PUNCTUATOR],
  },
];

//export default tests;
module.exports = tests;
