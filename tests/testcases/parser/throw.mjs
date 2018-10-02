import {$ASI, $IDENT, $PUNCTUATOR} from '../../../src/zetokenizer';

export default (describe, test) =>
  describe('throw statement', _ => {
    test('throw, semi', {
      code: 'throw foo;',
      ast: {
        type: 'Program',
        body: [{type: 'ThrowStatement', argument: {type: 'Identifier', name: 'foo'}}],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR],
    });

    test('throw, eof', {
      code: 'throw foo',
      ast: {
        type: 'Program',
        body: [{type: 'ThrowStatement', argument: {type: 'Identifier', name: 'foo'}}],
      },
      tokens: [$IDENT, $IDENT, $ASI],
    });

    // `throw \n foo` should throw an error since the throw rhs is mandatory
  });
