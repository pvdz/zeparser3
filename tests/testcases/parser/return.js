let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('return statement', _ => {
    test('return, no value, semi', {
      code: 'return;',
      ast: {
        type: 'Program',
        body: [{type: 'ReturnStatement', argument: null}],
      },
      tokens: [$IDENT, $PUNCTUATOR],
    });

    test('return, no value, eof', {
      code: 'return',
      ast: {
        type: 'Program',
        body: [{type: 'ReturnStatement', argument: null}],
      },
      tokens: [$IDENT, $ASI],
    });

    test('double return, no value, semi', {
      code: 'return;return;',
      ast: {
        type: 'Program',
        body: [{type: 'ReturnStatement', argument: null}, {type: 'ReturnStatement', argument: null}],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('double return, no value, eof', {
      code: 'return\nreturn',
      ast: {
        type: 'Program',
        body: [{type: 'ReturnStatement', argument: null}, {type: 'ReturnStatement', argument: null}],
      },
      tokens: [$IDENT, $ASI, $IDENT, $ASI],
    });

    test('return, no value, semi', {
      code: 'return foo;',
      ast: {
        type: 'Program',
        body: [{type: 'ReturnStatement', argument: {type: 'Identifier', name: 'foo'}}],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR],
    });

    test('return, no value, semi', {
      code: 'return 15;',
      ast: {
        type: 'Program',
        body: [{type: 'ReturnStatement', argument: {type: 'Literal', value: '<TODO>', raw: '15'}}],
      },
      tokens: [$IDENT, $NUMBER_DEC, $PUNCTUATOR],
    });

    test('return, asi check', {
      code: 'return \n foo;',
      ast: {
        type: 'Program',
        body: [{type: 'ReturnStatement', argument: null}, {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}],
      },
      tokens: [$IDENT, $ASI, $IDENT, $PUNCTUATOR],
    });

    test('return, asi check, wrapped in curly', {
      code: '{return \n foo}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'BlockStatement',
            body: [{type: 'ReturnStatement', argument: null}, {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}],
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $ASI, $IDENT, $ASI, $PUNCTUATOR],
    });

    test('return, confirm curly acts as asi', {
      code: '{return}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'BlockStatement',
            body: [{type: 'ReturnStatement', argument: null}],
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
    });
  });
