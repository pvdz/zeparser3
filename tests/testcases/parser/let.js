let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('let statement', _ => {

  describe('as a statement', _ => {

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

      test('var on next line does not trigger asi', {
        code: 'let\nfoo',
        ast: {
          type: 'Program',
          body: [{
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [{
              type: 'VariableDeclarator',
              id: {type: 'Identifier', name: 'foo'},
              init: null
            }]
          }]
        },
        tokens: [$IDENT, $IDENT, $ASI],
      });

      test('asi can not trigger if next token is ident', {
        code: 'let\nfoo()',
        throws: 'ASI',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
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
  });

  describe('in a for-loop-header', _ => {

    describe('regular vars', _ => {

      test('let, one var, no init, semi',{
        code: 'for (let foo;;);',
        ast: {
          type: 'Program',
          body: [{
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [{
                type: 'VariableDeclarator',
                id: {type: 'Identifier', name: 'foo'},
                init: null
              }]
            },
            test: null,
            update: null,
            body: {type: 'EmptyStatement'}
          }]
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('let, two vars, no init, semi',{
        code: 'for (let foo, bar;;);',
        ast: {
          type: 'Program',
          body: [{
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [{
                type: 'VariableDeclarator',
                id: {type: 'Identifier', name: 'foo'},
                init: null
              }, {
                type: 'VariableDeclarator',
                id: {type: 'Identifier', name: 'bar'},
                init: null
              }],
            },
            test: null,
            update: null,
            body: {type: 'EmptyStatement'},
          }],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('let, var with init, semi',{
        code: 'for (let foo = bar;;);',
        ast: {
          type: 'Program',
          body: [{
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [{
                type: 'VariableDeclarator',
                id: {type: 'Identifier', name: 'foo'},
                init: {type: 'Identifier', name: 'bar'},
              }],
            },
            test: null,
            update: null,
            body: {type: 'EmptyStatement'},
          }],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('let, two vars with both init, semi',{
        code: 'for (let foo = bar, zoo = boo;;);',
        ast: {
          type: 'Program',
          body: [{
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [{
                type: 'VariableDeclarator',
                id: {type: 'Identifier', name: 'foo'},
                init: {type: 'Identifier', name: 'bar'}
              }, {
                type: 'VariableDeclarator',
                id: {type: 'Identifier', name: 'zoo'},
                init: {type: 'Identifier', name: 'boo'}
              }],
            },
            test: null,
            update: null,
            body: {type: 'EmptyStatement'},
          }],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('var on next line does not trigger asi', {
        code: 'for (let\nfoo;;);',
        ast: {
          type: 'Program',
          body: [{
            type: 'ForStatement',
            init: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [{
                type: 'VariableDeclarator',
                id: {type: 'Identifier', name: 'foo'},
                init: null,
              }],
            },
            test: null,
            update: null,
            body: {type: 'EmptyStatement'},
          }],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('asi can not trigger if next token is ident', {
        code: 'for (let\nfoo();;);',
        throws: '(;)', // expecting for-header semi
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
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
          code: 'for (let [] = x;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id: { type: 'ArrayPattern', elements: [] },
                      init: { type: 'Identifier', name: 'x' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('empty array with one comma', {
          code: 'for (let [,] = x;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id: { type: 'ArrayPattern', elements: [ null ] },
                      init: { type: 'Identifier', name: 'x' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('empty array with double comma', {
          code: 'for (let [,,] = x;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id: { type: 'ArrayPattern', elements: [ null, null ] },
                      init: { type: 'Identifier', name: 'x' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('with one var, no init, semi', {
          code: 'for (let [foo] = arr;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements: [ { type: 'Identifier', name: 'foo' } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('trailing comma is insignificant', {
          code: 'for (let [foo,] = arr;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements: [ { type: 'Identifier', name: 'foo' } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double trailing comma is significant', {
          code: 'for (let [foo,,] = arr;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements: [ { type: 'Identifier', name: 'foo' }, null ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('leading comma', {
          code: 'for (let [,foo] = arr;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements: [ null, { type: 'Identifier', name: 'foo' } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double leading comma', {
          code: 'for (let [,,foo] = arr;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements: [ null, null, { type: 'Identifier', name: 'foo' } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('two vars', {
          code: 'for (let [foo,bar] = arr;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements:
                          [ { type: 'Identifier', name: 'foo' },
                            { type: 'Identifier', name: 'bar' } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('two vars with eliding comma', {
          code: 'for (let [foo,,bar] = arr;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements:
                          [ { type: 'Identifier', name: 'foo' },
                            null,
                            { type: 'Identifier', name: 'bar' } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double destruct', {
          code: 'for (let [foo] = arr, [bar] = arr2;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements: [ { type: 'Identifier', name: 'foo' } ] },
                      init: { type: 'Identifier', name: 'arr' } },
                      { type: 'VariableDeclarator',
                        id:
                        { type: 'ArrayPattern',
                          elements: [ { type: 'Identifier', name: 'bar' } ] },
                        init: { type: 'Identifier', name: 'arr2' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('destruct and non-destruct without init', {
          code: 'for (let [foo] = arr, bar;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements: [ { type: 'Identifier', name: 'foo' } ] },
                      init: { type: 'Identifier', name: 'arr' } },
                      { type: 'VariableDeclarator',
                        id: { type: 'Identifier', name: 'bar' },
                        init: null } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('destruct and non-destruct with init', {
          code: 'for (let [foo] = arr, bar = arr2;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements: [ { type: 'Identifier', name: 'foo' } ] },
                      init: { type: 'Identifier', name: 'arr' } },
                      { type: 'VariableDeclarator',
                        id: { type: 'Identifier', name: 'bar' },
                        init: { type: 'Identifier', name: 'arr2' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('non-destruct without init and destruct', {
          code: 'for (let foo, [bar] = arr2;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id: { type: 'Identifier', name: 'foo' },
                      init: null },
                      { type: 'VariableDeclarator',
                        id:
                        { type: 'ArrayPattern',
                          elements: [ { type: 'Identifier', name: 'bar' } ] },
                        init: { type: 'Identifier', name: 'arr2' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('non-destruct with init and destruct', {
          code: 'for (let foo = arr, [bar] = arr2;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id: { type: 'Identifier', name: 'foo' },
                      init: { type: 'Identifier', name: 'arr' } },
                      { type: 'VariableDeclarator',
                        id:
                        { type: 'ArrayPattern',
                          elements: [ { type: 'Identifier', name: 'bar' } ] },
                        init: { type: 'Identifier', name: 'arr2' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('one var with initializer', {
          code: 'for (let [foo=a] = arr;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements:
                          [ { type: 'AssignmentPattern',
                            left: { type: 'Identifier', name: 'foo' },
                            right: { type: 'Identifier', name: 'a' } } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('two vars, with and without initializer', {
          code: 'for (let [foo=a, bar] = arr;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements:
                          [ { type: 'AssignmentPattern',
                            left: { type: 'Identifier', name: 'foo' },
                            right: { type: 'Identifier', name: 'a' } },
                            { type: 'Identifier', name: 'bar' } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('two vars, without and with initializer', {
          code: 'for (let [foo, bar=b] = arr;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements:
                          [ { type: 'Identifier', name: 'foo' },
                            { type: 'AssignmentPattern',
                              left: { type: 'Identifier', name: 'bar' },
                              right: { type: 'Identifier', name: 'b' } } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('two vars, without and with initializer', {
          code: 'for (let [foo=a, bar=b] = arr;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements:
                          [ { type: 'AssignmentPattern',
                            left: { type: 'Identifier', name: 'foo' },
                            right: { type: 'Identifier', name: 'a' } },
                            { type: 'AssignmentPattern',
                              left: { type: 'Identifier', name: 'bar' },
                              right: { type: 'Identifier', name: 'b' } } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('no assignment without init', {
          code: 'for (let [foo];;);',
          throws: 'without an assignment',
          desc: 'this could be legal in sloppy except not at the start of a statement',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('no assignment with init', {
          code: 'for (let [foo = x];;);',
          throws: 'without an assignment',
          desc: 'this could be legal in sloppy except not at the start of a statement',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('no assignment with two declarations first', {
          code: 'for (let [foo], bar;;);',
          throws: 'without an assignment',
          desc: 'just like `foo[bar],baz` which is a fine expression in sloppy mode, except that it is still illegal',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('no assignment with two declarations second', {
          code: 'for (let foo, [bar];;);',
          throws: 'without an assignment',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
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
          code: 'for (let {foo} = arr;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties: [ { type: 'Identifier', name: 'foo' } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('let, destructuring obj with shorthand and trailing comma, no init, semi', {
          code: 'for (let {foo,} = arr;;);',
          ast: { type: 'Program',
            body:
              [ { type: 'ForStatement',
                init:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties: [ { type: 'Identifier', name: 'foo' } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });
    });
  });

  describe('in export decl', _ => {

    // not an extensive test suite here since it's always strict mode and uses the same parsing mechanisms

    describe('regular vars', _ => {

      test('let, one var, no init, semi',{
        code: 'export let foo;',
        SCRIPT: {throws: 'module goal'},
        ast: { type: 'Program',
          body:
            [ { type: 'ExportNamedDeclaration',
              specifiers: [],
              declaration:
              { type: 'VariableDeclaration',
                kind: 'let',
                declarations:
                  [ { type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'foo' },
                    init: null } ] },
              source: null } ] },
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR],
      });

      test('let, two vars, no init, semi',{
        code: 'export let foo, bar;',
        SCRIPT: {throws: 'module goal'},
        ast: { type: 'Program',
          body:
            [ { type: 'ExportNamedDeclaration',
              specifiers: [],
              declaration:
              { type: 'VariableDeclaration',
                kind: 'let',
                declarations:
                  [ { type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'foo' },
                    init: null },
                    { type: 'VariableDeclarator',
                      id: { type: 'Identifier', name: 'bar' },
                      init: null } ] },
              source: null } ] },
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('let, var with init, semi',{
        code: 'export let foo = bar;',
        SCRIPT: {throws: 'module goal'},
        ast: { type: 'Program',
          body:
            [ { type: 'ExportNamedDeclaration',
              specifiers: [],
              declaration:
              { type: 'VariableDeclaration',
                kind: 'let',
                declarations:
                  [ { type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'foo' },
                    init: { type: 'Identifier', name: 'bar' } } ] },
              source: null } ] },
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('let, two vars with both init, semi',{
        code: 'export let foo = bar, zoo = boo;',
        SCRIPT: {throws: 'module goal'},
        ast: { type: 'Program',
          body:
            [ { type: 'ExportNamedDeclaration',
              specifiers: [],
              declaration:
              { type: 'VariableDeclaration',
                kind: 'let',
                declarations:
                  [ { type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'foo' },
                    init: { type: 'Identifier', name: 'bar' } },
                    { type: 'VariableDeclarator',
                      id: { type: 'Identifier', name: 'zoo' },
                      init: { type: 'Identifier', name: 'boo' } } ] },
              source: null } ] },
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('let on next line does not trigger asi', {
        code: 'export\nlet foo',
        SCRIPT: {throws: 'module goal'},
        ast: { type: 'Program',
          body:
            [ { type: 'ExportNamedDeclaration',
              specifiers: [],
              declaration:
              { type: 'VariableDeclaration',
                kind: 'let',
                declarations:
                  [ { type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'foo' },
                    init: null } ] },
              source: null } ] },
        tokens: [$IDENT, $IDENT, $IDENT, $ASI],
      });

      test('var on next line does not trigger asi', {
        code: 'export let\nfoo',
        SCRIPT: {throws: 'module goal'},
        ast: { type: 'Program',
          body:
            [ { type: 'ExportNamedDeclaration',
              specifiers: [],
              declaration:
              { type: 'VariableDeclaration',
                kind: 'let',
                declarations:
                  [ { type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'foo' },
                    init: null } ] },
              source: null } ] },
        tokens: [$IDENT, $IDENT, $IDENT, $ASI],
      });

      test('asi can not trigger if next token is ident', {
        code: 'export let\nfoo()',
        SCRIPT: {throws: 'module goal'},
        throws: 'ASI',
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
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

        test('empty "array" should work even if that does not export anything', {
          code: 'export let [] = x;',
          SCRIPT: {throws: 'module goal'},
          ast: { type: 'Program',
            body:
              [ { type: 'ExportNamedDeclaration',
                specifiers: [],
                declaration:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id: { type: 'ArrayPattern', elements: [] },
                      init: { type: 'Identifier', name: 'x' } } ] },
                source: null } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('with one var, no init, semi', {
          code: 'export let [foo] = arr;',
          SCRIPT: {throws: 'module goal'},
          ast: { type: 'Program',
            body:
              [ { type: 'ExportNamedDeclaration',
                specifiers: [],
                declaration:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements: [ { type: 'Identifier', name: 'foo' } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                source: null } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('double trailing comma is significant', {
          code: 'export let [foo,,] = arr;',
          SCRIPT: {throws: 'module goal'},
          ast: { type: 'Program',
            body:
              [ { type: 'ExportNamedDeclaration',
                specifiers: [],
                declaration:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements: [ { type: 'Identifier', name: 'foo' }, null ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                source: null } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('two vars', {
          code: 'export let [foo,bar] = arr;',
          SCRIPT: {throws: 'module goal'},
          ast: { type: 'Program',
            body:
              [ { type: 'ExportNamedDeclaration',
                specifiers: [],
                declaration:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements:
                          [ { type: 'Identifier', name: 'foo' },
                            { type: 'Identifier', name: 'bar' } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                source: null } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('double destruct', {
          code: 'export let [foo] = arr, [bar] = arr2;',
          SCRIPT: {throws: 'module goal'},
          ast: { type: 'Program',
            body:
              [ { type: 'ExportNamedDeclaration',
                specifiers: [],
                declaration:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements: [ { type: 'Identifier', name: 'foo' } ] },
                      init: { type: 'Identifier', name: 'arr' } },
                      { type: 'VariableDeclarator',
                        id:
                        { type: 'ArrayPattern',
                          elements: [ { type: 'Identifier', name: 'bar' } ] },
                        init: { type: 'Identifier', name: 'arr2' } } ] },
                source: null } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('two vars, with and without initializer', {
          code: 'export let [foo=a, bar] = arr;',
          SCRIPT: {throws: 'module goal'},
          ast: { type: 'Program',
            body:
              [ { type: 'ExportNamedDeclaration',
                specifiers: [],
                declaration:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ArrayPattern',
                        elements:
                          [ { type: 'AssignmentPattern',
                            left: { type: 'Identifier', name: 'foo' },
                            right: { type: 'Identifier', name: 'a' } },
                            { type: 'Identifier', name: 'bar' } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                source: null } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('no assignment without init', {
          code: 'export let [foo];',
          SCRIPT: {throws: 'module goal'},
          throws: 'without an assignment',
          desc: 'module goal is always strict',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('no assignment with init', {
          code: 'export let [foo = x];',
          SCRIPT: {throws: 'module goal'},
          throws: 'without an assignment',
          desc: 'module goal is always strict',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('no assignment with two declarations first', {
          code: 'export let [foo], bar;',
          SCRIPT: {throws: 'module goal'},
          throws: 'without an assignment',
          desc: 'module goal is always strict',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('no assignment with two declarations second', {
          code: 'export let foo, [bar];',
          SCRIPT: {throws: 'module goal'},
          throws: 'without an assignment',
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
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
          code: 'export let {foo} = arr;',
          SCRIPT: {throws: 'module goal'},
          ast: { type: 'Program',
            body:
              [ { type: 'ExportNamedDeclaration',
                specifiers: [],
                declaration:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties: [ { type: 'Identifier', name: 'foo' } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                source: null } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('let, destructuring obj with shorthand and trailing comma, no init, semi', {
          code: 'export let {foo,} = arr;',
          SCRIPT: {throws: 'module goal'},
          ast: { type: 'Program',
            body:
              [ { type: 'ExportNamedDeclaration',
                specifiers: [],
                declaration:
                { type: 'VariableDeclaration',
                  kind: 'let',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties: [ { type: 'Identifier', name: 'foo' } ] },
                      init: { type: 'Identifier', name: 'arr' } } ] },
                source: null } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });
      });
    });
  });

  describe('let as identifier in sloppy mode', _ => {

    // (note: the spec doesn't explicitly allow `let` as a var name but rather forbids
    // it under certain situations. For example: in strict mode and as let/const names)

    describe('let as var name', _ => {

      describe('in global', _ => {

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

        test('let as let name is illegal', {
          code: 'let let;',
          throws: 'when binding through',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR],
        });

        test('let let does not get asi', {
          code: 'let\nlet;',
          throws: 'when binding through',
          desc: 'and `let` is always an illegal name for const/let bindings',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR],
        });

        test('let as name in destructuring is always illegal', {
          code: 'let [let] = x;',
          throws: 'when binding through',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR],
        });

        test('cannot const let', {
          code: 'const let',
          throws: 'when binding through',
          tokens: [$IDENT, $IDENT, $ASI],
        });

        test('just let', {
          code: 'let',
          throws: true,
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [{
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'let'}
              }]
            },
          },
          tokens: [$IDENT, $ASI],
        });

        test('let with semi', {
          code: 'let;',
          throws: true,
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [{
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'let'}
              }]
            },
          },
          tokens: [$IDENT, $PUNCTUATOR],
        });

        test('prop access as expr stmt', {
          code: 'let.foo;',
          throws: 'Missing ident or destructuring',
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [{
                type: 'ExpressionStatement',
                expression: {
                  type: 'MemberExpression',
                  object: {type: 'Identifier', name: 'let'},
                  property: {type: 'Identifier', name: 'foo'},
                  computed: false,
                },
              }],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('call as expr stmt', {
          code: 'let();',
          throws: 'Missing ident or destructuring',
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [{
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'let'},
                  arguments: [],
                },
              }],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('in for-loop-header', _ => {

        test('var decl', {
          code: 'for (var let;;);',
          throws: 'var name in strict',
          SLOPPY_SCRIPT: {
            desc: 'let as a var name is only allowed in (non-module) sloppy mode to support pre-es6-code',
            ast: {
              type: 'Program',
              body: [{
                type: 'ForStatement',
                init: {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {type: 'Identifier', name: 'let'},
                    init: null,
                  }],
                },
                test: null,
                update: null,
                body: {type: 'EmptyStatement'},
              }],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('let as let name is illegal', {
          code: 'for (let let;;);',
          throws: 'when binding through',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('let let does not get asi', {
          code: 'for (let\nlet;;);',
          throws: 'when binding through',
          desc: 'and `let` is always an illegal name for const/let bindings',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('let as name in destructuring is always illegal', {
          code: 'for (let [let] = x;;);',
          throws: 'when binding through',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('cannot const let', {
          code: 'for (const let;;);',
          throws: 'when binding through',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('just let', {
          code: 'for (let;;);',
          throws: true,
          SLOPPY_SCRIPT: {
            ast: { type: 'Program',
              body:
                [ { type: 'ForStatement',
                  init: { type: 'Identifier', name: 'let' },
                  test: null,
                  update: null,
                  body: { type: 'EmptyStatement' } } ] },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('let in part 2', {
          code: 'for (;let;);',
          throws: true,
          SLOPPY_SCRIPT: {
            ast: { type: 'Program',
              body:
                [ { type: 'ForStatement',
                  init: null,
                  test: { type: 'Identifier', name: 'let' },
                  update: null,
                  body: { type: 'EmptyStatement' } } ] },
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('let in part 3', {
          code: 'for (;let;);',
          throws: true,
          SLOPPY_SCRIPT: {
            ast:  { type: 'Program',
              body:
                [ { type: 'ForStatement',
                  init: null,
                  test: { type: 'Identifier', name: 'let' },
                  update: null,
                  body: { type: 'EmptyStatement' } } ] },
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('prop access as expr stmt', {
          code: 'for (let.foo;;);',
          throws: 'Missing ident or destructuring',
          SLOPPY_SCRIPT: {
            ast: { type: 'Program',
              body:
                [ { type: 'ForStatement',
                  init:
                  { type: 'MemberExpression',
                    object: { type: 'Identifier', name: 'let' },
                    property: { type: 'Identifier', name: 'foo' },
                    computed: false },
                  test: null,
                  update: null,
                  body: { type: 'EmptyStatement' } } ] },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('call as expr stmt', {
          code: 'for (let();;);',
          throws: 'Missing ident or destructuring',
          SLOPPY_SCRIPT: {
            ast: { type: 'Program',
              body:
                [ { type: 'ForStatement',
                  init:
                  { type: 'CallExpression',
                    callee: { type: 'Identifier', name: 'let' },
                    arguments: [] },
                  test: null,
                  update: null,
                  body: { type: 'EmptyStatement' } } ] },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('in export decl (always strict mode)', _ => {

        test('var decl', {
          code: 'export var let;',
          throws: true,
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('let as let name is illegal', {
          code: 'export let let;',
          throws: true,
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('let let does not get asi', {
          code: 'export let\nlet;',
          throws: true,
          desc: 'and `let` is always an illegal name for const/let bindings',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('let as name in destructuring is always illegal', {
          code: 'export let [let] = x;',
          throws: true,
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('cannot const let', {
          code: 'export const let;',
          throws: true,
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('just let', {
          code: 'export let;',
          throws: true,
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('prop access as expr stmt', {
          code: 'export let.foo;',
          throws: true,
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('call as expr stmt', {
          code: 'export let();',
          throws: true,
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
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

        test('proper case with confusing newline', {
          code: 'let\n[x] = x;',
          ast: {type: 'Program', body: [{
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [{
              type: 'VariableDeclarator',
              id: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'x'}]},
              init: {type: 'Identifier', name: 'x'},
            }],
          }]},
          desc: 'asi is only applied when the next token would lead to parse error; in this case the [ does not so it cannot parse this as prop-access',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('proper case with less confusing newline', {
          code: 'let [x]\n= x;',
          ast: {type: 'Program', body: [{
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [{
              type: 'VariableDeclarator',
              id: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'x'}]},
              init: {type: 'Identifier', name: 'x'},
            }],
          }]},
          desc: 'I think this is less confusing and not a super important test',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('bad confusing newline', {
          code: 'let\n[foo];',
          throws: 'without an assignment',
          desc: 'the newline is confusing here but since the whole thing could be a valid destructuring the token is not an error itself and by the time the parser realizes it is the ASI is not applied retroactively',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('in for-loop-header', {
          code: 'for (let[foo];;);',
          throws: 'without an assignment',
          tokens: [],
        });

        test('in regular function', {
          code: 'function f(){ let[foo]; }',
          throws: 'without an assignment',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
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

    describe('let asi block', _ => {

      describe('illegal ambiguous cases', _ => {

        // While the spec doesn't mention it explicitly, I'm pretty sure the let-asi-block
        // is illegal since it's equally ambigous as let-dynamic-prop.
        // https://tc39.github.io/ecma262/#prod-ExpressionStatement

        test('in global', {
          code: 'let\n{foo};',
          throws: 'without an assignment',
          tokens: [],
        });

        test('proper case with confusing newline', {
          code: 'let\n{x} = x;',
          ast: {type: 'Program', body: [{
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [{
              type: 'VariableDeclarator',
              id: {type: 'ObjectPattern', properties: [{type: 'Identifier', name: 'x'}]},
              init: {type: 'Identifier', name: 'x'},
            }],
          }]},
          desc: 'asi is only applied when the next token would lead to parse error; in this case the [ does not so it cannot parse this as prop-access',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('proper case with less confusing newline', {
          code: 'let {x}\n= x;',
          ast: {type: 'Program', body: [{
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [{
              type: 'VariableDeclarator',
              id: {type: 'ObjectPattern', properties: [{type: 'Identifier', name: 'x'}]},
              init: {type: 'Identifier', name: 'x'},
            }],
          }]},
          desc: 'I think this is less confusing and not a super important test',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('in regular function', {
          code: 'function f(){ let\n{foo}; }',
          throws: 'without an assignment',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('in arrow expr body', {
          code: '_ => let\n{foo};',
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
                  body: {type: 'Identifier', name: 'let'},
                },
              }, {
                type: 'BlockStatement',
                body: [{
                  type: 'ExpressionStatement',
                  expression: {type: 'Identifier', name: 'foo'}
                }]
              }, {
                type: 'EmptyStatement',
              }],
            },
          },
          desc: 'mirror case for array destruct, this version is should be fine because the body is an expression so the let would never be parsed as a decl, the curlies always a block',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('in arrow expr body', {
          code: '_ => let {foo};',
          throws: 'strict mode',
          SLOPPY_SCRIPT: {
            throws: 'ASI',
          },
          desc: 'mirror case for array destruct, this version is interesting because it cannot parse a let decl here',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('in arrow stmt body', {
          code: '_ => { let\n{foo}; }',
          throws: 'without an assignment',
          desc: '(arrows are not strict by default) the non-block arrow body is a statement block',
          tokens: [],
        });

        test('in classes', {
          code: 'class x { foo() { let\n{foo}; }}',
          throws: 'without an assignment',
          tokens: [],
          desc: 'classes are implicitly always strict',
        });
      });
    });

    describe('as a label', _ => {

      test('in global', {
        code: 'let: foo;',
        throws: 'Missing ident or destructuring',
        SLOPPY_SCRIPT: {
          ast: { type: 'Program',
            body:
              [ { type: 'LabeledStatement',
                label: { type: 'Identifier', name: 'let' },
                body:
                { type: 'ExpressionStatement',
                  expression: { type: 'Identifier', name: 'foo' } } } ] },
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR ],
      });

      test('in function', {
        code: 'function f(){ let: foo; }',
        throws: 'Missing ident or destructuring',
        SLOPPY_SCRIPT: {
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params: [],
                body:
                { type: 'BlockStatement',
                  body:
                    [ { type: 'LabeledStatement',
                      label: { type: 'Identifier', name: 'let' },
                      body:
                      { type: 'ExpressionStatement',
                        expression: { type: 'Identifier', name: 'foo' } } } ] } } ] },
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('as continue arg', {
        code: 'while (true) let: continue let;',
        throws: 'Missing ident or destructuring',
        SLOPPY_SCRIPT: {
          ast: { type: 'Program',
            body:
              [ { type: 'WhileStatement',
                test: { type: 'Literal', value: true, raw: 'true' },
                body:
                { type: 'LabeledStatement',
                  label: { type: 'Identifier', name: 'let' },
                  body:
                  { type: 'ContinueStatement',
                    label: { type: 'Identifier', name: 'let' } } } } ] },
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR],
      });

      test('as sub-statement statement', {
        code: 'if (x) let: y;',
        throws: 'Missing ident or destructuring',
        SLOPPY_SCRIPT: {
          ast: { type: 'Program',
            body:
              [ { type: 'IfStatement',
                test: { type: 'Identifier', name: 'x' },
                consequent:
                { type: 'LabeledStatement',
                  label: { type: 'Identifier', name: 'let' },
                  body:
                  { type: 'ExpressionStatement',
                    expression: { type: 'Identifier', name: 'y' } } },
                alternate: null } ] },
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('as nested label', {
        code: 'foo: let: y;',
        throws: 'Missing ident or destructuring',
        SLOPPY_SCRIPT: {
          ast: { type: 'Program',
            body:
              [ { type: 'LabeledStatement',
                label: { type: 'Identifier', name: 'foo' },
                body:
                { type: 'LabeledStatement',
                  label: { type: 'Identifier', name: 'let' },
                  body:
                  { type: 'ExpressionStatement',
                    expression: { type: 'Identifier', name: 'y' } } } } ] },
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('as continue arg', {
        code: 'while (true) let: continue let;',
        throws: 'Missing ident or destructuring',
        SLOPPY_SCRIPT: {
          ast: { type: 'Program',
            body:
              [ { type: 'WhileStatement',
                test: { type: 'Literal', value: true, raw: 'true' },
                body:
                { type: 'LabeledStatement',
                  label: { type: 'Identifier', name: 'let' },
                  body:
                  { type: 'ContinueStatement',
                    label: { type: 'Identifier', name: 'let' } } } } ] },
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR],
      });

      test('in arrow', {
        code: '_ => { let: foo; }',
        throws: 'Missing ident or destructuring',
        SLOPPY_SCRIPT: {
          ast: { type: 'Program',
            body:
              [ { type: 'ExpressionStatement',
                expression:
                { type: 'ArrowFunctionExpression',
                  params: [ { type: 'Identifier', name: '_' } ],
                  id: null,
                  generator: false,
                  async: false,
                  expression: false,
                  body:
                  { type: 'BlockStatement',
                    body:
                      [ { type: 'LabeledStatement',
                        label: { type: 'Identifier', name: 'let' },
                        body:
                        { type: 'ExpressionStatement',
                          expression: { type: 'Identifier', name: 'foo' } } } ] } } } ] },
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('as label and var name', {
        code: 'let: let;',
        throws: 'Missing ident or destructuring',
        SLOPPY_SCRIPT: {
          ast: { type: 'Program',
            body:
              [ { type: 'LabeledStatement',
                label: { type: 'Identifier', name: 'let' },
                body:
                { type: 'ExpressionStatement',
                  expression: { type: 'Identifier', name: 'let' } } } ] },
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
    });
  });
});
