import {$ASI, $IDENT, $PUNCTUATOR} from '../../../src/zetokenizer';

// await, (yield), delete, and new have their own file

export default (describe, test) =>

  describe('unary ops', _ => {

    describe('positive prefix +x', _ => {
      // See also the generic unary tests

      test('base', {
        code: '+a',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: '+',
                prefix: true,
                argument: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $ASI],
      });
    });

    describe('negative prefix -x', _ => {
      // See also the generic unary tests

      test('base', {
        code: '-a',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: '-',
                prefix: true,
                argument: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $ASI],
      });
    });

    describe('bitwise invert ~x', _ => {
      // See also the generic unary tests

      test('base', {
        code: '~a',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: '~',
                prefix: true,
                argument: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $ASI],
      });
    });

    describe('logical invert !x', _ => {
      // See also the generic unary tests

      test('base', {
        code: '!a',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: '!',
                prefix: true,
                argument: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $ASI],
      });
    });

    describe('typeof', _ => {
      // See also the generic unary tests

      test('base', {
        code: 'typeof x',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: 'typeof',
                prefix: true,
                argument: {type: 'Identifier', name: 'x'},
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $ASI],
      });
    });

    describe('delete', _ => {
      // Note: delete has its own file with specific edge cases!
      // See also the generic unary tests

      test('base', {
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
    });

    describe('void', _ => {
      // See also the generic unary tests

      test('base', {
        code: 'void x',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: 'void',
                prefix: true,
                argument: {type: 'Identifier', name: 'x'},
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $ASI],
      });
    });

    describe('generic unary tests (GENERATED)', _ => {

      [
        '+',
        '-',
        'typeof',
        'delete',
        'void',
        '!',
        // 'await',  // this requires async func wrapper to work so we're skipping this. perhaps we can duplicate, later
      ].map(opstr => {

        describe('batch for `'+opstr+'`', _ => {

          describe('disambiguation', _ => {

            test('disambiguation left', {
              code: opstr + ' x.abc + y.x',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'UnaryExpression',
                        operator: opstr,
                        prefix: true,
                        argument: {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'x'},
                          property: {type: 'Identifier', name: 'abc'},
                          computed: false,
                        },
                      },
                      operator: '+',
                      right: {
                        type: 'MemberExpression',
                        object: {type: 'Identifier', name: 'y'},
                        property: {type: 'Identifier', name: 'x'},
                        computed: false,
                      },
                    },
                  },
                ],
              },
              desc: 'the unary should only apply to x, not the whole addition: (+ (typeof x) y)',
              tokens: true,
            });

            test('disambiguation right', {
              code: 'x + '+opstr+' y.x',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'BinaryExpression',
                      left: {type: 'Identifier', name: 'x'},
                      operator: '+',
                      right: {
                        type: 'UnaryExpression',
                        operator: opstr,
                        prefix: true,
                        argument: {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'y'},
                          property: {type: 'Identifier', name: 'x'},
                          computed: false,
                        },
                      },
                    },
                  },
                ],
              },
              desc: 'the unary should only apply to y, not the whole addition',
              tokens: true,
            });

            test('disambiguation both', {
              code: opstr+' x.def + '+opstr+' y.x',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'UnaryExpression',
                        operator: opstr,
                        prefix: true,
                        argument: {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'x'},
                          property: {type: 'Identifier', name: 'def'},
                          computed: false,
                        },
                      },
                      operator: '+',
                      right: {
                        type: 'UnaryExpression',
                        operator: opstr,
                        prefix: true,
                        argument: {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'y'},
                          property: {type: 'Identifier', name: 'x'},
                          computed: false,
                        },
                      },
                    },
                  },
                ],
              },
              desc: 'the unary should only apply to one var, not the whole addition',
              tokens: true,
            });
          });

          describe('regex edge case', _ => {
            test('division', {
              code: opstr+' a.b\n/foo',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'UnaryExpression',
                        operator: opstr,
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
                  },
                ],
              },
              desc: 'note that the typeof only applies to `a.b` not the whole division',
              tokens: true,
            });

            test('sans flag', {
              code: opstr+'  a.b\n/foo/',
              throws: 'Expected to parse a value',
              desc: 'note: asi explicitly does not apply when next line starts with forward slash',
            });

            test('with flag', {
              code: opstr+' a.b\n/foo/g',
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
                          operator: opstr,
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
              tokens: true,
            });
          });

          describe('async args', _ => {

            test.pass('async keyword sans parens', {
              code: opstr === 'delete' ? opstr + ' async.x' : (opstr + ' async'), // delete cannot do just ident
            });

            test('async parens', {
              code: opstr + ' async ()',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'UnaryExpression',
                      operator: opstr,
                      prefix: true,
                      argument: {
                        type: 'CallExpression',
                        callee: {type: 'Identifier', name: 'async'},
                        arguments: [],
                      },
                    },
                  },
                ],
              },
              tokens: true,
            });

            test('async newline parens', {
              code: opstr + ' async \n ()',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'UnaryExpression',
                      operator: opstr,
                      prefix: true,
                      argument: {
                        type: 'CallExpression',
                        callee: {type: 'Identifier', name: 'async'},
                        arguments: [],
                      },
                    },
                  },
                ],
              },
              tokens: true,
            });

            test('async arrow', {
              code: opstr + ' async () => x',
              throws: 'arrow',
            });

            test('async newline arrow', {
              code: opstr + ' async \n () => x',
              throws: 'async',
            });

            test('async arrow newline', {
              code: opstr + ' async () \n => x',
              throws: 'arrow',
            });

            test('async func', {
              code: opstr + ' async function(){}',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'UnaryExpression',
                      operator: opstr,
                      prefix: true,
                      argument: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: true,
                        id: null,
                        params: [],
                        body: {type: 'BlockStatement', body: []},
                      },
                    },
                  },
                ],
              },
              tokens: true,
            });

            test('asi check async newline paren', {
              code: 'let x = ' + opstr + ' async \n (x)',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'x'},
                        init: {
                          type: 'UnaryExpression',
                          operator: opstr,
                          prefix: true,
                          argument: {
                            type: 'CallExpression',
                            callee: {type: 'Identifier', name: 'async'},
                            arguments: [{type: 'Identifier', name: 'x'}],
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              tokens: true,
            });

            test.fail('asi check async newline arrow', {
              code: 'let x = ' + opstr + ' async \n (x) => x',
            });

            test('asi check async paren newline arrow', {
              code: 'let x = ' + opstr + ' async (x) \n => x',
              throws: 'arrow',
            });

            test.fail('asi check async arrow no newline', {
              code: 'let x = ' + opstr + ' async (x) => x',
              desc: 'arrow is assignment expression which is not valid as unary arg',
            });

            test.fail('asi check async boxed newline arrow', {
              code: 'let x = [' + opstr + ' async \n (x) => x]',
            });

            test.fail('asi check async boxed paren newline arrow', {
              code: 'let x = [' + opstr + ' async (x) \n => x]',
            });
          });

          describe('as new arg', _ => {

            test.fail('with ident', {
              code: 'new ' + opstr,
            });

            test.fail('with arg', {
              code: 'new ' + opstr + ' x.x',
            });

            test.fail('with called arg', {
              code: 'new ' + opstr + ' x()',
            });
          });

          describe('reported in #14', _ => {
            // for the sake of completeness (the actual problem is about using a pattern with a func call)

            test.pass('counter-example where the object is not (necessarily) a pattern', {
              code: opstr+' async({a});',
            });

            test.fail('1', {
              code: opstr+' async({a = 1});',
            });

            test.fail('2', {
              code: opstr+' async({a = 1}, {b = 2}, {c = 3} = {});',
            });

            test.fail('3', {
              code: opstr+' async({a = 1}, {b = 2} = {}, {c = 3} = {});',
            });
          });

          describe('return state propagation', fromString => {

            test.pass('await as arg inside async base case', {
              code :'async function f(){   ' + opstr + ' await x;   }',
            });

            test.fail('await as arg in non-async func default', {
              code :'async function f(){   function g(x = ' + opstr + ' await x) {}  }',
            });

            test.fail('await as arg in non-async func arg default with strict mode', {
              code :'async function f(){   function g(x = ' + opstr + ' await x) { "use strict"; }  }',
              desc: 'notorious case; this test ensures the "parsed await" flags properly propagate back down',
            });

            test.fail(`function object alias destructured non-async arg 1`, {
              code: 'async function f(){   function fh({x: ' + opstr + ' await x}) {}   }',
            });

            test.fail(`function object alias destructured non-async arg 2`, {
              code: 'async function f(){   function fh({x: ' + opstr + ' await x}) { "use strict"; }   }',
            });

            test.fail(`function array destructured non-async arg 1`, {
              code: 'async function f(){   function fh([' + opstr + ' await x]) { }   }',
            });

            test.fail(`function array destructured non-async arg 2`, {
              code: 'async function f(){   function fh([' + opstr + ' await x]) { "use strict"; }   }',
            });

            test.fail('await as arg in async func default is always illegal', {
              code :'async function f(){   async function g(x = ' + opstr + ' await x) {}  }',
            });

            test.fail('await as arg in async func arg default with strict mode is always illegal', {
              code :'async function f(){   async function g(x = ' + opstr + ' await x) { "use strict"; }  }',
              desc: 'notorious case; this test ensures the "parsed await" flags properly propagate back down',
            });

            test.fail(`async function object alias destructured arg 1 is always illegal`, {
              code: 'async function f(){   async function fh({x: ' + opstr + ' await x}) {}   }',
            });

            test.fail(`async function object alias destructured arg 2 is always illegal`, {
              code: 'async function f(){   async function fh({x: ' + opstr + ' await x}) { "use strict"; }   }',
            });

            test.fail(`async function array destructured arg 1 is always illegal`, {
              code: 'async function f(){   async function fh([' + opstr + ' await x]) { }   }',
            });

            test.fail(`async function array destructured arg 2 is always illegal`, {
              code: 'async function f(){   async function fh([' + opstr + ' await x]) { "use strict"; }   }',
            });
          });
        });
      });
    });
  });

// TODO: disambiguation tests of all the unaries (some have their own test file)
// typeof x++  (the typeof wraps the update)
// tests for asi and ++/-- for anything where LF_CAN_POSTFIX_ASI appears and async arrow functions because they're weird
// check whether postfix asi (++/--) can be blocked by something else than objlit/arrlit/arrow/group
