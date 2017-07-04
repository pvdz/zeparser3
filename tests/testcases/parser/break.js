//import ZeTokenizer, {
let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests =   [
  'break statement',
  {
    code: 'break;',
    ast: {type: 'Program', body: [{type: 'BreakStatement', label: null}]},
    desc: 'break at eof (without label, with semi)',
    tokens: [$IDENT, $PUNCTUATOR],
  },
  {
    code: 'break',
    ast: {type: 'Program', body: [{type: 'BreakStatement', label: null}]},
    desc: 'break at eof (without label, without semi)',
    tokens: [$IDENT, $ASI],
  },
  {
    code: 'break foo;',
    ast: {type: 'Program', body: [{type: 'BreakStatement', label: {type: 'Identifier', name: 'foo'}}]},
    desc: 'break at eof (with label, with semi)',
    tokens: [$IDENT, $IDENT, $PUNCTUATOR],
  },
  {
    code: 'break foo',
    ast: {type: 'Program', body: [{type: 'BreakStatement', label: {type: 'Identifier', name: 'foo'}}]},
    desc: 'break at eof (with label, without semi)',
    tokens: [$IDENT, $IDENT, $ASI],
  },
  {
    code: 'break; break;',
    ast: {type: 'Program', body: [
      {type: 'BreakStatement', label: null},
      {type: 'BreakStatement', label: null},
    ]},
    desc: 'double break',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  },
  {
    code: 'break\nbreak;',
    ast: {type: 'Program', body: [
      {type: 'BreakStatement', label: null},
      {type: 'BreakStatement', label: null},
    ]},
    desc: 'double break with asi',
    tokens: [$IDENT, $ASI, $IDENT, $PUNCTUATOR],
  },
  {
    code: 'break foo;break;',
    ast: {type: 'Program', body: [
      {type: 'BreakStatement', label: {type: 'Identifier', name: 'foo'}},
      {type: 'BreakStatement', label: null},
    ]},
    desc: 'double break with label and semi',
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  },
  {
    code: 'break foo\nbreak;',
    ast: {type: 'Program', body: [
      {type: 'BreakStatement', label: {type: 'Identifier', name: 'foo'}},
      {type: 'BreakStatement', label: null},
    ]},
    desc: 'double break with label and asi',
    tokens: [$IDENT, $IDENT, $ASI, $IDENT, $PUNCTUATOR],
  },
];

//export default tests;
module.exports = tests;
