import {$ASI, $ERROR, $IDENT, $NUMBER_DEC, $PUNCTUATOR} from '../../../src/zetokenizer';

export default (describe, test) =>
  describe('other, unclassified cases', _ => {
    test('bad whitespace should not be ignored', {
      desc: 'from test262 7.4_A2_T2',
      code: `/*CHECK#1/`,
      throws: 'Tokenizer soft error',
      tokens: [$ERROR],
    });

    test.pass('reading from eval', {
      code: 'eval',
    });

    test.pass('reading from eval', {
      code: 'log(eval)',
    });

    test.pass('reading from eval', {
      code: 'eval.foo',
    });

    test.pass('reading from eval', {
      code: 'eval[foo]',
    });

    test.pass('reading from eval', {
      code: 'eval.foo = bar',
    });

    test.pass('reading from eval', {
      code: 'eval[foo] = bar',
    });

    test.pass('reading from arguments', {
      code: 'arguments; log(arguments); arguments.foo; arguments[foo]; arguments.foo = bar; arguments[foo] = bar;',
    });

    test.pass('asi with CR', {
      code: 'a\rb',
    });

    test.pass('asi with LF', {
      code: 'a\nb',
    });
  });
