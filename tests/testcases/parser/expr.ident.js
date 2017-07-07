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

module.exports = [
  '  ident statement',
  {
    code: 'foo;',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
    ]},
    desc: 'ident with semi',
    tokens: [$IDENT, $PUNCTUATOR],
  },
  {
    code: 'foo',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
    ]},
    desc: 'ident with eof',
    tokens: [$IDENT, $ASI],
  },
  {
    code: 'foo;bar;',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
      {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
    ]},
    desc: 'double ident with semi',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  },
  {
    code: 'foo\nbar',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
      {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
    ]},
    desc: 'double ident with asi',
    tokens: [$IDENT, $ASI, $IDENT, $ASI],
  },
];
