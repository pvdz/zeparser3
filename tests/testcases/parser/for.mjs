/** @format */
import {$IDENT, $NUMBER_DEC, $PUNCTUATOR} from '../../../src/zetokenizer.mjs';
export default (describe, test) =>
  describe('for statement', _ => {
    describe('for-loop', _ => {
      test('empty for-classic', {
        code: 'for (;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: null,
              test: null,
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, only init, empty body', {
        code: 'for (a;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'Identifier',
                name: 'a',
              },
              test: null,
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, only test, empty body', {
        code: 'for (;b;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: null,
              test: {
                type: 'Identifier',
                name: 'b',
              },
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, only update, empty body', {
        code: 'for (;;c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: null,
              test: null,
              update: {
                type: 'Identifier',
                name: 'c',
              },
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, only init and test, empty body', {
        code: 'for (a;b;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'Identifier',
                name: 'a',
              },
              test: {
                type: 'Identifier',
                name: 'b',
              },
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, only init and update, empty body', {
        code: 'for (a;;c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'Identifier',
                name: 'a',
              },
              test: null,
              update: {
                type: 'Identifier',
                name: 'c',
              },
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, only test and update, empty body', {
        code: 'for (;b;c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: null,
              test: {
                type: 'Identifier',
                name: 'b',
              },
              update: {
                type: 'Identifier',
                name: 'c',
              },
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, init and test and update, empty body', {
        code: 'for (a;b;c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'Identifier',
                name: 'a',
              },
              test: {
                type: 'Identifier',
                name: 'b',
              },
              update: {
                type: 'Identifier',
                name: 'c',
              },
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, init and test and update, empty body', {
        code: 'for (a + b * c * d;b;c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a',
                },
                operator: '+',
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'b',
                    },
                    operator: '*',
                    right: {
                      type: 'Identifier',
                      name: 'c',
                    },
                  },
                  operator: '*',
                  right: {
                    type: 'Identifier',
                    name: 'd',
                  },
                },
              },
              test: {
                type: 'Identifier',
                name: 'b',
              },
              update: {
                type: 'Identifier',
                name: 'c',
              },
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, init and test and update, empty body', {
        code: 'for (a * b + c * d;b;c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a',
                  },
                  operator: '*',
                  right: {
                    type: 'Identifier',
                    name: 'b',
                  },
                },
                operator: '+',
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'c',
                  },
                  operator: '*',
                  right: {
                    type: 'Identifier',
                    name: 'd',
                  },
                },
              },
              test: {
                type: 'Identifier',
                name: 'b',
              },
              update: {
                type: 'Identifier',
                name: 'c',
              },
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, expression disambiguation test', {
        code: 'for ((a * b + c) * d;b;c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    operator: '*',
                    right: {
                      type: 'Identifier',
                      name: 'b',
                    },
                  },
                  operator: '+',
                  right: {
                    type: 'Identifier',
                    name: 'c',
                  },
                },
                operator: '*',
                right: {
                  type: 'Identifier',
                  name: 'd',
                },
              },
              test: {
                type: 'Identifier',
                name: 'b',
              },
              update: {
                type: 'Identifier',
                name: 'c',
              },
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.pass('you can have `in` inside the ternary', {
        code: 'for (true ? a in b : {}; false; ) ;',
      });
      describe('destructuring non-binding cases', _ => {
        test.pass('array that would be valid to destructure', {
          code: 'for ([x];;);',
        });
        test.pass('array that would be valid to assign-destructure', {
          code: 'for ([x.y];;);',
        });
        test.pass('array that would not be destructible', {
          code: 'for ([x + y];;);',
        });
        test.pass('array+init that would be valid to destructure', {
          code: 'for ([x] = z;;);',
        });
        test.pass('array+init that would be valid to assign-destructure', {
          code: 'for ([x.y] = z;;);',
        });
        test.fail('array+init that would not be destructible', {
          code: 'for ([x + y] = z;;);',
        });
        test.pass('object that would be valid to destructure', {
          code: 'for ({x};;);',
        });
        test.pass('object that would be valid to assign-destructure', {
          code: 'for ({x: a.b};;);',
        });
        test.pass('object that would not be destructible', {
          code: 'for ({a: x + y};;);',
        });
        test.pass('object+init that would be valid to destructure', {
          code: 'for ({x} = z;;);',
        });
        test.pass('object+init that would be valid to assign-destructure', {
          code: 'for ({a: x.y} = z;;);',
        });
        test.fail('object+init that would not be destructible', {
          code: 'for ({a: x + y} = z;;);',
        });
        test.pass('silly case with string property', {
          code: 'for ("foo".bar;;);',
        });
        test.pass('silly case with string property and assignment', {
          code: 'for ("foo".bar = x ;;);',
        });
        test.pass('silly good case with obj property', {
          code: 'for ({}.bar ;;);',
        });
        test.pass('silly bad case with obj property and assignment', {
          code: 'for ({}.bar = x ;;);',
        });
        test.pass('silly good case with arr property', {
          code: 'for ([].bar ;;);',
        });
        test.pass('silly bad case with arr property and assignment', {
          code: 'for ([].bar = x ;;);',
        });
      });
      describe('lhs assign expr edge cases', _ => {
        test.pass('parenless arrow lhs', {
          code: 'for (x=>{};;);',
        });
        test.pass('arrow lhs', {
          code: 'for ((x)=>{};;);',
        });
        test.pass('grouped arrow lhs', {
          code: 'for (((x)=>{}) ;;);',
        });
        test.pass('grouped arrow.prop lhs', {
          code: 'for (((x)=>{}).x ;;);',
        });
        test.fail_strict('yield var lhs', {
          code: 'for (yield;;);',
        });
        test.pass('yield keyword lhs', {
          code: 'function *f(){ for (yield;;); }',
        });
        test.fail('arrow expr with `in` should fail', {
          code: 'for (x=>x in y;;);',
          desc: 'because the parser should be greedy (otoh the arrow can only be valid in regular loop so theres no ambiguity once the arrow is seen...)',
          /*
        https://tc39.github.io/ecma262/#sec-statements
        Note: +In means "is allowed", ~In means "not allowed", without prefix means "same as input"
        IterationStatement[Yield, Await, Return]:
        for([lookahead ≠ let []Expression[~In, ?Yield, ?Await]opt ; ; ) ;
        Expression[In, Yield, Await]:
        AssignmentExpression[?In, ?Yield, ?Await]
        AssignmentExpression[In, Yield, Await]:
        ArrowFunction[?In, ?Yield, ?Await]
        ArrowFunction[In, Yield, Await]:
        ArrowParameters[?Yield, ?Await][no LineTerminator here]=>ConciseBody[?In]
        ConciseBody[In]:
        [lookahead ≠ {]AssignmentExpression[?In, ~Yield, ~Await]
        {FunctionBody[~Yield, ~Await]}
        So a block-arrow doesn't care but an expression arrow propagates the `in` flag and disallows it in the
        expression, just like a regular lhs would. So it's not allowed.
        */
        });
        test.pass('arrow body with `in` should pass', {
          code: 'for (x=>{x in y};;);',
          desc: 'counter test to previous one',
        });
        test.pass('yield no-arg lhs', {
          code: 'function *f(){   for (yield;;);   }',
        });
        test.pass('yield arg lhs', {
          code: 'function *f(){   for (yield x;;);   }',
        });
        test.fail('yield arg with `in` lhs', {
          code: 'function *f(){   for (yield x in y;;);   }',
        });
        test.pass('ternary in lhs', {
          code: 'for (a ? b : c;;);',
        });
        test.pass('assignment in lhs', {
          code: 'for (a = b;;);',
        });
        test.pass('compound assignment in lhs', {
          code: 'for (a += b;;);',
        });
        test.fail('init part cannot be a pattern 1', {
          code: 'for ({x = y} ;;) {}',
          desc: '{x=y} cannot be expression because shorthand props cannot have an assignment/default',
        });
        test.fail('init part cannot be a pattern 2', {
          code: 'for ({x = y} ;1 ;) {}',
          desc: '{x=y} cannot be expression because shorthand props cannot have an assignment/default',
        });
        test.fail('init part cannot be a pattern 3', {
          code: 'for ({x = y} ;1 ;1) {}',
          desc: '{x=y} cannot be expression because shorthand props cannot have an assignment/default',
        });
      });
      test('postfix update in for-header', {
        code: 'for (x--;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'x',
                },
                operator: '--',
                prefix: false,
              },
              test: null,
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('postfix on yield in for-header', {
        code: 'for (yield[g]--;;);',
        STRICT: {
          throws: true,
        },
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'UpdateExpression',
                argument: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'yield',
                  },
                  property: {
                    type: 'Identifier',
                    name: 'g',
                  },
                  computed: true,
                },
                operator: '--',
                prefix: false,
              },
              test: null,
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for header lhs can contain ident instanceof', {
        code: 'for (a instanceof b;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a',
                },
                operator: 'instanceof',
                right: {
                  type: 'Identifier',
                  name: 'b',
                },
              },
              test: null,
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.fail('for must have child statement', {
        code: 'for (eval instanceof this; new 2e308;)',
      });
      test.pass('for header lhs can contain number instanceof', {
        code: 'for (12 instanceof obj;;);',
      });
      test.pass('for header lhs can contain arr instanceof', {
        code: 'for ([] instanceof obj;;);',
      });
      describe('binary ops in lhs', _ => {
        test('for header !==', {
          code: 'for ([] !== x;;);',
          desc: 'regression',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ForStatement',
                init: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'ArrayExpression',
                    elements: [],
                  },
                  operator: '!==',
                  right: {
                    type: 'Identifier',
                    name: 'x',
                  },
                },
                test: null,
                update: null,
                body: {
                  type: 'EmptyStatement',
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test.pass('init part can be any expression', {
          code: 'for (a + b;;);',
        });
        test.pass('init part starting with array can be any expression', {
          code: 'for ([] + b;;);',
        });
        test.pass('init part starting with object can be any expression', {
          code: 'for ({} + b;;);',
        });
        test.pass('init part starting with number can be any expression', {
          code: 'for (2 + b;;);',
        });
        test.pass('init part starting with string can be any expression', {
          code: 'for ("abc" + b;;);',
        });
        test.pass('init part starting with regex can be any expression', {
          code: 'for (/x/g + b;;);',
        });
      });
      describe('double proto', _ => {
        test('double proto of lhs obj no web compat', {
          code: 'for ({__proto__: 1, __proto__: 2};;);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ForStatement',
                init: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: '__proto__',
                      },
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'Literal',
                        value: '<TODO>',
                        raw: '1',
                      },
                      shorthand: false,
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: '__proto__',
                      },
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'Literal',
                        value: '<TODO>',
                        raw: '2',
                      },
                      shorthand: false,
                    },
                  ],
                },
                test: null,
                update: null,
                body: {
                  type: 'EmptyStatement',
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test.fail('double proto of lhs obj in web compat', {
          code: 'for ({__proto__: 1, __proto__: 2};;);',
          WEB: true,
        });
        test.pass('double proto of lhs arr no web compat', {
          code: 'for ([{__proto__: 1, __proto__: 2}];;);',
        });
        test.fail('double proto of lhs arr in web compat', {
          code: 'for ([{__proto__: 1, __proto__: 2}];;);',
          WEB: true,
        });
      });
    });
    describe('var decls', _ => {
      test('for-classic, one var, empty body', {
        code: 'for (var a;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    init: null,
                  },
                ],
              },
              test: null,
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, three vars, empty body', {
        code: 'for (var a,b,c;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    init: null,
                  },
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'b',
                    },
                    init: null,
                  },
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'c',
                    },
                    init: null,
                  },
                ],
              },
              test: null,
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, one let, empty body', {
        code: 'for (let a;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'let',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    init: null,
                  },
                ],
              },
              test: null,
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, three lets, empty body', {
        code: 'for (let a,b,c;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'let',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    init: null,
                  },
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'b',
                    },
                    init: null,
                  },
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'c',
                    },
                    init: null,
                  },
                ],
              },
              test: null,
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, only init, empty body', {
        code: 'for (const a;;);',
        throws: 'init',
      });
      test('for-classic, three consts, empty body', {
        code: 'for (const a,b,c;;);',
        throws: 'init',
      });
      describe('rest', _ => {
        test('rest arr', {
          code: 'for (const [...x] in y){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ForInStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'Identifier',
                              name: 'x',
                            },
                          },
                        ],
                      },
                      init: null,
                    },
                  ],
                },
                right: {
                  type: 'Identifier',
                  name: 'y',
                },
                body: {
                  type: 'BlockStatement',
                  body: [],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('var and rest arr', {
          code: 'for (const [...x] in y){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ForInStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'Identifier',
                              name: 'x',
                            },
                          },
                        ],
                      },
                      init: null,
                    },
                  ],
                },
                right: {
                  type: 'Identifier',
                  name: 'y',
                },
                body: {
                  type: 'BlockStatement',
                  body: [],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('rest obj', {
          code: 'for (const {...x} in y){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ForInStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'Identifier',
                              name: 'x',
                            },
                          },
                        ],
                      },
                      init: null,
                    },
                  ],
                },
                right: {
                  type: 'Identifier',
                  name: 'y',
                },
                body: {
                  type: 'BlockStatement',
                  body: [],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('ummmm no', {
          code: 'for (const ...x in y){}',
          throws: true, // TODO
        });
        test('absolutely no', {
          code: 'for (...x in y){}',
          throws: true, // TODO
        });
      });
    });
    describe('vars with initializers', _ => {
      test('for-classic, one var with init, empty body', {
        code: 'for (var a=1;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    init: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '1',
                    },
                  },
                ],
              },
              test: null,
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, two vars only first has init, empty body', {
        code: 'for (var a=1, b;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    init: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '1',
                    },
                  },
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'b',
                    },
                    init: null,
                  },
                ],
              },
              test: null,
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, two vars only second has init, empty body', {
        code: 'for (var a, b=1;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    init: null,
                  },
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'b',
                    },
                    init: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '1',
                    },
                  },
                ],
              },
              test: null,
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('for-classic, two vars both have init, empty body', {
        code: 'for (var a=1, b=2;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    init: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '1',
                    },
                  },
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'b',
                    },
                    init: {
                      type: 'Literal',
                      value: '<TODO>',
                      raw: '2',
                    },
                  },
                ],
              },
              test: null,
              update: null,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });
    describe('for-in', _ => {
      test('empty for-in', {
        code: 'for (a in b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {
                type: 'Identifier',
                name: 'a',
              },
              right: {
                type: 'Identifier',
                name: 'b',
              },
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('empty for-in', {
        code: 'for (var a in b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    init: null,
                  },
                ],
              },
              right: {
                type: 'Identifier',
                name: 'b',
              },
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('empty for-in', {
        code: 'for (let a in b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {
                type: 'VariableDeclaration',
                kind: 'let',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    init: null,
                  },
                ],
              },
              right: {
                type: 'Identifier',
                name: 'b',
              },
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('empty for-in', {
        code: 'for (const a in b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    init: null,
                  },
                ],
              },
              right: {
                type: 'Identifier',
                name: 'b',
              },
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('assign as rhs', {
        code: 'for (a in b=c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {
                type: 'Identifier',
                name: 'a',
              },
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'b',
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'c',
                },
              },
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      }); // TODO: cases for yield and await as rhs

      describe('web compat', _ => {
        // https://tc39.github.io/ecma262/#sec-iteration-statements
        //   for ( var ForBinding[?Yield, ?Await] in Expression[+In, ?Yield, ?Await] )
        //     Statement[?Yield, ?Await, ?Return]
        // https://tc39.github.io/ecma262/#sec-initializers-in-forin-statement-heads
        // The following augments the IterationStatement;
        //   IterationStatement[Yield, Await, Return]:
        //     for ( var BindingIdentifier[?Yield, ?Await] Initializer[~In, ?Yield, ?Await] in Expression[+In, ?Yield, ?Await] )
        //       Statement[?Yield, ?Await, ?Return]
        // (note that Expression also has comma-expression, there is no "Expressions" production)
        test('var with init left of `in`', {
          code: 'for (var a = b in c);',
          throws: 'can not have an init',
          WEB: {
            // this is an annexB web compat thing and only valid in sloppy mode
            desc: 'https://tc39.github.io/ecma262/#sec-initializers-in-forin-statement-heads',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ForInStatement',
                  left: {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'Identifier',
                          name: 'a',
                        },
                        init: {
                          type: 'Identifier',
                          name: 'b',
                        },
                      },
                    ],
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c',
                  },
                  body: {
                    type: 'EmptyStatement',
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('incremental in var init left of `in`', {
          code: 'for (var a = ++b in c);',
          throws: 'can not have an init',
          WEB: {
            // this is an annexB web compat thing
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ForInStatement',
                  left: {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'Identifier',
                          name: 'a',
                        },
                        init: {
                          type: 'UpdateExpression',
                          operator: '++',
                          prefix: true,
                          argument: {
                            type: 'Identifier',
                            name: 'b',
                          },
                        },
                      },
                    ],
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c',
                  },
                  body: {
                    type: 'EmptyStatement',
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('var with init left and assignment right of `in`', {
          code: 'for (var a = 0 in stored = a, {});',
          throws: 'can not have an init',
          WEB: {
            // this is an annexB web compat thing
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ForInStatement',
                  left: {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'Identifier',
                          name: 'a',
                        },
                        init: {
                          type: 'Literal',
                          value: '<TODO>',
                          raw: '0',
                        },
                      },
                    ],
                  },
                  right: {
                    type: 'SequenceExpression',
                    expressions: [
                      {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'stored',
                        },
                        operator: '=',
                        right: {
                          type: 'Identifier',
                          name: 'a',
                        },
                      },
                      {
                        type: 'ObjectExpression',
                        properties: [],
                      },
                    ],
                  },
                  body: {
                    type: 'EmptyStatement',
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('grouped init left of `in`', {
          code: 'for (var a = (++effects, -1) in x);',
          throws: 'can not have an init',
          WEB: {
            // this is an annexB web compat thing
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ForInStatement',
                  left: {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'Identifier',
                          name: 'a',
                        },
                        init: {
                          type: 'SequenceExpression',
                          expressions: [
                            {
                              type: 'UpdateExpression',
                              operator: '++',
                              prefix: true,
                              argument: {
                                type: 'Identifier',
                                name: 'effects',
                              },
                            },
                            {
                              type: 'UnaryExpression',
                              operator: '-',
                              prefix: true,
                              argument: {
                                type: 'Literal',
                                value: '<TODO>',
                                raw: '1',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  body: {
                    type: 'EmptyStatement',
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('comma expression right of `in`', {
          code: 'for (var a in stored = a, {a: 0, b: 1, c: 2});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ForInStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {
                        type: 'Identifier',
                        name: 'a',
                      },
                      init: null,
                    },
                  ],
                },
                right: {
                  type: 'SequenceExpression',
                  expressions: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'stored',
                      },
                      operator: '=',
                      right: {
                        type: 'Identifier',
                        name: 'a',
                      },
                    },
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'a',
                          },
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {
                            type: 'Literal',
                            value: '<TODO>',
                            raw: '0',
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'b',
                          },
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {
                            type: 'Literal',
                            value: '<TODO>',
                            raw: '1',
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'c',
                          },
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {
                            type: 'Literal',
                            value: '<TODO>',
                            raw: '2',
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
                body: {
                  type: 'EmptyStatement',
                },
              },
            ],
          },
          desc: '(not legacy but sanity check in this set. the rhs of `for-in` is a regular Expression node which have a comma)',
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });
        test('combination of last two tests', {
          code: 'for (var a = (++effects, -1) in stored = a, {a: 0, b: 1, c: 2});',
          throws: 'can not have an init',
          WEB: {
            // this is an annexB web compat thing
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ForInStatement',
                  left: {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'Identifier',
                          name: 'a',
                        },
                        init: {
                          type: 'SequenceExpression',
                          expressions: [
                            {
                              type: 'UpdateExpression',
                              operator: '++',
                              prefix: true,
                              argument: {
                                type: 'Identifier',
                                name: 'effects',
                              },
                            },
                            {
                              type: 'UnaryExpression',
                              operator: '-',
                              prefix: true,
                              argument: {
                                type: 'Literal',
                                value: '<TODO>',
                                raw: '1',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                  right: {
                    type: 'SequenceExpression',
                    expressions: [
                      {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'stored',
                        },
                        operator: '=',
                        right: {
                          type: 'Identifier',
                          name: 'a',
                        },
                      },
                      {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'a',
                            },
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {
                              type: 'Literal',
                              value: '<TODO>',
                              raw: '0',
                            },
                            shorthand: false,
                          },
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'b',
                            },
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {
                              type: 'Literal',
                              value: '<TODO>',
                              raw: '1',
                            },
                            shorthand: false,
                          },
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'c',
                            },
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {
                              type: 'Literal',
                              value: '<TODO>',
                              raw: '2',
                            },
                            shorthand: false,
                          },
                        ],
                      },
                    ],
                  },
                  body: {
                    type: 'EmptyStatement',
                  },
                },
              ],
            },
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });
        test('destructuring with init is always illegal', {
          code: 'for (var [a] = 0 in {});',
          throws: 'can not have an init',
          WEB: {
            throws: 'can not have an init',
            desc: 'this is important; it should also throw in web-compat mode',
          },
          tokens: [],
        });
        test('destructuring with const is always illegal', {
          code: 'for (const x = 0 in {});',
          throws: true,
        });
        test('destructuring with const is always illegal', {
          code: 'for (let x = 0 in {});',
          throws: true,
        });
      });
      test.fail('ternary in for-loop', {
        code: 'for (true ? 0 : 0 in {}; false; ) ;',
      });
      test('let edge case', {
        code: 'for (let in x) y',
        STRICT: {
          throws: 'strict mode',
        },
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {
                type: 'Identifier',
                name: 'in',
              },
              right: {
                type: 'Identifier',
                name: 'x',
              },
              body: {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: 'y',
                },
              },
            },
          ],
        },
        tokens: true,
      });
      test('arr destructuring without binding', {
        code: 'for ([a.b] in c) d',
        desc: '[a.b] is destructible so should be fine as lhs of any for loop. note: the lhs must be a Pattern with `in` or `of`!',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    property: {
                      type: 'Identifier',
                      name: 'b',
                    },
                    computed: false,
                  },
                ],
              },
              right: {
                type: 'Identifier',
                name: 'c',
              },
              body: {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: 'd',
                },
              },
            },
          ],
        },
        tokens: true,
      });
      test('no arr destructuring with property', {
        code: 'for ([a.b].foo in c) d',
        desc: 'the lhs must not contain a Pattern',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'a',
                      },
                      property: {
                        type: 'Identifier',
                        name: 'b',
                      },
                      computed: false,
                    },
                  ],
                },
                property: {
                  type: 'Identifier',
                  name: 'foo',
                },
                computed: false,
              },
              right: {
                type: 'Identifier',
                name: 'c',
              },
              body: {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: 'd',
                },
              },
            },
          ],
        },
        tokens: true,
      });
      test('obj destructuring without binding', {
        code: 'for ({a: b.c} in d) e',
        desc: '{a: b.c} is destructible so should be fine as lhs of any for loop. note: the lhs must be a Pattern with `in` or `of`!',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'b',
                      },
                      property: {
                        type: 'Identifier',
                        name: 'c',
                      },
                      computed: false,
                    },
                    shorthand: false,
                  },
                ],
              },
              right: {
                type: 'Identifier',
                name: 'd',
              },
              body: {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: 'e',
                },
              },
            },
          ],
        },
        tokens: true,
      });
      test('no destructuring with property', {
        code: 'for ({a: b.c}.foo in d) e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a',
                      },
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'b',
                        },
                        property: {
                          type: 'Identifier',
                          name: 'c',
                        },
                        computed: false,
                      },
                      shorthand: false,
                    },
                  ],
                },
                property: {
                  type: 'Identifier',
                  name: 'foo',
                },
                computed: false,
              },
              right: {
                type: 'Identifier',
                name: 'd',
              },
              body: {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: 'e',
                },
              },
            },
          ],
        },
        tokens: true,
      });
      test.fail('lhs cannot be an assignment', {
        // https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements-static-semantics-early-errors
        // It is a Syntax Error if AssignmentTargetType of LeftHandSideExpression is not simple.
        code: 'for (x = y in z) ;',
      });
      test.fail('lhs cannot be a paren wrapped assignment', {
        // https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements-static-semantics-early-errors
        code: 'for ((x = y) in z) ;',
      });
      describe('destructuring edge cases', _ => {
        // https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements-static-semantics-early-errors
        // "It is a Syntax Error if LeftHandSideExpression is either an ObjectLiteral or an ArrayLiteral and
        // if LeftHandSideExpression is not covering an AssignmentPattern."
        test.pass('array that would be valid to destructure', {
          code: 'for ([x] in obj);',
        });
        test.pass('array that would be valid to assign-destructure', {
          code: 'for ([x.y] in obj);',
        });
        test.fail('array that would not be destructible', {
          code: 'for ([x + y] in obj);',
        });
        test.fail('array+init are invalid to destructure in for-in lhs', {
          code: 'for ([x] = z in obj);',
        });
        test.fail('array+init are invalid to assign-destructure in for-in lhs', {
          code: 'for ([x.y] = z in obj);',
        });
        test.fail('array+init that would not be destructible', {
          code: 'for ([x + y] = z in obj);',
        });
        test.pass('object that would be valid to destructure', {
          code: 'for ({x} in obj);',
        });
        test.pass('object that would be valid to assign-destructure', {
          code: 'for ({x: a.b} in obj);',
        });
        test.fail('object that would not be destructible', {
          code: 'for ({a: x + y} in obj);',
        });
        test.fail('object+init are invalid to for-in lhs', {
          code: 'for ({x} = z in obj);',
        });
        test.fail('object+init are invalid to assign-destructure to for-in lhs', {
          code: 'for ({a: x.y} = z in obj);',
        });
        test.fail('object+init that would not be destructible', {
          code: 'for ({a: x + y} = z in obj);',
        });
        test.fail('let bound names cannot contain let', {
          code: 'for (let [let] in obj);',
        });
        test.fail('const bound names cannot contain let', {
          code: 'for (const [let] in obj);',
        });
        test.pass('silly good case with string property', {
          code: 'for ("foo".bar in obj);',
        });
        test.fail('silly bad case with string property and assignment', {
          code: 'for ("foo".bar = x in obj);',
        });
        test.pass('silly good case with obj property', {
          code: 'for ({}.bar in obj);',
        });
        test.fail('silly bad case with obj property and assignment', {
          code: 'for ({}.bar = x in obj);',
        });
        test.pass('silly good case with arr property', {
          code: 'for ([].bar in obj);',
        });
        test.fail('silly bad case with arr property and assignment', {
          code: 'for ([].bar = x in obj);',
        });
      }); // In web compat assignments are allowed in the lhs of a `for-in` with `var` decl (but that's it)
      // https://tc39.github.io/ecma262/#sec-initializers-in-forin-statement-heads

      [true, false].forEach(WEB =>
        describe('webcompat=' + WEB, _ => {
          describe('regressions #8', _ => {
            // As reported by https://github.com/pvdz/zeparser3/issues/8
            test.fail('lhs rest with trailing comma', {
              code: 'for ([...x,] in [[]]);',
              WEB,
            });
            test.fail('lhs empty arr with number init', {
              code: 'for ([] = 0 in {});',
              WEB,
            });
            test.fail('lhs arr with rest with number init', {
              code: 'for ([...[a]] = 0 in {});',
              WEB,
            });
            test.fail('lhs obj with init', {
              code: 'for ({x} = 0 in {});',
              WEB,
            });
            test.fail('lhs obj with prop init', {
              code: 'for ({p: x = 0} = 0 in {});',
              WEB,
            });
            test.fail('for await with arr destruct lhs', {
              code: 'async function f() { for await ([x] in y) {} }',
              WEB,
            });
            test.fail('for await with obj destruct lhs', {
              code: 'async function f() { for await ({x} in y) {} }',
              WEB,
            });
            test.fail('for await with valid strange lhs', {
              code: 'async function f() { for await ("foo".x in y) {} }',
              WEB,
            });
            test.fail('for await with valid grouped lhs', {
              code: 'async function f() { for await ((x) in y) {} }',
              WEB,
            });
            test.fail('for await with var', {
              code: 'async function f() { for await (var x in y) {} }',
              WEB,
            });
            test.fail('for await with let', {
              code: 'async function f() { for await (let x in y) {} }',
              WEB,
            });
            test.fail('for await with const', {
              code: 'async function f() { for await (const x in y) {} }',
              WEB,
            });
            test.fail('lhs assignment', {
              code: 'for (x = 0 in {});',
              WEB,
            });
            test.fail('lhs dynamic property assignment', {
              code: 'for(o[0] = 0 in {});',
              WEB,
            });
            test.fail('lhs paren wrapped unary increment', {
              code: 'for ((a++) in c);',
              WEB,
            });
            test.fail('lhs plus-prefixed expr', {
              code: 'for (+a().b in c);',
              WEB,
            });
            test.fail('lhs is void', {
              code: 'for (void a.b in c);',
              WEB,
            });
            test.fail('lhs is regex', {
              code: 'for (/foo/ in {});',
              WEB,
            });
            test.pass('sneaky lhs contains `in`', {
              code: 'for ((a in b).x in {});',
              WEB,
            });
          });
        }),
      );
      describe('lhs edge cases', _ => {
        test.fail('parenless arrow lhs', {
          code: 'for (x=>{} in y);',
        });
        test.fail('parenless arrow crap lhs', {
          code: 'for (x=>{}.x in y);',
        });
        test.fail('arrow lhs', {
          code: 'for ((x)=>{} in y);',
        });
        test.fail('grouped arrow lhs', {
          code: 'for (((x)=>{}) in y);',
        });
        test.pass('grouped arrow.prop lhs', {
          code: 'for (((x)=>{}).x in y);',
        });
        test.fail('arrow crap lhs', {
          code: 'for ((x)=>{}.x in y);',
        });
        test.fail_strict('yield no-arg lhs', {
          code: 'for (yield in x);',
        });
        test.fail('yield no-arg lhs', {
          code: 'function *f(){   for (yield in y);   }',
        });
        test.fail('yield arg lhs', {
          code: 'function *f(){   for (yield x in y);   }',
        });
        test.fail('yield arg with `in` lhs', {
          code: 'function *f(){   for (yield x in y in z);   }',
        });
        test.fail('ternary in lhs', {
          code: 'for (a ? b : c in x);',
        });
        test.fail('assignment in lhs', {
          code: 'for (a = b in x);',
        });
        test.fail('compound assignment in lhs', {
          code: 'for (a += b in x);',
        }); // what about `for ([x]=y in z);`, is that an exception? would it break if we can assignment exprs in lhs?
      });
      describe('let as a var', _ => {
        // for-in allows certain lhs that starts with `let`. In strict mode all bets are off.
        test.fail_strict('let is allowed as the lhs to for-in', {
          code: 'for (let in x);',
        });
        test.fail_strict('a property on let is allowed in for-in', {
          code: 'for (let.foo in x);',
        });
        test.fail('a call on let is not allowed in for-in', {
          code: 'for (let() in x);',
        });
        test.fail_strict('a property on a call on let is allowed in for-in', {
          code: 'for (let().foo in x);',
        });
        test.fail('let with an array that cannot be a pattern is not allowed in for-in', {
          code: 'for (let[a+b] in x);',
        });
        test.fail('let with an object and property cannot work because it is always parsed as a pattern', {
          code: 'for (let {x}.y in x);',
        });
      });
      describe('binary ops in lhs', _ => {
        test.fail('init part can be any expression', {
          code: 'for (a + b in obj);',
        });
        test.fail('init part starting with array can be any expression', {
          code: 'for ([] + b in obj);',
        });
        test.fail('init part starting with object can be any expression', {
          code: 'for ({} + b in obj);',
        });
        test.fail('init part starting with number can be any expression', {
          code: 'for (2 + b in obj);',
        });
        test.fail('init part starting with string can be any expression', {
          code: 'for ("abc" + b in obj);',
        });
        test.fail('init part starting with regex can be any expression', {
          code: 'for (/x/g + b in obj);',
        });
      });
    });
    describe('for-of', _ => {
      test('empty for-of', {
        code: 'for (a of b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {
                type: 'Identifier',
                name: 'a',
              },
              right: {
                type: 'Identifier',
                name: 'b',
              },
              await: false,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('empty for-of', {
        code: 'for (var a of b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    init: null,
                  },
                ],
              },
              right: {
                type: 'Identifier',
                name: 'b',
              },
              await: false,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('empty for-of', {
        code: 'for (let a of b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {
                type: 'VariableDeclaration',
                kind: 'let',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    init: null,
                  },
                ],
              },
              right: {
                type: 'Identifier',
                name: 'b',
              },
              await: false,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('empty for-of', {
        code: 'for (const a of b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    init: null,
                  },
                ],
              },
              right: {
                type: 'Identifier',
                name: 'b',
              },
              await: false,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('assign as rhs', {
        code: 'for (a of b=c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {
                type: 'Identifier',
                name: 'a',
              },
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'b',
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'c',
                },
              },
              await: false,
              body: {
                type: 'EmptyStatement',
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.fail('let edge case does not work in for-of', {
        code: 'for (let of x) y',
      });
      test('destructuring without binding', {
        code: 'for ([a.b] of c) d',
        desc: '[a.b] is destructible so should be fine as lhs of any for loop. note: the lhs must be a Pattern with `in` or `of`!',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    property: {
                      type: 'Identifier',
                      name: 'b',
                    },
                    computed: false,
                  },
                ],
              },
              right: {
                type: 'Identifier',
                name: 'c',
              },
              await: false,
              body: {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: 'd',
                },
              },
            },
          ],
        },
        tokens: true,
      });
      test('destructuring with property', {
        code: 'for ([a.b].foo of c) d',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'a',
                      },
                      property: {
                        type: 'Identifier',
                        name: 'b',
                      },
                      computed: false,
                    },
                  ],
                },
                property: {
                  type: 'Identifier',
                  name: 'foo',
                },
                computed: false,
              },
              right: {
                type: 'Identifier',
                name: 'c',
              },
              await: false,
              body: {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: 'd',
                },
              },
            },
          ],
        },
        tokens: true,
      });
      test.pass('destructuring with dynamic property', {
        code: 'for ([a.b][foo] of c) d',
      });
      test.fail('destructuring with call', {
        code: 'for ([a.b](foo) of c) d',
      });
      test.fail('destructuring with tag', {
        code: 'for ([a.b]`foo` of c) d',
      });
      test.fail('destructuring with update', {
        code: 'for ([a.b]++ of c) d',
      });
      test('obj destructuring without binding', {
        code: 'for ({a: b.c} of d) e',
        desc: '{a: b.c} is destructible so should be fine as lhs of any for loop. note: the lhs must be a Pattern with `in` or `of`!',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'b',
                      },
                      property: {
                        type: 'Identifier',
                        name: 'c',
                      },
                      computed: false,
                    },
                    shorthand: false,
                  },
                ],
              },
              right: {
                type: 'Identifier',
                name: 'd',
              },
              await: false,
              body: {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: 'e',
                },
              },
            },
          ],
        },
        tokens: true,
      });
      test('destructuring with property', {
        code: 'for ({a: b.c}.foo of d) e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a',
                      },
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'b',
                        },
                        property: {
                          type: 'Identifier',
                          name: 'c',
                        },
                        computed: false,
                      },
                      shorthand: false,
                    },
                  ],
                },
                property: {
                  type: 'Identifier',
                  name: 'foo',
                },
                computed: false,
              },
              right: {
                type: 'Identifier',
                name: 'd',
              },
              await: false,
              body: {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: 'e',
                },
              },
            },
          ],
        },
        tokens: true,
      });
      test.pass('destructuring with dynamic property', {
        code: 'for ({a: b.c}[x] of d) e',
      });
      test.fail('destructuring with call', {
        code: 'for ({a: b.c}() of d) e',
      });
      test.fail('destructuring that gets tagged', {
        code: 'for ({a: b.c}`z` of d) e',
      });
      test.fail('destructuring that gets update', {
        code: 'for ({a: b.c}-- of d) e',
      });
      test.fail('rhs must be AssignmentExpression', {
        code: 'for (let x of a,b) c',
      });
      describe('regressions #8', _ => {
        // As reported by https://github.com/pvdz/zeparser3/issues/8
        test.fail('lhs rest with trailing comma', {
          code: 'for ([...x,] of [[]]);',
        });
        test.fail('lhs empty arr with number init', {
          code: 'for ([] = 0 of {});',
        });
        test.fail('lhs arr with rest with number init', {
          code: 'for ([...[a]] = 0 of {});',
        });
        test.fail('lhs obj with init', {
          code: 'for ({x} = 0 of {});',
        });
        test.fail('lhs obj with prop init', {
          code: 'for ({p: x = 0} = 0 of {});',
        });
        test.fail('lhs assignment', {
          code: 'for (x = 0 of {});',
        });
        test.fail('lhs dynamic property assignment', {
          code: 'for(o[0] = 0 of {});',
        });
        test.fail('lhs paren wrapped unary increment', {
          code: 'for ((a++) of c);',
        });
        test.fail('lhs plus-prefixed expr', {
          code: 'for (+a().b of c);',
        });
        test.fail('lhs is void', {
          code: 'for (void a.b of c);',
        });
        test.fail('lhs is regex', {
          code: 'for (/foo/ of {});',
        });
        test.pass('sneaky lhs contains `in`', {
          code: 'for ((a in b).x of {});',
        });
      });
      describe('lhs edge cases', _ => {
        test.fail('parenless arrow lhs', {
          code: 'for (x=>{} of y);',
        });
        test.fail('parenless arrow crap lhs', {
          code: 'for (x=>{}.x of y);',
        });
        test.fail('arrow lhs', {
          code: 'for ((x)=>{} of y);',
        });
        test.fail('grouped arrow lhs', {
          code: 'for (((x)=>{}) of y);',
        });
        test.pass('grouped arrow.prop lhs', {
          code: 'for (((x)=>{}).x of y);',
        });
        test.fail('arrow crap lhs', {
          code: 'for ((x)=>{}.x of y);',
        });
        test.fail_strict('yield no-arg lhs', {
          code: 'for (yield of x);',
        });
        test.fail('yield keyword lhs', {
          code: 'function *f(){ for (yield of obj); }',
        });
        test.fail('yield no-arg lhs', {
          code: 'function *f(){   for (yield of y);   }',
        });
        test.fail('yield arg lhs', {
          code: 'function *f(){   for (yield x of y);   }',
        });
        test.fail('yield arg with `in` lhs', {
          code: 'function *f(){   for (yield x in y of z);   }',
        });
        test.fail('ternary in lhs', {
          code: 'for (a ? b : c of x);',
        });
        test.fail('ternary in lhs', {
          code: 'for (a ? b : c of x);',
        });
        test.fail('assignment in lhs', {
          code: 'for (a = b of x);',
        });
        test.fail('compound assignment in lhs', {
          code: 'for (a += b of x);',
        }); // what about `for ([x]=y of z);`, is that an exception? would it break if we can assignment exprs in lhs?
      });
      describe('let as a var', _ => {
        // for-of forbids any lhs that starts with `let`
        test.fail('let is not allowed as the lhs to for-of', {
          code: 'for (let of x);',
        });
        test.fail('a property on let is not allowed in for-of', {
          code: 'for (let.foo of x);',
        });
        test.fail('a call on let is not allowed in for-of', {
          code: 'for (let() of x);',
        });
        test.fail('a property on a call on let is not allowed in for-of', {
          code: 'for (let().foo of x);',
        });
        test.fail('let with an array that cannot be a pattern is not allowed in for-of', {
          code: 'for (let[a+b] of x);',
          desc: 'fails in strict because let is a keyword there, fails in sloppy because the array cant be a pattern',
        });
        test.fail('let with an object and property cannot work because it is always parsed as a pattern', {
          code: 'for (let {x}.y of x);',
        });
      });
      describe('binary ops in lhs', _ => {
        test.fail('init part can be any expression', {
          code: 'for (a + b of obj);',
        });
        test.fail('init part starting with array can be any expression', {
          code: 'for ([] + b of obj);',
        });
        test.fail('init part starting with object can be any expression', {
          code: 'for ({} + b of obj);',
        });
        test.fail('init part starting with number can be any expression', {
          code: 'for (2 + b of obj);',
        });
        test.fail('init part starting with string can be any expression', {
          code: 'for ("abc" + b of obj);',
        });
        test.fail('init part starting with regex can be any expression', {
          code: 'for (/x/g + b of obj);',
        });
      }); // TODO: cases for yield and await as rhs
    });
    test.pass('allow assignment', {
      code: 'for (foo=10;;);',
    });
    test.pass('allow let assignment', {
      code: 'for (let=10;;);',
      STRICT: {
        throws: 'let',
      },
    });
    test.fail('should not over accept an `of` after an `in` 1', {
      code: 'for (x in y of) ;',
    });
    test.fail('should not over accept an `of` after an `in` 2', {
      code: 'for (x in y of z) ;',
    });
    describe('for-await', _ => {
      test('for await of inside async func', {
        code: 'async function f(){ for await (x of y) {} }',

        callback(ast, tokens, astJson) {
          return astJson.includes('"await":true');
        },

        ast: {
          type: 'Program',
          body: [
            {
              type: 'FunctionDeclaration',
              generator: false,
              async: true,
              id: {
                type: 'Identifier',
                name: 'f',
              },
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ForOfStatement',
                    left: {
                      type: 'Identifier',
                      name: 'x',
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y',
                    },
                    await: true,
                    body: {
                      type: 'BlockStatement',
                      body: [],
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test.pass('for await of inside async arrow', {
        code: 'async () => { for await (x of y) {} }',
      });
      test.fail('for await cant appear outside of async', {
        code: 'for await (x of y) {}',
      });
      test.fail('for await in non-async func', {
        code: 'function f() { for await (x of y) {} }',
      });
      test.fail('for await in generator func', {
        code: 'function *f() { for await (x of y) {} }',
      });
      test.fail('for await in a non-async func nested in an async function', {
        code: 'async function f() { function g(){ { for await (x of y) {} } }',
      });
      test.fail('for await does not support `in` (not async)', {
        code: 'for await (x in y) {}',
      });
      test('for await does not support `in` (in async)', {
        code: 'async function f(){ for await (x in y) {} }',
        throws: 'for await',
      });
      test.fail('for await does not support regular loop (no async)', {
        code: 'for await (x;y;z) {}',
      });
      test('for await does not support regular loop (in async)', {
        code: 'async function f(){ for await (x;y;z) {} }',
        throws: 'for await',
      });
      test.fail('for await empty loop (not async)', {
        code: 'for await (;;) {}',
      });
      test('for await empty loop (in async)', {
        code: 'async function f(){ for await (;;) {} }',
        throws: 'for await',
      });
      test.pass('for await with arr destruct lhs', {
        code: 'async function f() { for await ([x] of y) {} }',
      });
      test.pass('for await with obj destruct lhs', {
        code: 'async function f() { for await ({x} of y) {} }',
      });
      test.pass('for await with valid strange lhs', {
        code: 'async function f() { for await ("foo".x of y) {} }',
      });
      test.pass('for await with var', {
        code: 'async function f() { for await (var x of y) {} }',
      });
      test.pass('for await with let', {
        code: 'async function f() { for await (let x of y) {} }',
      });
      test.pass('for await with const', {
        code: 'async function f() { for await (const x of y) {} }',
      });
      test.pass('for await with valid grouped lhs', {
        code: 'async function f() { for await ((x) of y) {} }',
      });
      test.fail('for await in non-async func', {
        code: 'function f() { for await (x of y) {} }',
      });
      test.fail('for await in non-async func', {
        code: 'function f() { for await (x of y) {} }',
      });
      test.fail('for await in non-async func', {
        code: 'function f() { for await (x of y) {} }',
      });
      describe('regressions as reported in #10', _ => {
        // These all fail because they have an assignment left of the `of` or `in` keyword
        test.fail('1', {
          code: 'async function f() { for await ([a] = 1 of []); }',
        });
        test.fail('2', {
          code: 'async function f() { for await ([a = 1] = 1 of []); }',
        });
        test.fail('3', {
          code: "async function f() { 'use strict'; for await ({a} = 1 of []); }",
        });
        test.fail('4', {
          code: 'async function * f() { for await ({a: a} = 1 of []); }',
        });
        test.fail('5', {
          code: 'async function * f() { for await ({0: a} = 1 of []); }',
        });
        test.fail('6', {
          code: 'async function * f() { for await ({0: a = 1} = 1 of []); }',
        });
      });
      describe('regressions (fixed) as reported in #10', _ => {
        test.pass('1', {
          code: 'async function f() { for await ([a] of []); }',
        });
        test.pass('2', {
          code: 'async function f() { for await ([a = 1] of []); }',
        });
        test.pass('3', {
          code: "async function f() { 'use strict'; for await ({a} of []); }",
        });
        test.pass('4', {
          code: 'async function * f() { for await ({a: a} of []); }',
        });
        test.pass('5', {
          code: 'async function * f() { for await ({0: a} of []); }',
        });
        test.pass('6', {
          code: 'async function * f() { for await ({0: a = 1} of []); }',
        });
      });
    });
  }); // lhs can not use paren trick to avoid non-assignability (https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements-static-semantics-early-errors)
// can not use `for (let[foo] as bar);` to refer to `let` as a varname. Similarly I don't think `for (let[foo].bar` is allowed (although it doesn't get the same explicit exception as statements).
