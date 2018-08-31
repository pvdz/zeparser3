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

    test.fail_strict('wrapping in empty groups should not matter for the error', {
      code: 'delete (((foo)));',
    });

    test.pass('wrapping member in empty group should not matter for the error', {
      code: 'delete (foo.bar);',
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

    describe('single ident cases', _ => {

      test.fail_strict('wrapping in empty group should not matter for the error', {
        code: 'delete (foo);',
      });

      test.pass('wrapped property', {
        code: 'delete ((foo).x)',
      });

      test.pass('multi wrap property', {
        code: 'delete ((((foo))).x)',
      });

      test.pass('comma prop', {
        code: 'delete (a, b).c',
      });

      test.pass('wrapped arrow', {
        code: 'delete ((a)=>b)',
      });

      test.pass('wrapped non-trivial arrow', {
        code: 'delete ((a, b, [c])=>b)',
      });

      test.fail('dont allow rando binary stuff in arrow headers', {
        code: 'delete (a + b)=>b)',
      });

      test.fail('cant put parens inside the arrow head', {
        code: 'delete ((a))=>b)',
      });

      test.fail('dont allow rando prop stuff in arrow headers', {
        code: 'delete ([foo].bar)=>b)',
      });

      test.pass('wrapped arrow wrapped prop', {
        code: 'delete (((a)=>b).x)',
      });

      test.fail('bad arg less should also be checked', {
        code: 'delete ((()=b))',
      });

      test.pass('good arg less should also be checked', {
        code: 'delete ((()=>b))',
      });

      test.fail('arg less on top level', {
        code: 'delete ()=b',
      });

      test.pass('wrapped assign outer prop', {
        code: 'delete (((a)=b).x)',
      });

      test.fail('assignment to keyword', {
        code: 'delete ((true)=x)',
      });

      test.fail('assignment to multi wrapped keyword', {
        code: 'delete ((((true)))=x)',
      });

      test.pass('example of validity of this line of examples', {
        code: 'delete true.__proto__.foo',
      });

      test.pass('delete string prop', {
        code: 'delete "x".y',
      });

      test.pass('delete arr prop', {
        code: 'delete [].x',
      });

      test.pass('delete comma group', {
        code: 'delete ("foo", "bar")',
      });

      test.pass('delete grouped addition', {
        code: 'delete ("foo" + "bar")',
      });

      test.pass('grouped property assignment', {
        code: 'delete ("foo".bar = 20)',
      });

      test.pass('grouped group postfix', {
        code: 'delete ((foo)++)',
      });

      test.fail('grouped asi postfix', {
        code: '(foo \n ++)',
        desc: 'since ++ is a restricted production, asi must happen, but that is not allowed in the group',
        throws: 'ASI',
      });

      test.fail('delete grouped asi postfix', {
        code: 'delete ((foo) \n ++)',
        desc: 'the delete is a special case due to the special ident rule',
        throws: 'ASI',
      });

      test.fail('async() asi postfix', {
        code: '(async () \n ++)',
        desc: 'well the foo()++ case would already throw, anyways, so the test is not super important',
      });

      test.fail('postfix on keyword', {
        code: 'delete ((true)++)',
      });

      test.pass('did we even test a regular property', {
        code: 'delete foo.bar',
      });

      test.pass('did we test a computed property', {
        code: 'delete foo[bar]',
      });

      test.fail_strict('this is the simplest case, I think', {
        code: 'delete x',
      });

      test.fail_strict('asi check', {
        code: 'delete x\nfoo',
      });

      test.fail('div newline is not a regex', {
        code: 'delete x\n/f/',
      });

      test('forward slash newline should parse as a division', {
        code: 'delete x\n/f/g',
        desc: 'and make sure the ast reads as (delete x)/f/g',
        STRICT: {throws: true},
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
                    argument: {type: 'Identifier', name: 'x'},
                  },
                  operator: '/',
                  right: {type: 'Identifier', name: 'f'},
                },
                operator: '/',
                right: {type: 'Identifier', name: 'g'},
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test.fail_strict('grouped asi check', {
        code: 'delete x\nfoo',
      });

      test.fail('grouped div newline is not a regex', {
        code: 'delete (x)\n/f/',
      });

      test('grouped forward slash newline should parse as a division', {
        desc: 'and make sure the ast reads as (delete x)/f/g',
        code: 'delete (x)\n/f/g',
        STRICT: {throws: true},
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
                    expression: {type: 'Identifier', name: 'x'},
                  },
                  operator: '/',
                  right: {type: 'Identifier', name: 'f'},
                },
                operator: '/',
                right: {type: 'Identifier', name: 'g'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });
    });

    test('delete an arrow', {
      code: 'delete (foo)=>bar',
      throws: 'arrow',
    });

    test('delete a parenless arrow', {
      code: 'delete foo=>bar',
      throws: 'arrow',
    });

    test('delete a no-arg arrow', {
      code: 'delete ()=>bar',
      throws: 'arrow',
    });

    test('delete an async arrow', {
      code: 'delete async (x) => y',
      throws: 'arrow',
    });
  });
