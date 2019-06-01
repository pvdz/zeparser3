import {$ASI, $IDENT, $PUNCTUATOR} from '../../../src/zetokenizer.mjs';

export default (describe, test) =>
  describe('debugger statement', _ => {
    test('debugger with semi', {
      code: 'debugger;',
      ast: {
        type: 'Program',
        body: [{type: 'DebuggerStatement'}],
      },
      tokens: [$IDENT, $PUNCTUATOR],
    });

    test('debugger without semi at eof', {
      code: 'debugger',
      ast: {
        type: 'Program',
        body: [{type: 'DebuggerStatement'}],
      },
      tokens: [$IDENT, $ASI],
    });

    test('debugger with asi', {
      code: 'debugger\ndebugger;',
      ast: {
        type: 'Program',
        body: [{type: 'DebuggerStatement'}, {type: 'DebuggerStatement'}],
      },
      tokens: [$IDENT, $ASI, $IDENT, $PUNCTUATOR],
    });
  });
