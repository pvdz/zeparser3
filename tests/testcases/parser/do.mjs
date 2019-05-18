import {$ASI, $IDENT, $PUNCTUATOR} from '../../../src/zetokenizer';

export default (describe, test) =>
  describe('dowhile statement', _ => {
    test('simple while', {
      code: 'do foo\nwhile (bar);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {type: 'Identifier', name: 'foo'},
            },
            test: {type: 'Identifier', name: 'bar'},
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $ASI, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('no asi error', {
      code: 'do foo; while (bar);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {type: 'Identifier', name: 'foo'},
            },
            test: {type: 'Identifier', name: 'bar'},
          },
        ],
      },
      desc: 'the problem is that ASI is only applied after newlines or before } or EOF and that this satisfies neither',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('asi error', {
      code: 'do foo while (bar);',
      throws: 'ASI',
      desc: 'the problem is that ASI is only applied after newlines or before } or EOF and that this satisfies neither',
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async asi edge case ident', {
      code: 'do async \n while (y)',
      desc: 'this is not an error. it is important that the `async` ident becomes a var name',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {type: 'Identifier', name: 'async'},
            },
            test: {type: 'Identifier', name: 'y'},
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $ASI, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('async asi edge case call', {
      code: 'do async \n () \n while (y)',
      desc:' such sad. not an error, just `async()` func call and legit',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'async'},
                arguments: [],
              },
            },
            test: {type: 'Identifier', name: 'y'},
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test.fail('async bad case', {
      code: 'do async \n f(){}; while (y)',
      desc:' should not attempt to parse the async function because the newline prevents it',
    });

    test.fail('async arrow bad case 1', {
      code: 'do async \n () => x; while(y)',
      desc: 'restricted production and after ASI the `while` keyword is expected',
    });

    test.fail('async arrow bad case 2', {
      code: 'do async () \n => x; while(y)',
      desc: 'restricted production and after ASI the `while` keyword is expected',
    });

    describe('asi problem case that almost all parsers seem to accept', _ => {

      // This case is (currently) accepted by all parsers except traceur.
      // And only for sub-statements that don't require ASI (like block, switch, try). It's almost as if that's
      // universally stopping ASI in its tracks..? Even v8 suffers from this at the time of writing.
      // I found it with a fuzzer.

      test.fail('block', {
        code: 'do {} while(x) x',
        desc: '<3 fuzzing; this case should fail because do-while absolutely requires a semi-colon',
      });

      test.fail('switch', {
        code: 'do switch(x){} while(x) x',
        desc: '<3 fuzzing',
      });

      test.fail('try catch', {
        code: 'do try {} catch {} while(x) x',
        desc: '<3 fuzzing',
      });

      test.fail('try catch finally', {
        code: 'do try {} catch {} while(x) x',
        desc: '<3 fuzzing',
      });

      test.fail('if', {
        code: 'do if (x) {} while(x) x',
        desc: '<3 fuzzing',
      });

      test.fail('debugger with semi', {
        code: 'do debugger; while(x) x',
        desc: '<3 fuzzing',
      });

      test.fail('debugger without semi', {
        code: 'do debugger while(x) x',
        desc: '<3 fuzzing',
      });
    });
  });

// TODO: <es6 there was no asi after do/while. es6+ does apply asi (to confirm that it really was es6...)
