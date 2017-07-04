//import ZeTokenizer, {
let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests =   [
  'block statement',
  {
    code: '{}',
    ast: {type: 'Program', body: [{type: 'BlockStatement', body: []}]},
    desc: 'empty block',
    tokens: [$PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: '{debugger;}',
    ast: {type: 'Program', body: [{type: 'BlockStatement', body: [
      {type: 'DebuggerStatement'},
    ]}]},
    desc: 'block with debugger and semi',
    tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: '{\n  debugger;\n}',
    ast: {type: 'Program', body: [{type: 'BlockStatement', body: [
      {type: 'DebuggerStatement'},
    ]}]},
    desc: 'block with debugger and semi with newlines',
    tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: '{debugger}',
    ast: {type: 'Program', body: [{type: 'BlockStatement', body: [
      {type: 'DebuggerStatement'},
    ]}]},
    desc: 'block with debugger and asi',
    tokens: [$PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
  },
];

//export default tests;
module.exports = tests;
