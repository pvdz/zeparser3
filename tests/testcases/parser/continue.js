//import ZeTokenizer, {
let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests = [
  'continue statement',
  {
    code: 'continue;',
    ast: {type: 'Program', body: [{type: 'ContinueStatement', label: null}]},
    desc: 'continue at eof (without label, with semi)',
    tokens: [$IDENT, $PUNCTUATOR],
  },
  {
    code: 'continue',
    ast: {type: 'Program', body: [{type: 'ContinueStatement', label: null}]},
    desc: 'continue at eof (without label, without semi)',
    tokens: [$IDENT, $ASI],
  },
  {
    code: 'continue foo;',
    ast: {type: 'Program', body: [{type: 'ContinueStatement', label: {type: 'Identifier', name: 'foo'}}]},
    desc: 'continue at eof (with label, with semi)',
    tokens: [$IDENT, $IDENT, $PUNCTUATOR],
  },
  {
    code: 'continue foo',
    ast: {type: 'Program', body: [{type: 'ContinueStatement', label: {type: 'Identifier', name: 'foo'}}]},
    desc: 'continue at eof (with label, without semi)',
    tokens: [$IDENT, $IDENT, $ASI],
  },
  {
    code: 'continue; continue;',
    ast: {type: 'Program', body: [
      {type: 'ContinueStatement', label: null},
      {type: 'ContinueStatement', label: null},
    ]},
    desc: 'double continue',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  },
  {
    code: 'continue\ncontinue;',
    ast: {type: 'Program', body: [
      {type: 'ContinueStatement', label: null},
      {type: 'ContinueStatement', label: null},
    ]},
    desc: 'double continue with asi',
    tokens: [$IDENT, $ASI, $IDENT, $PUNCTUATOR],
  },
  {
    code: 'continue foo;continue;',
    ast: {type: 'Program', body: [
      {type: 'ContinueStatement', label: {type: 'Identifier', name: 'foo'}},
      {type: 'ContinueStatement', label: null},
    ]},
    desc: 'double continue with label and semi',
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  },
  {
    code: 'continue foo\ncontinue;',
    ast: {type: 'Program', body: [
      {type: 'ContinueStatement', label: {type: 'Identifier', name: 'foo'}},
      {type: 'ContinueStatement', label: null},
    ]},
    desc: 'double continue with label and asi',
    tokens: [$IDENT, $IDENT, $ASI, $IDENT, $PUNCTUATOR],
  },
];

//export default tests;
module.exports = tests;
