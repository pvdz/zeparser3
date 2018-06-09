let {$IDENT, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('if statement', _ => {
    test('simple if without else', {
      code: 'if (foo) bar;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'IfStatement',
            test: {type: 'Identifier', name: 'foo'},
            consequent: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
            alternate: null,
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('simple if without else', {
      code: 'if (foo) bar; else doo;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'IfStatement',
            test: {type: 'Identifier', name: 'foo'},
            consequent: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
            alternate: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'doo'}},
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR],
    });

    test('simple if without else', {
      code: 'if (foo) a; if (bar) b; else c;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'IfStatement',
            test: {type: 'Identifier', name: 'foo'},
            consequent: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'a'}},
            alternate: null,
          },
          {
            type: 'IfStatement',
            test: {type: 'Identifier', name: 'bar'},
            consequent: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'b'}},
            alternate: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'c'}},
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR],
    });
  });
