let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $TICK_HEAD, $TICK_PURE, $TICK_TAIL, $STRING_DOUBLE} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('strict mode', _ => {
    /*
    https://tc39.github.io/ecma262/#sec-strict-mode-code

    Global code is strict mode code if it starts with use strict
    Module code is always strict mode code.
    All parts of a ClassDeclaration or a ClassExpression are strict mode code.
    Eval code is strict mode code if
      - it begins with use strict
      - the call to eval is a direct eval that is contained in strict mode code.
    Function code is strict mode code if
      - it's contained in strict mode code
      - it starts with use strict
    Dynamic functions (like Function) with a body that starts with use strict
  */

    // base case: with is not allowed in strict mode

    test('base test; confirm `with` is fine without strict mode', {
      code: '; with (x) y;',
      desc: 'The idea is that strict mode should throw for using `with` but fine in sloppy mode',
      ast: true,
      tokens: true,
      STRICT: {throws: 'strict'},
    });

    test('global directive / module code', {
      code: '"use strict"; with (x) y;',
      throws: 'strict',
    });

    test('inside a class', {
      code: 'class X { foo() { with (x) y; } }',
      throws: 'strict',
    });

    describe('with directive', _ => {
      describe('in global', _ => {
        test('double quoted', {
          code: '"use strict"; with (x) y;',
          throws: 'strict',
        });

        test('single quoted', {
          code: "'use strict'; with (x) y;",
          throws: 'strict',
        });

        test('templates dont count', {
          code: '`use strict`; with (x) y;',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      tail: true,
                      value: {raw: '`use strict`', cooked: '<TODO>'},
                    },
                  ],
                },
              },
              {
                type: 'WithStatement',
                object: {type: 'Identifier', name: 'x'},
                body: {
                  type: 'ExpressionStatement',
                  expression: {type: 'Identifier', name: 'y'},
                },
              },
            ],
          },
          tokens: [$TICK_PURE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          STRICT: {throws: 'strict'},
        });

        test('newline after semi', {
          code: '"use strict";\nwith (x) y;',
          throws: 'strict',
        });

        test('newline before semi', {
          code: '"use strict"\n;with (x) y;',
          throws: 'strict',
        });

        test('asi', {
          code: '"use strict"\nwith (x) y;',
          throws: 'strict',
        });

        test('double', {
          code: '"use strict"; "use strict"; with (x) y;',
          throws: 'strict',
        });

        test('mixed double', {
          code: '"use strict"; \'use strict\'; with (x) y;',
          throws: 'strict',
        });

        test('crap first', {
          code: '"not a directive"; "use strict"; with (x) y;',
          throws: 'strict',
        });

        test('newlined first', {
          code: '"haha\\\nstill\\\nfine"; "use strict"; with (x) y;',
          throws: 'strict',
        });

        test('not first', {
          code: 'const x; "use strict"; with (x) y;',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });

        test('comments are fine', {
          code: '// one comment\n/* two \n comment */ "use strict"; with (x) y;',
          throws: 'strict',
        });
      });

      describe('in function', _ => {
        test('double quoted', {
          code: 'function f(){ "use strict"; with (x) y; }',
          throws: 'strict',
        });

        test('single quoted', {
          code: "function f(){ 'use strict'; with (x) y; }",
          throws: 'strict',
        });

        test('templates dont count', {
          code: 'function f(){ `use strict`; with (x) y; }',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });

        test('newline after semi', {
          code: 'function f(){ "use strict";\nwith (x) y; }',
          throws: 'strict',
        });

        test('newline before semi', {
          code: 'function f(){ "use strict"\n;with (x) y; }',
          throws: 'strict',
        });

        test('asi', {
          code: 'function f(){ "use strict"\nwith (x) y; }',
          throws: 'strict',
        });
      });

      describe('in arrow', _ => {
        test('double quoted', {
          code: '() => { "use strict"; with (x) y; }',
          throws: 'strict',
        });

        test('single quoted', {
          code: "() => { 'use strict'; with (x) y; }",
          throws: 'strict',
        });

        test('templates dont count', {
          code: '() => { `use strict`; with (x) y; }',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });

        test('newline after semi', {
          code: '() => { "use strict";\nwith (x) y; }',
          throws: 'strict',
        });

        test('newline before semi', {
          code: '() => { "use strict"\n;with (x) y; }',
          throws: 'strict',
        });

        test('asi', {
          code: '() => { "use strict"\nwith (x) y; }',
          throws: 'strict',
        });
      });

      describe('mixed cases', _ => {
        test('ignored when not first', {
          code: 'const x; "use strict"; with (x) y;',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });

        test('other contexts inherit it', {
          code: '"use strict"; function f(){ with (x) y; }',
          throws: 'strict',
        });

        test('function does not taint global scope', {
          code: 'function f(){ "use strict"; foo; } with (x) y;',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });

        test('sibling does not taint global scope', {
          code: 'function f(){ "use strict"; foo; } function g() { with (x) y; }',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });

        test('parent taints child', {
          code: 'function f(){ "use strict"; foo; function g() { with (x) y; } } ',
          throws: 'strict',
        });

        test('sibling does not taint parent', {
          code: 'function g() { function f(){ "use strict"; foo; } with (x) y; }',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });

        test('NOT block scoped', {
          code: 'if (x) { "use strict"; with (x) y; }',
          ast: true,
          tokens: true,
          STRICT: {throws: 'strict'},
        });
      });
    });

    describe('requires simple args', _ => {

      describe('sans args', _ => {
        test('func decl', {
          code: 'function f(){"use strict";}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'use strict'}],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('func expr', {
          code: '+function f(){"use strict";}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: '+',
                  prefix: true,
                  argument: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [{type: 'Directive', directive: 'use strict'}],
                    },
                  },
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('property value', {
          code: '({x:function(){"use strict";}})',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'x'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [{type: 'Directive', directive: 'use strict'}],
                        },
                      },
                      shorthand: false,
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('one arg', _ => {
        test('func decl', {
          code: 'function f(x){"use strict";}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: {type: 'Identifier', name: 'f'},
                params: [{type: 'Identifier', name: 'x'}],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'use strict'}],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('func expr', {
          code: '+function f(x){"use strict";}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: '+',
                  prefix: true,
                  argument: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [{type: 'Identifier', name: 'x'}],
                    body: {
                      type: 'BlockStatement',
                      body: [{type: 'Directive', directive: 'use strict'}],
                    },
                  },
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('property value', {
          code: '({x:function(x){"use strict";}})',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'x'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [{type: 'Identifier', name: 'x'}],
                        body: {
                          type: 'BlockStatement',
                          body: [{type: 'Directive', directive: 'use strict'}],
                        },
                      },
                      shorthand: false,
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('two args', _ => {
        test('func decl', {
          code: 'function f(x, y){"use strict";}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: {type: 'Identifier', name: 'f'},
                params: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'use strict'}],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('func expr', {
          code: '+function f(x, y){"use strict";}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: '+',
                  prefix: true,
                  argument: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                    body: {
                      type: 'BlockStatement',
                      body: [{type: 'Directive', directive: 'use strict'}],
                    },
                  },
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('property value', {
          code: '({x:function(x, y){"use strict";}})',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'x'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                        body: {
                          type: 'BlockStatement',
                          body: [{type: 'Directive', directive: 'use strict'}],
                        },
                      },
                      shorthand: false,
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('init', _ => {
        test('func decl', {
          code: 'function f(x=y){"use strict";}',
          throws: 'simple',
        });

        test('func expr', {
          code: '+function f(x=y){"use strict";}',
          throws: 'simple',
        });

        test('property value', {
          code: '({x:function(x=y){"use strict";}})',
          throws: 'simple',
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('first arg with init should not reset', _ => {
        test('func decl', {
          code: 'function f(x=y, a){"use strict";}',
          throws: 'simple',
        });

        test('func expr', {
          code: '+function f(x=y, a){"use strict";}',
          throws: 'simple',
        });

        test('property value', {
          code: '({x:function(x=y, a){"use strict";}})',
          throws: 'simple',
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('second arg with init', _ => {
        test('func decl', {
          code: 'function f(a, x=y){"use strict";}',
          throws: 'simple',
        });

        test('func expr', {
          code: '+function f(a, x=y){"use strict";}',
          throws: 'simple',
        });

        test('property value', {
          code: '({x:function(a, x=y){"use strict";}})',
          throws: 'simple',
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('destruct', _ => {
        test('func decl', {
          code: 'function f([x]){"use strict";}',
          throws: 'simple',
        });

        test('func expr', {
          code: '+function f([x]){"use strict";}',
          throws: 'simple',
        });

        test('property value', {
          code: '({x:function([x]){"use strict";}})',
          throws: 'simple',
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('second arg that is destruct', _ => {
        test('func decl', {
          code: 'function f(a, [x]){"use strict";}',
          throws: 'simple',
        });

        test('func expr', {
          code: '+function f(a, [x]){"use strict";}',
          throws: 'simple',
        });

        test('property value', {
          code: '({x:function(a, [x]){"use strict";}})',
          throws: 'simple',
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });

      describe('first arg that is destruct should not reset', _ => {
        test('func decl', {
          code: 'function f([x], a){"use strict";}',
          throws: 'simple',
        });

        test('func expr', {
          code: '+function f([x], a){"use strict";}',
          throws: 'simple',
        });

        test('property value', {
          code: '({x:function([x], a){"use strict";}})',
          throws: 'simple',
        });

        // TODO: arrow, async, generatrs, obj methods, class methods
      });
    });


    describe('eval', _ => {
      test('cannot assign to eval', {
        code: 'eval = x',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'eval'},
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
        },
      });

      test('cannot postinc eval', {
        code: 'eval++',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'eval'},
                  operator: '++',
                  prefix: false,
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $ASI],
        },
      });

      test('cannot pre-dec eval', {
        code: '--eval',
        throws: 'Cannot inc/dec a non-assignable value',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'eval'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $ASI],
        },
      });

      test('cannot compound assign to eval', {
        code: 'eval += x',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'eval'},
                  operator: '+=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
        },
      });

      // TODO: will have to circle back for these later. they require a large architectural change.
      // test('cannot destruct assign to eval', {
      //   code: '([eval]) = [x]',
      //   desc: 'vs `([eval]) => [x]`',
      //   throws: 'eval',
      //   SLOPPY_SCRIPT: {
      //     ast: { type: 'Program',
      //       body:
      //         [ { type: 'ExpressionStatement',
      //           expression:
      //             { type: 'AssignmentExpression',
      //               left:
      //                 { type: 'ArrayPattern',
      //                   elements: [ { type: 'Identifier', name: 'eval' } ] },
      //               operator: '=',
      //               right:
      //                 { type: 'ArrayExpression',
      //                   elements: [ { type: 'Identifier', name: 'x' } ] } } } ] },
      //     tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      //   },
      // });
      //
      // test('groups are just one way to destruct', {
      //   code: 'x, [eval] = [x]',
      //   desc: 'vs `x, [eval].foo`; make sure we dont assume destructuring without var/let/const happens with a group; that is just a way to disambiguate',
      //   throws: 'eval',
      //   SLOPPY_SCRIPT: {
      //     ast: { type: 'Program',
      //       body:
      //         [ { type: 'ExpressionStatement',
      //           expression:
      //             { type: 'AssignmentExpression',
      //               left:
      //                 { type: 'ArrayPattern',
      //                   elements: [ { type: 'Identifier', name: 'eval' } ] },
      //               operator: '=',
      //               right:
      //                 { type: 'ArrayExpression',
      //                   elements: [ { type: 'Identifier', name: 'x' } ] } } } ] },
      //     tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      //   },
      // });

      test('cannot import an eval', {
        code: 'import eval from "x";',
        throws: 'eval',
        SLOPPY_SCRIPT: {throws: 'module goal'},
      });

      test('cannot import an eval sans source', {
        code: 'import eval;',
        throws: 'eval',
        SLOPPY_SCRIPT: {throws: 'module goal'},
      });

      test('cannot import a destructed eval', {
        code: 'import {eval} from "x";',
        throws: 'eval',
        SLOPPY_SCRIPT: {throws: 'module goal'},
      });

      test('cannot import an alias eval', {
        code: 'import {foo as eval} from "x";',
        throws: 'eval',
        SLOPPY_SCRIPT: {throws: 'module goal'},
      });

      test('cannot export an eval', {
        code: 'export var eval = x;',
        throws: 'eval',
        SLOPPY_SCRIPT: {throws: 'module goal'},
      });

      test('cannot default export an eval', {
        code: 'export default var eval = x;',
        desc: 'default exports do not allow var bindings (var/let/const) so just make sure this throws and move on',
        throws: true,
      });

      test('cannot use eval as catch var', {
        code: 'try {} catch (eval) {}',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'TryStatement',
                block: {type: 'BlockStatement', body: []},
                handler: {
                  type: 'CatchClause',
                  param: {type: 'Identifier', name: 'eval'},
                  body: {type: 'BlockStatement', body: []},
                },
                finalizer: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      });

      test('cannot use eval as func name', {
        code: 'function eval() {}',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: {type: 'Identifier', name: 'eval'},
                params: [],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      });

      test('cannot use eval as async func name', {
        code: 'async function eval() {}',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: true,
                expression: false,
                id: {type: 'Identifier', name: 'eval'},
                params: [],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      });

      test('cannot use eval as generator func name', {
        code: 'function* eval() {}',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: true,
                async: false,
                expression: false,
                id: {type: 'Identifier', name: 'eval'},
                params: [],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      });

      test('cannot use eval as arg name', {
        code: 'function f(eval) {}',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: {type: 'Identifier', name: 'f'},
                params: [{type: 'Identifier', name: 'eval'}],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      });

      test('cannot use eval as func name', {
        code: 'var eval = x;',
        throws: 'eval',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {type: 'Identifier', name: 'eval'},
                    init: {type: 'Identifier', name: 'x'},
                  },
                ],
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
      });

      test('cannot use eval as let name', {
        code: 'let eval = x;',
        throws: 'eval',
      });

      test('cannot use eval as const name', {
        code: 'const eval = x;',
        throws: 'eval',
      });

      test('cannot assign to grouped eval', {
        code: '(eval) = x;',
        throws: 'Invalid assignment', // because `eval` is not assignable
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'eval'},
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
      });

      test('should not pass because of newline / asi', {
        code: '(eval)\n = x;',
        throws: 'Invalid assignment', // applies ASI but then hits a wall
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'eval'},
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
      });

      test('multi wrapped ident assign', {
        code: '((((x)))) = x;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '=',
                right: {type: 'Identifier', name: 'x'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
      test('cannot assign to multi grouped eval', {
        code: '((((eval)))) = x;',
        throws: true,
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'eval'},
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
      });
    });
  });
