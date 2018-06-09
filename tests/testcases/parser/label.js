let {$IDENT, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('debugger statement', _ => {
    test('debugger with semi', {
      code: 'foo: bar;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'LabeledStatement',
            label: {type: 'Identifier', name: 'foo'},
            body: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    describe('regex edge cases', _ => {
      // foo:/bar/
      // foo:\n/bar/
      // foo:\n/bar/g
    });

    // TODO: label:functiondecl is explicitly considered a syntax error
    // TODO: labels must be "identifiers", which may not be reserved
    // await, yield, async, let, etc special keywords that once were valid labels (because sloppy mode)
  });
