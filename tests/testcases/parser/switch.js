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
  'switch statement',
  {
    code: 'switch (foo) {}',
    ast: {type: 'Program', body: [
      {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'foo'}, cases: []},
    ]},
    desc: 'empty switch',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: 'switch (A) {case B: C;}',
    ast: {type: 'Program', body: [
      {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'A'}, cases: [
        {type: 'SwitchCase', test: {type: 'Identifier', name: 'B'}, consequent: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}},
        ]},
      ]},
    ]},
    desc: 'switch with a simple case',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: 'switch (A) {default: B;}',
    ast: {type: 'Program', body: [
      {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'A'}, cases: [
        {type: 'SwitchCase', test: null, consequent: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'B'}},
        ]},
      ]},
    ]},
    desc: 'switch with a simple default',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: 'switch (A) {case B: C; default: D;}',
    ast: {type: 'Program', body: [
      {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'A'}, cases: [
        {type: 'SwitchCase', test: {type: 'Identifier', name: 'B'}, consequent: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}},
        ]},
        {type: 'SwitchCase', test: null, consequent: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'D'}},
        ]},
      ]},
    ]},
    desc: 'switch with a simple case and default',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: 'switch (A) {default: D; case B: C; }',
    ast: {type: 'Program', body: [
      {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'A'}, cases: [
        {type: 'SwitchCase', test: null, consequent: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'D'}},
        ]},
        {type: 'SwitchCase', test: {type: 'Identifier', name: 'B'}, consequent: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}},
        ]},
      ]},
    ]},
    desc: 'switch with a simple default and case',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: 'switch (A) {case B: C; case D: E;}',
    ast: {type: 'Program', body: [
      {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'A'}, cases: [
        {type: 'SwitchCase', test: {type: 'Identifier', name: 'B'}, consequent: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}},
        ]},
        {type: 'SwitchCase', test: {type: 'Identifier', name: 'D'}, consequent: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'E'}},
        ]},
      ]},
    ]},
    desc: 'switch with a two cases',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: 'switch (A) {case B: C; break; case D: E; break;}',
    ast: {type: 'Program', body: [
      {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'A'}, cases: [
        {type: 'SwitchCase', test: {type: 'Identifier', name: 'B'}, consequent: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}},
          {type: 'BreakStatement', label: null},
        ]},
        {type: 'SwitchCase', test: {type: 'Identifier', name: 'D'}, consequent: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'E'}},
          {type: 'BreakStatement', label: null},
        ]},
      ]},
    ]},
    desc: 'switch with a two cases',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: 'switch (A) {default: B; break;}',
    ast: {type: 'Program', body: [
      {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'A'}, cases: [
        {type: 'SwitchCase', test: null, consequent: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'B'}},
          {type: 'BreakStatement', label: null},
        ]},
      ]},
    ]},
    desc: 'switch with a simple default and break',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
];

//export default tests;
module.exports = tests;
