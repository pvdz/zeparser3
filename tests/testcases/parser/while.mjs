import {$IDENT, $PUNCTUATOR} from '../../../src/zetokenizer.mjs';

export default (describe, test) =>
  describe('while statement', _ => {
    test('simple while', {
      code: 'while (foo) bar;',
      ast: {
        type: 'Program',
        body: [{type: 'WhileStatement', test: {type: 'Identifier', name: 'foo'}, body: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}}}],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test.pass('func expr can be followed by `=` sign as long as it is not an assignment', {
      code: 'while (function* () {} === x);',
      desc: 'regression, was just checking for the next char to be = instead of whole token',
    });

    test.fail('make sure compound assignments are caught', {
      code: 'while (function* () {} += x);',
    });
  });
