let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('let statement', _ => {

  describe('regular vars', _ => {
    
    test('let, one var, no init, semi',{
      code: 'let foo;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR],
    });
    
    test('let, one var, no init, eof',{
      code: 'let foo',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
        ]}
      ]},
      tokens: [$IDENT, $IDENT, $ASI],
    });
    
    test('let, two vars, no init, semi',{
      code: 'let foo, bar;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });
    
    test('let, two vars, no init, eof',{
      code: 'let foo, bar',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
    
    test('let, var with init, semi',{
      code: 'let foo = bar;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });
    
    test('let, var with init, eof',{
      code: 'let foo = bar',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
    
    test('let, var with init, asi',{
      code: 'let foo = bar\nlet zoo;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
        ]},
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: null},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR],
    });
    
    test('let, two vars with both init, semi',{
      code: 'let foo = bar, zoo = boo;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });
    
    test('let, two vars with both init, asi',{
      code: 'let foo = bar, zoo = boo',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
  });

  describe('destructuring', _ => {

    describe('array', _ => {

      // TODO
      // let [] = x;
      // let [,] = x;
      // let [,,] = x;
      // let [foo] = x;
      // let [foo,] = x;
      // let [foo,,] = x;
      // let [,foo] = x;
      // let [,,foo] = x;
      // let [foo,bar] = x;
      // let [foo,,bar] = x;
      // let [foo] = x, [foo] = y;
      // let [foo] = x, b;
      // let [foo] = x, b = y;
      // let x, [foo] = y;
      // let x = y, [foo] = z;
      // let [foo=a] = c;
      // let [foo=a,bar] = x;
      // let [foo,bar=b] = x;
      // let [foo=a,bar=b] = x;
      // let [foo];                 // error
      // let [foo=a];               // error
      // let [foo], bar;            // error
      // let foo, [bar];            // error

      test('empty "array" should work', {
        code: 'let [] = x;',
        ast: {type: 'Program', body: [{
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [{
            type: 'VariableDeclarator',
            id: {type: 'ArrayPattern', elements: []},
            init: {type: 'Identifier', name: 'x'},
          }],
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('empty array with one comma', {
        code: 'let [,] = x;',
        ast: {type: 'Program', body: [{
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [{
            type: 'VariableDeclarator',
            id: {type: 'ArrayPattern', elements: [null]},
            init: {type: 'Identifier', name: 'x'},
          }],
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('empty array with double comma', {
        code: 'let [,,] = x;',
        ast: {type: 'Program', body: [{
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [{
            type: 'VariableDeclarator',
            id: {type: 'ArrayPattern', elements: [null, null]},
            init: {type: 'Identifier', name: 'x'},
          }],
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('with one var, no init, semi', {
        code: 'let [foo] = arr;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'foo'}]}, init: {type: 'Identifier', name: 'arr'}},
          ]},
        ]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('trailing comma is insignificant', {
        code: 'let [foo,] = arr;',
        ast: {type: 'Program', body: [{type: 'VariableDeclaration', kind: 'let', declarations: [{
          type: 'VariableDeclarator',
          id: {
            type: 'ArrayPattern',
            elements: [
              {type: 'Identifier', name: 'foo'},
            ],
          },
          init: {type: 'Identifier', name: 'arr'},
        }]}]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('double trailing comma is significant', {
        code: 'let [foo,,] = arr;',
        ast: {type: 'Program', body: [{type: 'VariableDeclaration', kind: 'let', declarations: [{
          type: 'VariableDeclarator',
          id: {
            type: 'ArrayPattern',
            elements: [
              {type: 'Identifier', name: 'foo'},
              null,
            ],
          },
          init: {type: 'Identifier', name: 'arr'},
        }]}]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('leading comma', {
        code: 'let [,foo] = arr;',
        ast: {type: 'Program', body: [{type: 'VariableDeclaration', kind: 'let', declarations: [{
          type: 'VariableDeclarator',
          id: {
            type: 'ArrayPattern',
            elements: [
              null,
              {type: 'Identifier', name: 'foo'},
            ],
          },
          init: {type: 'Identifier', name: 'arr'},
        }]}]},
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('double leading comma', {
        code: 'let [,,foo] = arr;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'ArrayPattern', elements: [
              null,
              null,
              {type: 'Identifier', name: 'foo'},
            ]}, init: {type: 'Identifier', name: 'arr'}},
          ]},
        ]},
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('two vars', {
        code: 'let [foo,bar] = arr;',
        ast: {type: 'Program', body: [{type: 'VariableDeclaration', kind: 'let', declarations: [{
          type: 'VariableDeclarator',
          id: {
            type: 'ArrayPattern',
            elements: [
              {type: 'Identifier', name: 'foo'},
              {type: 'Identifier', name: 'bar'},
            ],
          },
          init: {type: 'Identifier', name: 'arr'},
        }]}]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('two vars with eliding comma', {
        code: 'let [foo,,bar] = arr;',
        ast: {type: 'Program', body: [{type: 'VariableDeclaration', kind: 'let', declarations: [{
          type: 'VariableDeclarator',
          id: {
            type: 'ArrayPattern',
            elements: [
              {type: 'Identifier', name: 'foo'},
              null,
              {type: 'Identifier', name: 'bar'},
            ],
          },
          init: {type: 'Identifier', name: 'arr'},
        }]}]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('double destruct', {
        code: 'let [foo] = arr, [bar] = arr2;',
        ast: {type: 'Program', body: [{
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [{
            type: 'VariableDeclarator',
            id: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'foo'},
            ]},
            init: {type: 'Identifier', name: 'arr'},
          }, {
            type: 'VariableDeclarator',
            id: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'bar'},
            ]},
            init: {type: 'Identifier', name: 'arr2'},
          }],
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('destruct and non-destruct without init', {
        code: 'let [foo] = arr, bar;',
        ast: {type: 'Program', body: [{
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [{
            type: 'VariableDeclarator',
            id: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'foo'},
            ]},
            init: {type: 'Identifier', name: 'arr'},
          }, {
            type: 'VariableDeclarator',
            id: {type: 'Identifier', name: 'bar'},
            init: null,
          }],
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('destruct and non-destruct with init', {
        code: 'let [foo] = arr, bar = arr2;',
        ast: {type: 'Program', body: [{
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [{
            type: 'VariableDeclarator',
            id: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'foo'},
            ]},
            init: {type: 'Identifier', name: 'arr'},
          }, {
            type: 'VariableDeclarator',
            id: {type: 'Identifier', name: 'bar'},
            init: {type: 'Identifier', name: 'arr2'},
          }],
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('non-destruct without init and destruct', {
        code: 'let foo, [bar] = arr2;',
        ast: {type: 'Program', body: [{
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [{
            type: 'VariableDeclarator',
            id: {type: 'Identifier', name: 'foo'},
            init: null,
          }, {
            type: 'VariableDeclarator',
            id: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'bar'},
            ]},
            init: {type: 'Identifier', name: 'arr2'},
          }],
        }]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('non-destruct with init and destruct', {
        code: 'let foo = arr, [bar] = arr2;',
        ast: {type: 'Program', body: [{
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [{
            type: 'VariableDeclarator',
            id: {type: 'Identifier', name: 'foo'},
            init: {type: 'Identifier', name: 'arr'},
          }, {
            type: 'VariableDeclarator',
            id: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'bar'},
            ]},
            init: {type: 'Identifier', name: 'arr2'},
          }],
        }]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('one var with initializer', {
        code: 'let [foo=a] = arr;',
        ast: {type: 'Program', body: [{
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [{
            type: 'VariableDeclarator',
            id: {
              type: 'ArrayPattern',
              elements: [{
                type: 'AssignmentPattern',
                left: {type: 'Identifier', name: 'foo'},
                right: {type: 'Identifier', name: 'a'},
              }],
            },
            init: {type: 'Identifier', name: 'arr'},
          }]},
        ]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('two vars, with and without initializer', {
        code: 'let [foo=a, bar] = arr;',
        ast: {type: 'Program', body: [{
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [{
            type: 'VariableDeclarator',
            id: {type: 'ArrayPattern', elements: [
              {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'foo'}, right: {type: 'Identifier', name: 'a'}},
              {type: 'Identifier', name: 'bar'},
            ]},
            init: {type: 'Identifier', name: 'arr'},
          }]},
        ]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('two vars, without and with initializer', {
        code: 'let [foo, bar=b] = arr;',
        ast: {type: 'Program', body: [{
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [{
            type: 'VariableDeclarator',
            id: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'foo'},
              {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, right: {type: 'Identifier', name: 'b'}},
            ]},
            init: {type: 'Identifier', name: 'arr'},
          }]},
        ]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('two vars, without and with initializer', {
        code: 'let [foo=a, bar=b] = arr;',
        ast: {type: 'Program', body: [{
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [{
            type: 'VariableDeclarator',
            id: {type: 'ArrayPattern', elements: [
              {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'foo'}, right: {type: 'Identifier', name: 'a'}},
              {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, right: {type: 'Identifier', name: 'b'}},
            ]},
            init: {type: 'Identifier', name: 'arr'},
          }]},
        ]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('no assignment without init', {
        code: 'let [foo];',
        throws: 'without an assignment',
        desc: 'this could be legal in sloppy except not at the start of a statement',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('no assignment with init', {
        code: 'let [foo = x];',
        throws: 'without an assignment',
        desc: 'this could be legal in sloppy except not at the start of a statement',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('no assignment with two declarations first', {
        code: 'let [foo], bar;',
        throws: 'without an assignment',
        desc: 'just like `foo[bar],baz` which is a fine expression in sloppy mode, except that it is still illegal',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('no assignment with two declarations second', {
        code: 'let foo, [bar];',
        throws: 'without an assignment',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
    });

    describe('object', _ => {

      // TODO
      // let {} = x;
      // let {,} = x;             //?
      // let {,,} = x;            //?
      // let {foo} = x;
      // let {foo,} = x;
      // let {foo,,} = x;         //?
      // let {,foo} = x;          //?
      // let {,,foo} = x;          //?
      // let {foo,bar} = x;
      // let {foo,,bar} = x;      //?
      // let {foo} = x, {foo} = y;
      // let {foo} = x, b;
      // let {foo} = x, b = y;
      // let x, {foo} = y;
      // let x = y, {foo} = z;
      // let {foo=a} = x;
      // let {foo=a,bar} = x;
      // let {foo,bar=b} = x;
      // let {foo=a,bar=b} = x;
      // let {foo:a} = x;
      // let {foo:a,bar} = x;
      // let {foo,bar:b} = x;
      // let {foo:a,bar:b} = x;
      // let {foo:a,bar:b} = x;
      // let {foo:a=b} = x;
      // let {foo:a=b, bar:c=d} = x;
      // let {foo};
      // let {foo=a};
      // let {foo:a};
      // let {foo:a=b};
      // let {foo}, bar;
      // let foo, {bar};

      test('let, destructuring obj with shorthand, no init, semi',{
        code: 'let {foo} = arr;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'ObjectPattern', properties: [
              {type: 'Identifier', name: 'foo'},
            ]}, init: {type: 'Identifier', name: 'arr'}},
          ]},
        ]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('let, destructuring obj with shorthand and trailing comma, no init, semi', {
        code: 'let {foo,} = arr;',
        ast: {type: 'Program', body: [{
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [{
            type: 'VariableDeclarator',
            id: {type: 'ObjectPattern', properties: [{type: 'Identifier', name: 'foo'}]},
            init: {type: 'Identifier', name: 'arr'},
          }],
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
    });
  });

  describe('let as identifier in sloppy mode', _ => {

    // (note: the spec doesn't explicitly allow `let` as a var name but rather forbids
    // it under certain situations. For example: in strict mode and as let/const names)

    describe('let as var name', _ => {

      test('var decl', {
        code: 'var let;',
        throws: 'var name in strict',
        SLOPPY_SCRIPT: {
          desc: 'let as a var name is only allowed in (non-module) sloppy mode to support pre-es6-code',
          ast: {type: 'Program', body: [{
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [{
              type: 'VariableDeclarator',
              id: {type: 'Identifier', name: 'let'},
              init: null,
            }],
          }]},
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR],
      });
    });

    describe('dynamic prop on let var', _ => {

      describe('illegal ambiguous cases', _ => {

        // A statement can not start with dynamic property access on `let` (`let[foo]=bar`)
        // because it would be ambiguous with let destructuring. See note in
        // https://tc39.github.io/ecma262/#prod-ExpressionStatement

        test('in global', {
          code: 'let[foo];',
          throws: 'without an assignment',
          tokens: [],
        });

        test('in regular function', {
          code: 'function f(){ let[foo]; }',
          throws: 'without an assignment',
          tokens: [],
        });

        test('in arrow expr body', {
          code: '_ => let[foo];',
          throws: 'strict mode',
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [{
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: '_'}],
                  id: null,
                  generator: false,
                  async: false,
                  expression: true,
                  body: {
                    type: 'MemberExpression',
                    object: {type: 'Identifier', name: 'let'},
                    property: {type: 'Identifier', name: 'foo'},
                    computed: true,
                  },
                },
              }],
            },
          },
          desc: '(arrows are not strict by default) the non-block arrow body is an expression',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('in arrow stmt body', {
          code: '_ => { let[foo]; }',
          throws: 'without an assignment',
          desc: '(arrows are not strict by default) the non-block arrow body is a statement block',
          tokens: [],
        });

        test('in classes', {
          code: 'class x { foo() { let[foo]; }}',
          throws: 'without an assignment',
          tokens: [],
          desc: 'classes are implicitly always strict',
        });
      });
    });
  });
});
