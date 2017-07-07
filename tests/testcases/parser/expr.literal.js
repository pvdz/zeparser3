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

let literals = [
  '  literals',
  {
    code: 'null',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'Literal',
        value: null,
        raw: 'null',
      }},
    ]},
    desc: 'null literal',
    tokens: [$IDENT, $ASI],
  },
  {
    code: 'true',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'Literal',
        value: true,
        raw: 'true',
      }},
    ]},
    desc: 'true literal',
    tokens: [$IDENT, $ASI],
  },
  {
    code: 'false',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'Literal',
        value: false,
        raw: 'false',
      }},
    ]},
    desc: 'false literal',
    tokens: [$IDENT, $ASI],
  },
  {
    code: 'super',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'Super',
      }},
    ]},
    desc: 'super literal', // to be refined...
    tokens: [$IDENT, $ASI],
  },
  {
    code: '"foo"',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"foo"',
      }},
    ]},
    desc: 'double string literal',
    tokens: [$STRING_DOUBLE, $ASI],
  },
  {
    code: `'foo'`,
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'Literal',
        value: '<TODO>',
        raw: `'foo'`,
      }},
    ]},
    desc: 'single string literal',
    tokens: [$STRING_SINGLE, $ASI],
  },
  {
    code: '123',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'Literal',
        value: '<TODO>',
        raw: '123',
      }},
    ]},
    desc: 'decimal number',
    tokens: [$NUMBER_DEC, $ASI],
  },
  {
    code: '0x123',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'Literal',
        value: '<TODO>',
        raw: '0x123',
      }},
    ]},
    desc: 'hexadecimal number',
    tokens: [$NUMBER_HEX, $ASI],
  },
  {
    code: '0o123',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'Literal',
        value: '<TODO>',
        raw: '0o123',
      }},
    ]},
    desc: 'octal number',
    tokens: [$NUMBER_OCT, $ASI],
  },
  {
    code: '0b1010',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'Literal',
        value: '<TODO>',
        raw: '0b1010',
      }},
    ]},
    desc: 'binary number',
    tokens: [$NUMBER_BIN, $ASI],
  },
  {
    code: '0456',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'Literal',
        value: '<TODO>',
        raw: '0456',
      }},
    ]},
    desc: 'legacy octal number',
    tokens: [$NUMBER_OLD, $ASI],
  },
  {
    code: 'this',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'ThisExpression',
      }},
    ]},
    desc: 'this keyword',
    tokens: [$IDENT, $ASI],
  },
];

module.exports = literals;
