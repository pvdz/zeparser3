//import ZeTokenizer, {
let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests = [
  'debugger statement',
  {
    code: 'debugger;',
    ast: {type: 'Program', body: [
      {type: 'DebuggerStatement'},
    ]},
    desc: 'debugger with semi',
    tokens: [$IDENT, $PUNCTUATOR],
  },
  {
    code: 'debugger',
    ast: {type: 'Program', body: [
      {type: 'DebuggerStatement'},
    ]},
    desc: 'debugger without semi at eof',
    tokens: [$IDENT, $ASI],
  },
  {
    code: 'debugger\ndebugger;',
    ast: {type: 'Program', body: [
      {type: 'DebuggerStatement'},
      {type: 'DebuggerStatement'},
    ]},
    desc: 'debugger with asi',
    tokens: [$IDENT, $ASI, $IDENT, $PUNCTUATOR],
  },
];

//export default tests;
module.exports = tests;
