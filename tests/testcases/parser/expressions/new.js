let {
  $ASI,
  $IDENT,
  $NUMBER_DEC,
  $PUNCTUATOR,
  $STRING_DOUBLE,
  $TICK_BODY,
  $TICK_HEAD,
  $TICK_PURE,
  $TICK_TAIL,
} = require('../../../../src/zetokenizer');

module.exports = (describe, test) => describe('new', _ => {

  describe('new operator', _ => {

    describe('sans parens', _ => {

      test('just one ident', {
        code: 'new Foo',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'NewExpression',
          arguments: [],
          callee: {type: 'Identifier', name: 'Foo'},
        }}]},
        tokens: [$IDENT, $IDENT, $ASI],
      });

      test('ident member', {
        code: 'new Foo.Bar',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'NewExpression',
          arguments: [],
          callee: {
            type: 'MemberExpression',
            object: {type: 'Identifier', name: 'Foo'},
            property: {type: 'Identifier', name: 'Bar'},
            computed: false,
          },
        }}]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('dynamic member', {
        code: 'new Foo["bar"]',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'NewExpression',
          arguments: [],
          callee: {
            type: 'MemberExpression',
            object: {type: 'Identifier', name: 'Foo'},
            property: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
            computed: true,
          },
        }}]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $ASI],
      });
    });

    describe('sans arguments', _ => {

      test('just one ident', {
        code: 'new Foo()',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'NewExpression',
          arguments: [],
          callee: {type: 'Identifier', name: 'Foo'},
        }}]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('ident member', {
        code: 'new Foo.Bar()',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'NewExpression',
          arguments: [],
          callee: {
            type: 'MemberExpression',
            object: {type: 'Identifier', name: 'Foo'},
            property: {type: 'Identifier', name: 'Bar'},
            computed: false,
          },
        }}]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('dynamic member', {
        code: 'new Foo["bar"]()',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'NewExpression',
          arguments: [],
          callee: {
            type: 'MemberExpression',
            object: {type: 'Identifier', name: 'Foo'},
            property: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
            computed: true,
          },
        }}]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });
    });

    describe('one argument', _ => {

      test('just one ident', {
        code: 'new Foo(X)',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'NewExpression',
          arguments: [{type: 'Identifier', name: 'X'}],
          callee: {type: 'Identifier', name: 'Foo'},
        }}]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('ident member', {
        code: 'new Foo.Bar(X)',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'NewExpression',
          arguments: [{type: 'Identifier', name: 'X'}],
          callee: {
            type: 'MemberExpression',
            object: {type: 'Identifier', name: 'Foo'},
            property: {type: 'Identifier', name: 'Bar'},
            computed: false,
          },
        }}]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('dynamic member', {
        code: 'new Foo["bar"](X)',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'NewExpression',
          arguments: [{type: 'Identifier', name: 'X'}],
          callee: {
            type: 'MemberExpression',
            object: {type: 'Identifier', name: 'Foo'},
            property: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
            computed: true,
          },
        }}]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });
    });

    describe('multi arguments', _ => {

      test('just one ident', {
        code: 'new Foo(X, Y, Z)',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'NewExpression',
          arguments: [{type: 'Identifier', name: 'X'}, {type: 'Identifier', name: 'Y'}, {type: 'Identifier', name: 'Z'}],
          callee: {type: 'Identifier', name: 'Foo'},
        }}]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('ident member', {
        code: 'new Foo.Bar(X, Y, Z)',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'NewExpression',
          arguments: [{type: 'Identifier', name: 'X'}, {type: 'Identifier', name: 'Y'}, {type: 'Identifier', name: 'Z'}],
          callee: {
            type: 'MemberExpression',
            object: {type: 'Identifier', name: 'Foo'},
            property: {type: 'Identifier', name: 'Bar'},
            computed: false,
          },
        }}]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('dynamic member', {
        code: 'new Foo["bar"](X, Y, Z)',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'NewExpression',
          arguments: [{type: 'Identifier', name: 'X'}, {type: 'Identifier', name: 'Y'}, {type: 'Identifier', name: 'Z'}],
          callee: {
            type: 'MemberExpression',
            object: {type: 'Identifier', name: 'Foo'},
            property: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
            computed: true,
          },
        }}]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });
    });

    describe('tagged template', _ => {

      test('new on tagged template', {
        code: 'new Foo`bar`',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'NewExpression',
          arguments: [],
          callee: {
            type: 'TaggedTemplateExpression',
            tag: {type: 'Identifier', name: 'Foo'},
            quasi: {
              type: 'TemplateLiteral',
              expressions: [],
              quasis: [{
                type: 'TemplateElement',
                value: {
                  raw: 'bar',
                  cooked: '<TODO>',
                },
                tail: true,
              }],
            },
          },
        }}]},
        tokens: [$IDENT, $IDENT, $TICK_PURE, $ASI],
        desc: 'Edge case. Example: function f(){ return f } new f`x`;',
      });

      test('new on tagged multi part template', {
        code: 'new Foo`a${b}c${c}e`',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'NewExpression',
          arguments: [],
          callee: {
            type: 'TaggedTemplateExpression',
            tag: {type: 'Identifier', name: 'Foo'},
            quasi: {
              type: 'TemplateLiteral',
              expressions: [{type:'Identifier', name:'b'}, {type:'Identifier', name:'c'}],
              quasis: [{
                type: 'TemplateElement',
                value: {
                  raw: 'a',
                  cooked: '<TODO>',
                },
                tail: false,
              }, {
                type: 'TemplateElement',
                value: {
                  raw: 'c',
                  cooked: '<TODO>',
                },
                tail: false,
              }, {
                type: 'TemplateElement',
                value: {
                  raw: 'e',
                  cooked: '<TODO>',
                },
                tail: true,
              }],
            },
          },
        }}]},
        tokens: [$IDENT, $IDENT, $TICK_HEAD, $IDENT, $TICK_BODY, $IDENT, $TICK_TAIL, $ASI],
        desc: 'Edge case. Example: function f(){ return f } new f`x${5}y`;',
      });
    });

    describe('edge cases', _ => {

      test('after spread', {
        code: '[...new A()]',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'ArrayExpression',
          elements: [{
            type: 'SpreadElement', argument: {
              type: 'NewExpression',
              arguments: [],
              callee: {type: 'Identifier', name: 'A'},
            },
          }],
        }}]},
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('extends value', {
        code: 'class x extends new A() {}',
        ast: {type: 'Program', body: [{
          type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'x'},
          superClass: {
            type: 'NewExpression',
            arguments: [],
            callee: {type: 'Identifier', name: 'A'},
          },
          body: {
            type: 'ClassBody',
            body: [],
          }
        }]},
        tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('dynamic prop', {
        code: 'x({[new A()]:y})',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'CallExpression',
          callee: {type: 'Identifier', name: 'x'},
          arguments: [{type: 'ObjectExpression', properties: [{
            type: 'Property',
            key: {type: 'NewExpression', arguments: [], callee: {type: 'Identifier', name: 'A'}},
            kind: 'init',
            method: false,
            shorthand: false,
            computed: true,
            value: {type: 'Identifier', name: 'y'},
          }]}],
        }}]},
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });
    });
  });

  describe('new.target', _ => {
    // such a messed up syntax

    describe('basic tests', _ => {

      test('plain case', {
        code: 'function f(){ new.target }',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: [{
            type: 'ExpressionStatement',
            expression: {
              type: 'MetaProperty',
              meta: {type: 'Identifier', name: 'new'},
              property: {type: 'Identifier', name: 'target'},
            },
          }]},
        }]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });

      test('spacing should be allowed', {
        code: 'function f(){ new . target }',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: [{
            type: 'ExpressionStatement',
            expression: {
              type: 'MetaProperty',
              meta: {type: 'Identifier', name: 'new'},
              property: {type: 'Identifier', name: 'target'},
            },
          }]},
        }]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });

      test('bad prop', {
        code: 'function f(){ new.foo }',
        throws: 'no other "properties"',
        desc: 'only new.target is syntactic sequence, not an arbitrary property',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });
    });

    describe('scoping', _ => {

      test('in global', {
        code: 'new.target',
        throws: 'regular function',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
        desc: 'needs to be inside a function',
      });

      test('in a function', {
        code: 'function f(){ new.target }',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: [{
            type: 'ExpressionStatement',
            expression: {
              type: 'MetaProperty',
              meta: {type: 'Identifier', name: 'new'},
              property: {type: 'Identifier', name: 'target'},
            },
          }]},
        }]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
        desc: 'refers to the constructor being invoked when `new` is used',
      });

      test('in an arrow in global', {
        code: '_ => new.target',
        throws: 'regular function',
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        desc: 'there is no real function to refer to',
      });

      test('in a nested arrows in global', {
        code: '_ => _ => _ => _ => new.target',
        throws: 'regular function',
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        desc: 'still has no real function to refer to',
      });

      test('in an arrow in another function', {
        code: 'function f(){ return _ => new.target }',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: [{
            type: 'ReturnStatement',
            argument: {
              type: 'ArrowFunctionExpression',
              params: [{type: 'Identifier', name: '_'}],
              id: null,
              generator: false,
              async: false,
              expression: true,
              body: {
                type: 'MetaProperty',
                meta: {type: 'Identifier', name: 'new'},
                property: {type: 'Identifier', name: 'target'},
              },
            },
          }]},
        }]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
        desc: 'refers to the surrounding function (okay, sure)',
      });

      test('in a nested arrow in a function', {
        code: 'function f(){ _ => _ => new.target }',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: [{
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              params: [{type: 'Identifier', name: '_'}],
              id: null,
              generator: false,
              async: false,
              expression: true,
              body: {
                type: 'ArrowFunctionExpression',
                params: [{type: 'Identifier', name: '_'}],
                id: null,
                generator: false,
                async: false,
                expression: true,
                body: {
                  type: 'MetaProperty',
                  meta: {type: 'Identifier', name: 'new'},
                  property: {type: 'Identifier', name: 'target'},
                },
              },
            },
          }]},
        }]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
        desc: 'refers to the surrounding function (okay, sure)',
      });

      test('in a function nested in an arrow', {
        code: '_ => function(){ new.target }',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'ArrowFunctionExpression',
          params: [{type: 'Identifier', name: '_'}],
          id: null,
          generator: false,
          async: false,
          expression: true,
          body: {
            type: 'FunctionExpression',
            generator: false,
            async: false,
            expression: false,
            id: null,
            params: [],
            body: {type: 'BlockStatement', body: [{
              type: 'ExpressionStatement',
              expression: {
                type: 'MetaProperty',
                meta: {type: 'Identifier', name: 'new'},
                property: {type: 'Identifier', name: 'target'},
              },
            }]},
          },
        }}]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $ASI],
        desc: 'refers to the surrounding function (okay, sure)',
      });
    });

    describe('expression', _ => {

      test('not assignable', {
        code: 'function f(){ new.target = foo }',
        throws: 'non-assignable value',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });

      test('not incremental', {
        code: 'function f(){ ++new.target }',
        throws: 'non-assignable value',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });

      // TODO: enable once postfix works
      //test('not decremental', {
      //  code: 'function f(){ new.target-- }',
      //  throws: 'non-assignable value',
      //  tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      //});

      test('operable left', {
        code: 'function f(){ new.target + foo }',
        ast: { type: 'Program', body: [{ type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: { type: 'Identifier', name: 'f' },
          params: [],
          body: {type: 'BlockStatement', body: [{type: 'ExpressionStatement', expression: {
            type: 'BinaryExpression',
            left: {
              type: 'MetaProperty',
              meta: { type: 'Identifier', name: 'new'},
              property: { type: 'Identifier', name: 'target'},
            },
            operator: '+',
            right: {type: 'Identifier', name: 'foo'},
          }}]},
        }]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });

      test('operable right', {
        code: 'function f(){ foo + new.target }',
        ast: { type: 'Program', body: [{ type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: { type: 'Identifier', name: 'f' },
          params: [],
          body: {type: 'BlockStatement', body: [{type: 'ExpressionStatement', expression: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'foo'},
            operator: '+',
            right: {
              type: 'MetaProperty',
              meta: { type: 'Identifier', name: 'new'},
              property: { type: 'Identifier', name: 'target'},
            },
          }}]},
        }]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });

      test('assigned', {
        code: 'function f(){ foo = new.target }',
        ast: { type: 'Program', body: [{ type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: { type: 'Identifier', name: 'f' },
          params: [],
          body: {type: 'BlockStatement', body: [{type: 'ExpressionStatement', expression: {
            type: 'AssignmentExpression',
            left: {type: 'Identifier', name: 'foo'},
            operator: '=',
            right: {
              type: 'MetaProperty',
              meta: { type: 'Identifier', name: 'new'},
              property: { type: 'Identifier', name: 'target'},
            },
          }}]},
        }]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });
    });

    describe('obj/class methods', _ => {

      test('obj method', {
        code: 'foo({bar(){ new.target }})',
        ast: { type: 'Program', body: [{
          type: 'ExpressionStatement', expression: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'foo'},
            arguments: [{type: 'ObjectExpression', properties: [{
            type: 'Property',
              key: { type: 'Identifier', name: 'bar'},
              kind: 'init',
              method: true,
              shorthand: false,
              computed: false,
              value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: { type: 'BlockStatement', body: [{
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'MetaProperty',
                    meta: { type: 'Identifier', name: 'new'},
                    property: { type: 'Identifier', name: 'target'},
                  },
                }]},
              },
            }]}],
          },
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        desc: '(the call wrapper only to disambiguate objlit)'
      });

      describe('class', _ => {

        test('constructor', {
          code: 'class X { constructor() { new.target }}',
          ast: {type: 'Program', body: [{
            type: 'ClassDeclaration',
            id: {type: 'Identifier', name: 'X'},
            superClass: null,
            body: {type: 'ClassBody', body: [{
              type: 'MethodDefinition',
              static: false,
              computed: false,
              kind: 'constructor',
              key: { type: 'Identifier', name: 'constructor'},
              value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: { type: 'BlockStatement', body: [{
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'MetaProperty',
                    meta: {type: 'Identifier', name: 'new'},
                    property: {type: 'Identifier', name: 'target'},
                  },
                }]},
              },
            }]},
          }]},
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('method', {
          code: 'class X { foo() { new.target }}',
          ast: {type: 'Program', body: [{
            type: 'ClassDeclaration',
            id: {type: 'Identifier', name: 'X'},
            superClass: null,
            body: {type: 'ClassBody', body: [{
              type: 'MethodDefinition',
              static: false,
              computed: false,
              kind: 'method',
              key: { type: 'Identifier', name: 'foo'},
              value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: { type: 'BlockStatement', body: [{
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'MetaProperty',
                    meta: {type: 'Identifier', name: 'new'},
                    property: {type: 'Identifier', name: 'target'},
                  },
                }]},
              },
            }]},
          }]},
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('static member', {
          code: 'class X { static foo() { new.target }}',
          ast: {type: 'Program', body: [{
            type: 'ClassDeclaration',
            id: {type: 'Identifier', name: 'X'},
            superClass: null,
            body: {type: 'ClassBody', body: [{
              type: 'MethodDefinition',
              static: true,
              computed: false,
              kind: 'method',
              key: { type: 'Identifier', name: 'foo'},
              value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: { type: 'BlockStatement', body: [{
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'MetaProperty',
                    meta: {type: 'Identifier', name: 'new'},
                    property: {type: 'Identifier', name: 'target'},
                  },
                }]},
              },
            }]},
          }]},
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR],
        });
      });
    });

    describe('inside args', _ => {

      test('func decl', {
        code: 'function f(f=new.target){}',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [{
            type: 'AssignmentPattern',
            left: {type: 'Identifier', name: 'f'},
            right: {
              type: 'MetaProperty',
              meta: {type: 'Identifier', name: 'new'},
              property: {type: 'Identifier', name: 'target'},
            },
          }],
          body: {type: 'BlockStatement', body: []},
        }]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        desc: 'func arg defaults are interpreted in the context of the call so this is fine',
      });

      test('func expr', {
        code: 'foo(function f(f=new.target){})',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'CallExpression',
          callee: {type: 'Identifier', name: 'foo'},
          arguments: [{
            type: 'FunctionExpression',
            generator: false,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'f'},
            params: [{
              type: 'AssignmentPattern',
              left: {type: 'Identifier', name: 'f'},
              right: {
                type: 'MetaProperty',
                meta: {type: 'Identifier', name: 'new'},
                property: {type: 'Identifier', name: 'target'},
              },
            }],
            body: {type: 'BlockStatement', body: []},
          }],
        }}]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        desc: 'func arg defaults are interpreted in the context of the call so this is fine',
      });

      test('arrow', {
        code: '(f=new.target) => {}',
        throws: 'regular function',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        desc: 'still bad in arrow functions'
      });

      test('obj method', {
        code: '({foo(x=new.target){}})',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
          type: 'ObjectExpression',
          properties: [{
            type: 'Property',
            key: {type: 'Identifier', name: 'foo'},
            kind: 'init',
            method: true,
            shorthand: false,
            computed: false,
            value: {
              type: 'FunctionExpression',
              generator: false,
              async: false,
              expression: false,
              id: null,
              params: [{
                type: 'AssignmentPattern',
                left: {type: 'Identifier', name: 'x'},
                right: {type: 'MetaProperty', meta: {type: 'Identifier', name: 'new'}, property: {type: 'Identifier', name: 'target'}},
              }],
              body: {type: 'BlockStatement', body: []},
            },
          }],
        }}]},
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('class constructor', {
        code: 'class A {constructor(x=new.target){}}',
        ast: {type: 'Program', body: [
          {type: 'ClassDeclaration',
            id: {type: 'Identifier', name: 'A'},
            superClass: null,
            body: {type: 'ClassBody',
              body: [
                {type: 'MethodDefinition',
                  static: false,
                  computed: false,
                  kind: 'constructor',
                  key: {type: 'Identifier', name: 'constructor'},
                  value: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    expression: false,
                    id: null,
                    params: [{
                      type: 'AssignmentPattern',
                      left: {type: 'Identifier', name: 'x'},
                      right: {type: 'MetaProperty', meta: {type: 'Identifier', name: 'new'}, property: {type: 'Identifier', name: 'target'}},
                    }],
                    body: {type: 'BlockStatement', body: []},
                  },
                },
              ],
            }
          },
        ]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('class method', {
        code: 'class A {a(x=new.target){}}',
        ast: {type: 'Program', body: [
          {type: 'ClassDeclaration',
            id: {type: 'Identifier', name: 'A'},
            superClass: null,
            body: {type: 'ClassBody',
              body: [
                {type: 'MethodDefinition',
                  static: false,
                  computed: false,
                  kind: 'method',
                  key: {type: 'Identifier', name: 'a'},
                  value: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    expression: false,
                    id: null,
                    params: [{
                      type: 'AssignmentPattern',
                      left: {type: 'Identifier', name: 'x'},
                      right: {type: 'MetaProperty', meta: {type: 'Identifier', name: 'new'}, property: {type: 'Identifier', name: 'target'}},
                    }],
                    body: {type: 'BlockStatement', body: []}
                  },
                },
              ],
            }
          },
        ]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('class static member', {
        code: 'class A {static a(x=new.target){}}',
        ast: {type: 'Program', body: [
          {type: 'ClassDeclaration',
            id: {type: 'Identifier', name: 'A'},
            superClass: null,
            body: {type: 'ClassBody',
              body: [
                {type: 'MethodDefinition',
                  static: true,
                  computed: false,
                  kind: 'method',
                  key: {type: 'Identifier', name: 'a'},
                  value: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    expression: false,
                    id: null,
                    params: [{
                      type: 'AssignmentPattern',
                      left: {type: 'Identifier', name: 'x'},
                      right: {type: 'MetaProperty', meta: {type: 'Identifier', name: 'new'}, property: {type: 'Identifier', name: 'target'}},
                    }],
                    body: {type: 'BlockStatement', body: []}
                  },
                },
              ],
            }
          },
        ]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('edge cases', _ => {

      test('after spread', {
        code: 'function f(){ [...new.target] }',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: { type: 'Identifier', name: 'f' },
          params: [],
          body: {
            type: 'BlockStatement',
            body: [{
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [{
                  type: 'SpreadElement',
                  argument: {
                    type: 'MetaProperty',
                    meta: {type: 'Identifier', name: 'new'},
                    property: {type: 'Identifier', name: 'target'},
                  },
                }],
              },
            }],
          },
        }]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI, $PUNCTUATOR],
      });

      test('extends value', {
        code: 'function f(){ class x extends new.target {} }',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: { type: 'Identifier', name: 'f' },
          params: [],
          body: {
            type: 'BlockStatement',
            body: [{
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: {
                type: 'MetaProperty',
                meta: {type: 'Identifier', name: 'new'},
                property: {type: 'Identifier', name: 'target'},
              },
              body: {
                type: 'ClassBody',
                body: [],
              },
            }],
          },
        }]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('dynamic prop', {
        code: 'function f(){ x({[new.target]:y}) }',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: { type: 'Identifier', name: 'f' },
          params: [],
          body: {
            type: 'BlockStatement',
            body: [{
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'x'},
                arguments: [{type: 'ObjectExpression', properties: [{
                  type: 'Property',
                  key: {
                    type: 'MetaProperty',
                    meta: {type: 'Identifier', name: 'new'},
                    property: {type: 'Identifier', name: 'target'},
                  },
                  kind: 'init',
                  method: false,
                  shorthand: false,
                  computed: true,
                  value: {type: 'Identifier', name: 'y'},
                }]}],
              },
            }],
          },
        }]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI, $PUNCTUATOR],
      });
    });
  });
});
