let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $TICK_HEAD, $TICK_TAIL} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('delete', _ => {
    test('base case', {
      code: 'delete x.y',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              prefix: true,
              argument: {
                type: 'MemberExpression',
                object: {type: 'Identifier', name: 'x'},
                property: {type: 'Identifier', name: 'y'},
                computed: false,
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    describe('regex edge case', _ => {
      test('sans flag', {
        code: 'delete a.b\n/foo/',
        throws: 'Expected to parse a value',
        desc: 'note: asi explicitly does not apply when next line starts with forward slash',
        tokens: [],
      });

      test('with flag', {
        code: 'delete a.b\n/foo/g',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'UnaryExpression',
                    operator: 'delete',
                    prefix: true,
                    argument: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'a'},
                      property: {type: 'Identifier', name: 'b'},
                      computed: false,
                    },
                  },
                  operator: '/',
                  right: {type: 'Identifier', name: 'foo'},
                },
                operator: '/',
                right: {type: 'Identifier', name: 'g'},
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });
    });

    test.fail_strict('cannot just be ident in strict mode', {
      code: 'delete foo',
    });

    test.pass('can be something stupid (those are runtime errors)', {
      code: 'delete foo()',
    });

    test.fail_strict('can be a keyword in sloppy mode', {
      code: 'delete true',
    });

    test.pass('can be another unary', {
      code: 'delete typeof true',
    });

    test.fail_strict('wrapping in empty group should not matter for the error', {
      code: 'delete (foo);',
    });

    test.fail_strict('wrapping in empty groups should not matter for the error', {
      code: 'delete (((foo)));',
    });

    test.fail('should not be able to parse an arrow as arg because thats assignment', {
      code: 'delete (foo) => x;',
      desc: 'delete only accepts unary and arrow is an assignment expression so this fails',
    });

    test.fail('fails other arrow too', {
      code: 'delete foo => x;',
    });

    test.pass('should work as sequence expression statement', {
      code: 'delete foo.bar, z;',
    });

    test.pass('regex without flag', {
      code: 'delete /foo/.bar;',
    });

    test.pass('regex with flag', {
      code: 'delete /foo/g.bar;',
    });
  });
