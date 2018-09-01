let {$ASI, $ERROR, $IDENT, $NUMBER_DEC, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('other, unclassified cases', _ => {
    test('bad whitespace should not be ignored', {
      desc: 'from test262 7.4_A2_T2',
      code: `/*CHECK#1/`,
      throws: 'Tokenizer error',
      tokens: [$ERROR],
    });

    test.pass('reading from eval', {
      code: 'eval; log(eval); eval.foo; eval[foo]; eval.foo = bar; eval[foo] = bar;',
    });

    test.pass('reading from arguments', {
      code: 'arguments; log(arguments); arguments.foo; arguments[foo]; arguments.foo = bar; arguments[foo] = bar;',
    });
  });
