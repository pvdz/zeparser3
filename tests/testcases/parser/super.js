let {$ASI, $IDENT, $PUNCTUATOR, $TICK_BODY, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('super keyword', _ => {

    describe('super()', _ => {

      describe('class constructors', _ => {

        test('okay to omit without constructor', {
          code: 'class x extends y { }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {type: 'ClassBody', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('okay to omit with methods without constructor', {
          code: 'class x extends y { f(){} }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'f'},
                      static: false,
                      computed: false,
                      kind: 'method',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [],
                        body: {type: 'BlockStatement', body: []},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('ok inside constructor of class that extends another class', {
          code: 'class x extends y { constructor() { super(); } }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'constructor'},
                      static: false,
                      computed: false,
                      kind: 'constructor',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {type: 'Super'},
                                arguments: [],
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('ok to omit from constructor of class that extends another class', {
          code: 'class x extends y { constructor() { } }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'constructor'},
                      static: false,
                      computed: false,
                      kind: 'constructor',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [],
                        body: {type: 'BlockStatement', body: []},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('error inside constructor of class that does NOT extends another class', {
          code: 'class x { constructor() { super(); } }',
          throws: 'super',
        });

        test('not a syntax error, just runtime, to refer to `this` before calling `super()`', {
          code: 'class x extends y { constructor() { log(this); super(); } }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'constructor'},
                      static: false,
                      computed: false,
                      kind: 'constructor',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {type: 'Identifier', name: 'log'},
                                arguments: [{type: 'ThisExpression'}],
                              },
                            },
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {type: 'Super'},
                                arguments: [],
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('no syntax error to refer to `super` prop before calling `super()`', {
          code: 'class x extends y { constructor() { log(super.foo); super(); } }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'constructor'},
                      static: false,
                      computed: false,
                      kind: 'constructor',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {type: 'Identifier', name: 'log'},
                                arguments: [
                                  {
                                    type: 'MemberExpression',
                                    object: {type: 'Super'},
                                    property: {type: 'Identifier', name: 'foo'},
                                    computed: false,
                                  },
                                ],
                              },
                            },
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {type: 'Super'},
                                arguments: [],
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('allowed in constructor arg defaults', {
          code: 'class x extends y { constructor(x = super()) { } }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'constructor'},
                      static: false,
                      computed: false,
                      kind: 'constructor',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'x'},
                            right: {
                              type: 'CallExpression',
                              callee: {type: 'Super'},
                              arguments: [],
                            },
                          },
                        ],
                        body: {type: 'BlockStatement', body: []},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('referring to `this` in arg default before calling `super()` is a runtime error', {
          code: 'class x extends y { constructor(x = this) { super(); } }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'constructor'},
                      static: false,
                      computed: false,
                      kind: 'constructor',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'x'},
                            right: {type: 'ThisExpression'},
                          },
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {type: 'Super'},
                                arguments: [],
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('can refer to this after calling super() in arg default', {
          code: 'class x extends y { constructor(x = super(), y = this) { } }',
          desc: 'this can still trigger a runtime error',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'constructor'},
                      static: false,
                      computed: false,
                      kind: 'constructor',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'x'},
                            right: {
                              type: 'CallExpression',
                              callee: {type: 'Super'},
                              arguments: [],
                            },
                          },
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'y'},
                            right: {type: 'ThisExpression'},
                          },
                        ],
                        body: {type: 'BlockStatement', body: []},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('can call super twice', {
          code: 'class x extends y { constructor() { super(); super(); } }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'constructor'},
                      static: false,
                      computed: false,
                      kind: 'constructor',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {type: 'Super'},
                                arguments: [],
                              },
                            },
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {type: 'Super'},
                                arguments: [],
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('chicken meet egg, runtime error', {
          code: 'class x extends y { constructor() { super(this); } }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'constructor'},
                      static: false,
                      computed: false,
                      kind: 'constructor',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {type: 'Super'},
                                arguments: [{type: 'ThisExpression'}],
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('can execute things before calling `super()`', {
          code: 'class x extends y { constructor() { let xx = x + x; super(); } }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'constructor'},
                      static: false,
                      computed: false,
                      kind: 'constructor',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'VariableDeclaration',
                              kind: 'let',
                              declarations: [
                                {
                                  type: 'VariableDeclarator',
                                  id: {type: 'Identifier', name: 'xx'},
                                  init: {
                                    type: 'BinaryExpression',
                                    left: {type: 'Identifier', name: 'x'},
                                    operator: '+',
                                    right: {type: 'Identifier', name: 'x'},
                                  },
                                },
                              ],
                            },
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {type: 'Super'},
                                arguments: [],
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('can call functions before calling `super()`', {
          code: 'class x extends y { constructor() { f(x); super(); } }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'constructor'},
                      static: false,
                      computed: false,
                      kind: 'constructor',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {type: 'Identifier', name: 'f'},
                                arguments: [{type: 'Identifier', name: 'x'}],
                              },
                            },
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {type: 'Super'},
                                arguments: [],
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('methods', _ => {

        test('can not even call `super()` in a method when extending', {
          code: 'class x extends y { foo(){ super(); } }',
          throws: 'super',
        });

        test('cannot call `super()` in a method', {
          code: 'class x { foo(){ super(); } }',
          throws: 'super',
        });

        test('cannot call `super()` in objlit methods', {
          code: 'let x = { foo(){ super(); } }',
          throws: 'super',
        });

        test('cannot call `super()` in constructor-nested objlit methods', {
          code: 'class A { constructor(){  let x = { foo(){ super(); } };  }}',
          throws: 'super',
        });
      });

      test('cannot be used as plain toplevel', {
        code: 'super();',
        throws: 'super',
      });

      test('cannot be used in toplevel expression', {
        code: 'const x = 5 + super();',
        throws: 'super',
      });

      test('cannot be used in function decl', {
        code: 'function f(){ super(); }',
        throws: 'super',
      });

      test('cannot be used in arg default of function decl', {
        code: 'function f(x = super()){ }',
        throws: 'super',
      });

      test.pass('could be used in class in func arg default', {
        code: 'function f(x = class A extends B { constructor(){ super(); }}){ }',
        desc: 'I mean, if you want to, you could. this mainly confirms the state is properly updated',
      });

      test('cannot be used in function expr', {
        code: 'g=function f(){ super(); }',
        throws: 'super',
      });

      test('cannot be used in arg default of function expr', {
        code: 'g=function f(x = super()){ }',
        throws: 'super',
      });

      test('cannot be used in func of object key', {
        code: 'g={f: function f(){ super() }]',
        throws: 'super',
      });

      test('cannot be used in method of object called "constructor"', {
        code: 'x={constructor(){ super(); }}',
        throws: 'super',
      });
    });

    describe('super.foo', _ => {

      test.pass('allowed in constructor of non-extending class', {
        code: 'class x { constructor(){ super.foo; }}',
      });

      test.pass('allowed in method of non-extending class', {
        code: 'class x { foo(){ super.foo; }}',
      });

      test.pass('allowed in method arg default of non-extending class', {
        code: 'class x { foo(x=super.foo){ }}',
      });

      test.pass('allowed in method of object', {
        code: 'x={ foo(){ super.foo; }}',
      });

      test.pass('allowed in arg default method of object', {
        code: 'x={ foo(a = super.foo){ }}',
      });

      test.pass('computed allowed in constructor of non-extending class', {
        code: 'class x { constructor(){ super[foo]; }}',
      });

      test.pass('computed allowed in method of non-extending class', {
        code: 'class x { foo(){ super[foo]; }}',
      });

      test.pass('computed allowed in method arg default of non-extending class', {
        code: 'class x { foo(x=super[foo]){ }}',
      });

      test.pass('computed allowed in method of object', {
        code: 'x={ foo(){ super[foo]; }}',
      });

      test.pass('computed allowed in arg default method of object', {
        code: 'x={ foo(a = super[foo]){ }}',
      });

      test('illegal in object with function property', {
        code: 'x={ foo: function(){ super.foo; }}',
        throws: 'super',
      });

      test('illegal in function decl', {
        code: 'function f(){ super.foo; }',
        throws: 'super',
      });

      test('illegal in arg default of function decl', {
        code: 'function f(x=super.foo){ }',
        throws: 'super',
      });

      test('illegal in toplevel', {
        code: 'super.foo;',
        throws: 'super',
      });

      test('illegal in func expr', {
        code: 'x = function(){ super.foo; }',
        throws: 'super',
      });

      test('illegal in func inside class constructor', {
        code: 'class x { constructor(){ function f(){ super.foo; } }}',
        throws: 'super',
      });

      test('illegal in func inside class method', {
        code: 'class x { foo(){ function f(){ super.foo; } }}',
        throws: 'super',
      });
    });

    describe('super() in arrows', _ => {

      test('illegal in toplevel', {
        code: 'let f = () => super();',
        throws: 'super',
      });

      test('illegal in arg in toplevel', {
        code: 'let f = (a=super()) => a;',
        throws: 'super',
      });

      test.pass('allowed in extending constructor', {
        code: 'class x extends y { constructor(){ return () => super(); }}',
      });

      test.pass('allowed in arg of extending constructor', {
        code: 'class x extends y { constructor(){ return (a=super()) => a; }}',
      });

      test.pass('allowed in nested arrow in valid constructor', {
        code: 'class x extends y { constructor(){ return () => () => super(); }}',
      });

      test('illegal in nested arrow in non-extending constructor', {
        code: 'class x { constructor(){ return () => () => super(); }}',
        throws: 'super',
      });

      test('illegal in nested arrow in function in valid constructor', {
        code: 'class x extends y { constructor(){ return function() { return () => super(); } }}',
        throws: 'super',
      });

      test('illegal in method of extending class', {
        code: 'class x extends y { fo(){ return () => super(); }}',
        throws: 'super',
      });

      test('illegal in arg of method of extending class', {
        code: 'class x extends y { dsda(){ return (a=super()) => a; }}',
        throws: 'super',
      });

      test('illegal in nested arrow in method of valid class', {
        code: 'class x extends y { foo(){ return () => () => super(); }}',
        throws: 'super',
      });

      test('illegal in method of objlit', {
        code: 'x={ fo(){ return () => super(); }}',
        throws: 'super',
      });

      test('illegal in arg of method of objlit', {
        code: 'x={ dsda(){ return (a=super()) => a; }}',
        throws: 'super',
      });

      test('illegal in nested arrow in method of objlit', {
        code: 'x={ foo(){ return () => () => super(); }}',
        throws: 'super',
      });
    });

    describe('super.foo in arrows', _ => {

      test('illegal in toplevel', {
        code: 'let f = () => super.foo;',
        throws: 'super',
      });

      test('illegal in arg in toplevel', {
        code: 'let f = (a=super.foo) => a;',
        throws: 'super',
      });

      test.pass('allowed in extending constructor', {
        code: 'class x extends y { constructor(){ return () => super.foo; }}',
      });

      test.pass('computed allowed in extending constructor', {
        code: 'class x extends y { constructor(){ return () => super[foo]; }}',
      });

      test.pass('allowed in non-extending constructor', {
        code: 'class x { constructor(){ return () => super.foo; }}',
      });

      test.pass('allowed in arg of extending constructor', {
        code: 'class x extends y { constructor(){ return (a=super.foo) => a; }}',
      });

      test.pass('allowed in arg of non-extending constructor', {
        code: 'class x extends y { constructor(){ return (a=super.foo) => a; }}',
      });

      test.pass('allowed in nested arrow in extending constructor', {
        code: 'class x extends y { constructor(){ return () => () => super.foo; }}',
      });

      test.pass('allowed in nested arrow in non-extending constructor', {
        code: 'class x { constructor(){ return () => () => super.foo; }}',
      });

      test('illegal in nested arrow in function in valid constructor', {
        code: 'class x extends y { constructor(){ return function() { return () => super.foo; } }}',
        throws: 'super',
      });

      test.pass('allowed in method of extending class', {
        code: 'class x extends y { fo(){ return () => super.foo; }}',
      });

      test.pass('allowed in method of non-extending class', {
        code: 'class x { fo(){ return () => super.foo; }}',
      });

      test.pass('allowed in arg of method of extending class', {
        code: 'class x extends y { dsda(){ return (a=super.foo) => a; }}',
      });

      test.pass('allowed in arg of method of non-extending class', {
        code: 'class x { dsda(){ return (a=super.foo) => a; }}',
      });

      test.pass('allowed in nested arrow in method of extending class', {
        code: 'class x extends y { foo(){ return () => () => super.foo; }}',
      });

      test.pass('allowed in nested arrow in method of non-extending class', {
        code: 'class x extends y { foo(){ return () => () => super.foo; }}',
      });

      test.pass('allowed in method of objlit', {
        code: 'x={ fo(){ return () => super.foo; }}',
      });

      test.pass('allowed in arg of method of objlit', {
        code: 'x={ dsda(){ return (a=super.foo) => a; }}',
      });

      test.pass('allowed in nested arrow in method of objlit', {
        code: 'x={ foo(){ return () => () => super.foo; }}',
      });
    });
  });

// super properties are never destructuring (https://tc39.github.io/ecma262/#sec-static-semantics-static-semantics-isdestructuring)
// super properties are "simple assignment type" (https://tc39.github.io/ecma262/#sec-static-semantics-static-semantics-assignmenttargettype)
// either a property (ident/computed) or a direct call
// cannot delete on super (but that's a runtime error, I guess to distinguish between `super.foo` and `super.foo.bar`)
// super() cannot appear in any "method" or function
// super cannot appear in the args or body of a function expr/decl/gen (https://tc39.github.io/ecma262/#sec-function-definitions-static-semantics-early-errors)
// (async/sync) generator methods and functions cannot have super references (https://tc39.github.io/ecma262/#sec-generator-function-definitions-static-semantics-early-errors)

// arrows; super() can appear inside constructor, super.foo can appear in constructor and class/object methods

// https://tc39.github.io/ecma262/#sec-scripts-static-semantics-early-errors
// > It is a Syntax Error if StatementList Contains super unless the source code containing super is eval code that is being processed by a direct eval. Additional early error rules for  super within direct eval are defined in 18.2.1.1.
// (toplevel statements cannot contains super)

// https://tc39.github.io/ecma262/#sec-module-semantics-static-semantics-early-errors
// > It is a Syntax Error if ModuleItemList Contains super.
// (toplevel statements cannot contain super)

// `super()` (but no mention about `super.foo`) in a class that does not extend is a syntax error (https://tc39.github.io/ecma262/#sec-class-definitions-static-semantics-early-errors)
// can never `super()` in non-constructor methods
// can never `super()` in static methods

// https://tc39.github.io/ecma262/#sec-object-initializer-static-semantics-early-errors
// > It is a Syntax Error if HasDirectSuper of MethodDefinition is true.
// (cannot super() in object literal methods)



// TODO
// function f(){super}
// function super(){}
// function f(super){}
//
// class A { constructor(){ super } }
// class A { constructor(){ super(); } }
// class A { constructor(super){ } }
// class A { constructor(x=super()){ } }
//
// class A { f(){ super } }
// class A { f(){ super(); } }
// class A { f(super){ } }
// class A { f(x=super()){ } }

