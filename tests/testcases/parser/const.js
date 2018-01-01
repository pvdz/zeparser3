let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
  } = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('let statement', _ => {

  describe('binding generic', _ => {

    // note: this test-group mirrors those in `let` with "let" replaced to "const" since they share the same rules

    // for destructuring, these are the array pattern tests to check for all places where we'd want to check it:
    // const [] = x;
    // const [,] = x;
    // const [,,] = x;
    // const [foo] = x;
    // const [foo,] = x;
    // const [foo,,] = x;
    // const [,foo] = x;
    // const [,,foo] = x;
    // const [foo,bar] = x;
    // const [foo,,bar] = x;
    // const [foo] = x, [foo] = y;
    // const [foo] = x, b;
    // const [foo] = x, b = y;
    // const x, [foo] = y;
    // const x = y, [foo] = z;
    // const [foo=a] = c;
    // const [foo=a,bar] = x;
    // const [foo,bar=b] = x;
    // const [foo=a,bar=b] = x;
    // const [foo];                 // error
    // const [foo=a];               // error
    // const [foo], bar;            // error
    // const foo, [bar];            // error
    // const [...bar] = obj;
    // const [foo, ...bar] = obj;
    // const [...foo, bar] = obj;   // error
    // const [...foo,] = obj;       // ok!
    // const [...foo,,] = obj;      // error
    // const [...[a, b]] = obj;
    // const [...[a, b],] = obj;    // ok!
    // const [...[a, b],,] = obj;   // error
    // const [x, ...[a, b]] = obj;
    // const [...bar = foo] = obj;  // error (TODO: except in funcs, arrows, and maybe `for`?)
    // const [... ...foo] = obj;    // error
    // const [...] = obj;           // error
    // const [...,] = obj;          // error
    // const [.x] = obj;            // error
    // const [..x] = obj;           // error

    // and these are the object versions:
    // const {} = x;
    // const {,} = x;             // error
    // const {,,} = x;            // error
    // const {foo} = x;
    // const {foo,} = x;          // ok
    // const {foo,,} = x;         // error
    // const {,foo} = x;          // error
    // const {,,foo} = x;         // error
    // const {foo,bar} = x;
    // const {foo,,bar} = x;      // error
    // const {foo} = x, {foo} = y;
    // const {foo} = x, b;
    // const {foo} = x, b = y;
    // const x, {foo} = y;
    // const x = y, {foo} = z;
    // const {foo=a} = x;
    // const {foo=a,bar} = x;
    // const {foo,bar=b} = x;
    // const {foo=a,bar=b} = x;
    // const {foo:a} = x;
    // const {foo:a,bar} = x;
    // const {foo,bar:b} = x;
    // const {foo:a,bar:b} = x;
    // const {foo:a,bar:b} = x;
    // const {foo:a=b} = x;
    // const {foo:a=b, bar:c=d} = x;
    // const {foo};
    // const {foo=a};
    // const {foo:a};
    // const {foo:a=b};
    // const {foo}, bar;
    // const foo, {bar};

    // All variations of tests are executed for statement start, inside for-headers (4x), and in export declaration
    // When new syntax is introduced that allows let/const binding syntax those variations should apply to them as well

    describe('as a statement', _ => {

      describe('regular vars', _ => {

        test('const, one var, no init, semi',{
          code: 'const foo;',
          ast: {type: 'Program', body: [
            {type: 'VariableDeclaration', kind: 'const', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
            ]},
          ]},
          tokens: [$IDENT, $IDENT, $PUNCTUATOR],
        });

        test('const, one var, no init, eof',{
          code: 'const foo',
          ast: {type: 'Program', body: [
            {type: 'VariableDeclaration', kind: 'const', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
            ]}
          ]},
          tokens: [$IDENT, $IDENT, $ASI],
        });

        test('const, two vars, no init, semi',{
          code: 'const foo, bar;',
          ast: {type: 'Program', body: [
            {type: 'VariableDeclaration', kind: 'const', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
            ]},
          ]},
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('const, two vars, no init, eof',{
          code: 'const foo, bar',
          ast: {type: 'Program', body: [
            {type: 'VariableDeclaration', kind: 'const', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
            ]},
          ]},
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('const, var with init, semi',{
          code: 'const foo = bar;',
          ast: {type: 'Program', body: [
            {type: 'VariableDeclaration', kind: 'const', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
            ]},
          ]},
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('const, var with init, eof',{
          code: 'const foo = bar',
          ast: {type: 'Program', body: [
            {type: 'VariableDeclaration', kind: 'const', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
            ]},
          ]},
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('const, var with init, asi',{
          code: 'const foo = bar\nconst zoo;',
          ast: {type: 'Program', body: [
            {type: 'VariableDeclaration', kind: 'const', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
            ]},
            {type: 'VariableDeclaration', kind: 'const', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: null},
            ]},
          ]},
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR],
        });

        test('const, two vars with both init, semi',{
          code: 'const foo = bar, zoo = boo;',
          ast: {type: 'Program', body: [
            {type: 'VariableDeclaration', kind: 'const', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
            ]},
          ]},
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('const, two vars with both init, asi',{
          code: 'const foo = bar, zoo = boo',
          ast: {type: 'Program', body: [
            {type: 'VariableDeclaration', kind: 'const', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
            ]},
          ]},
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('var on next line does not trigger asi', {
          code: 'const\nfoo',
          ast: {
            type: 'Program',
            body: [{
              type: 'VariableDeclaration',
              kind: 'const',
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
          code: 'const\nfoo()',
          throws: 'ASI',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });
      });

      describe('destructuring', _ => {

        describe('array', _ => {

          test('empty "array" should work', {
            code: 'const [] = x;',
            ast: {type: 'Program', body: [{
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [{
                type: 'VariableDeclarator',
                id: {type: 'ArrayPattern', elements: []},
                init: {type: 'Identifier', name: 'x'},
              }],
            }]},
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('empty array with one comma', {
            code: 'const [,] = x;',
            ast: {type: 'Program', body: [{
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [{
                type: 'VariableDeclarator',
                id: {type: 'ArrayPattern', elements: [null]},
                init: {type: 'Identifier', name: 'x'},
              }],
            }]},
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('empty array with double comma', {
            code: 'const [,,] = x;',
            ast: {type: 'Program', body: [{
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [{
                type: 'VariableDeclarator',
                id: {type: 'ArrayPattern', elements: [null, null]},
                init: {type: 'Identifier', name: 'x'},
              }],
            }]},
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('with one var, no init, semi', {
            code: 'const [foo] = arr;',
            ast: {type: 'Program', body: [
              {type: 'VariableDeclaration', kind: 'const', declarations: [
                {type: 'VariableDeclarator', id: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'foo'}]}, init: {type: 'Identifier', name: 'arr'}},
              ]},
            ]},
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('trailing comma is insignificant', {
            code: 'const [foo,] = arr;',
            ast: {type: 'Program', body: [{type: 'VariableDeclaration', kind: 'const', declarations: [{
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
            code: 'const [foo,,] = arr;',
            ast: {type: 'Program', body: [{type: 'VariableDeclaration', kind: 'const', declarations: [{
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
            code: 'const [,foo] = arr;',
            ast: {type: 'Program', body: [{type: 'VariableDeclaration', kind: 'const', declarations: [{
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
            code: 'const [,,foo] = arr;',
            ast: {type: 'Program', body: [
              {type: 'VariableDeclaration', kind: 'const', declarations: [
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
            code: 'const [foo,bar] = arr;',
            ast: {type: 'Program', body: [{type: 'VariableDeclaration', kind: 'const', declarations: [{
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
            code: 'const [foo,,bar] = arr;',
            ast: {type: 'Program', body: [{type: 'VariableDeclaration', kind: 'const', declarations: [{
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
            code: 'const [foo] = arr, [bar] = arr2;',
            ast: {type: 'Program', body: [{
              type: 'VariableDeclaration',
              kind: 'const',
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
            code: 'const [foo] = arr, bar;',
            ast: {type: 'Program', body: [{
              type: 'VariableDeclaration',
              kind: 'const',
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
            code: 'const [foo] = arr, bar = arr2;',
            ast: {type: 'Program', body: [{
              type: 'VariableDeclaration',
              kind: 'const',
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
            code: 'const foo, [bar] = arr2;',
            ast: {type: 'Program', body: [{
              type: 'VariableDeclaration',
              kind: 'const',
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
            code: 'const foo = arr, [bar] = arr2;',
            ast: {type: 'Program', body: [{
              type: 'VariableDeclaration',
              kind: 'const',
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
            code: 'const [foo=a] = arr;',
            ast: {type: 'Program', body: [{
              type: 'VariableDeclaration',
              kind: 'const',
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
            code: 'const [foo=a, bar] = arr;',
            ast: {type: 'Program', body: [{
              type: 'VariableDeclaration',
              kind: 'const',
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
            code: 'const [foo, bar=b] = arr;',
            ast: {type: 'Program', body: [{
              type: 'VariableDeclaration',
              kind: 'const',
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
            code: 'const [foo=a, bar=b] = arr;',
            ast: {type: 'Program', body: [{
              type: 'VariableDeclaration',
              kind: 'const',
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
            code: 'const [foo];',
            throws: 'without an assignment',
            desc: 'this could be legal in sloppy except not at the start of a statement',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('no assignment with init', {
            code: 'const [foo = x];',
            throws: 'without an assignment',
            desc: 'this could be legal in sloppy except not at the start of a statement',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('no assignment with two declarations first', {
            code: 'const [foo], bar;',
            throws: 'without an assignment',
            desc: 'just like `foo[bar],baz` which is a fine expression in sloppy mode, except that it is still illegal',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('no assignment with two declarations second', {
            code: 'const foo, [bar];',
            throws: 'without an assignment',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('cannot rename a var like obj destruct can', {
            code: 'const [foo:bar] = obj;',
            throws: 'Cannot rename',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          describe('rest operator', _ => {

            test('rest as the only destruct', {
              code: 'const [...foo] = obj;',
              ast: { type: 'Program',
                body:
                  [ { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ArrayPattern',
                          elements:
                            [ { type: 'RestElement',
                              argument: { type: 'Identifier', name: 'foo' } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] } ] },
              tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('rest preceded by an ident', {
              code: 'const [foo, ...bar] = obj;',
              ast: { type: 'Program',
                body:
                  [ { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ArrayPattern',
                          elements:
                            [ { type: 'Identifier', name: 'foo' },
                              { type: 'RestElement',
                                argument: { type: 'Identifier', name: 'bar' } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('rest followed by an ident', {
              code: 'const [...foo, bar] = obj;',
              throws: 'follow a spread',
              tokens: [],
            });

            test('rest followed by a trailing comma', {
              code: 'const [...foo,] = obj;',
              throws: 'follow a spread',
              desc: 'while feasible the syntax spec currently does not have a rule for allowing trailing commas after rest',
              tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('rest followed by two commas', {
              code: 'const [...foo,,] = obj;',
              throws: 'follow a spread',
              tokens: [],
            });

            test('rest on a nested destruct', {
              code: 'const [...[foo, bar]] = obj;',
              ast: { type: 'Program',
                body:
                  [ { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ArrayPattern',
                          elements:
                            [ { type: 'RestElement',
                              argument:
                              { type: 'ArrayPattern',
                                elements:
                                  [ { type: 'Identifier', name: 'foo' },
                                    { type: 'Identifier', name: 'bar' } ] } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] } ] },
              tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('trailing comma after rest on a nested destruct', {
              code: 'const [...[foo, bar],] = obj;',
              throws: 'follow a spread',
              tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double trailing comma after rest on a nested destruct', {
              code: 'const [...[foo, bar],,] = obj;',
              throws: 'follow a spread',
              tokens: [],
            });

            test('second param rest on a nested destruct', {
              code: 'const [x, ...[foo, bar]] = obj;',
              ast: { type: 'Program',
                body:
                  [ { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ArrayPattern',
                          elements:
                            [ { type: 'Identifier', name: 'x' },
                              { type: 'RestElement',
                                argument:
                                { type: 'ArrayPattern',
                                  elements:
                                    [ { type: 'Identifier', name: 'foo' },
                                      { type: 'Identifier', name: 'bar' } ] } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('spread with default', {
              code: 'const [...bar = foo] = obj;',
              throws: 'a rest value',
              desc: 'rest cannot get a default in var decls but they can as func args',
              tokens: [],
            });

            test('spread with default', {
              code: 'const [... ...foo] = obj;',
              throws: 'Can not spread twice',
              tokens: [],
            });

            test('spread with default', {
              code: 'const [...] = obj;',
              throws: 'missing an ident or destruct',
              tokens: [],
            });

            test('spread with default', {
              code: 'const [...,] = obj;',
              throws: 'missing an ident or destruct',
              tokens: [],
            });

            test('spread with default', {
              code: 'const [.x] = obj;',
              throws: 'Expecting nested ident or destructuring pattern',
              tokens: [],
            });

            test('spread with default', {
              code: 'const [..x] = obj;',
              throws: 'Expecting nested ident or destructuring pattern',
              tokens: [],
            });
          });
        });

        describe('object', _ => {

          test('empty obj', {
            code: 'const {} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id: { type: 'ObjectPattern', properties: [] },
                      init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('empty obj with trailing comma', {
            code: 'const {,} = obj;',
            throws: 'elided commas',
            desc: 'works for array but not for obj',
            tokens: [],
          });

          test('empty obj with elided commas', {
            code: 'const {,,} = obj;',
            throws: 'elided commas',
            desc: 'works for array but not for obj',
            tokens: [],
          });

          test('single var base case', {
            code: 'const {x} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value: { type: 'Identifier', name: 'x' } } ] },
                      init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single var with trailing comma', {
            code: 'const {x,} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value: { type: 'Identifier', name: 'x' } } ] },
                      init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single var with double trailing comma', {
            code: 'const {x,,} = obj;',
            throws: 'elided commas',
            desc: 'does not work with obj, only array',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single var with leading comma', {
            code: 'const {,x} = obj;',
            throws: 'elided commas',
            desc: 'works with array but not with obj',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single var with double leading comma', {
            code: 'const {,,x} = obj;',
            throws: 'elided commas',
            desc: 'works with array but not with obj',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double var simple', {
            code: 'const {x, y} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value: { type: 'Identifier', name: 'x' },
                          }, {
                            type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'y' },
                            value: { type: 'Identifier', name: 'y' },
                          } ] },
                      init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double var with double comma', {
            code: 'const {x,, y} = obj;',
            throws: 'elided commas',
            desc: 'works with array but not obj',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double var simple', {
            code: 'const {x} = a, {y} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value: { type: 'Identifier', name: 'x' } } ] },
                      init: { type: 'Identifier', name: 'a' } },
                      { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'y' },
                              value: { type: 'Identifier', name: 'y' } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('destruct and non-destruct with init', {
            code: 'const {x} = a, y = obj;',
            ast:  { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value: { type: 'Identifier', name: 'x' } } ] },
                      init: { type: 'Identifier', name: 'a' } },
                      { type: 'VariableDeclarator',
                        id: { type: 'Identifier', name: 'y' },
                        init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('destruct and non-destruct without init', {
            code: 'const {x} = a, obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value: { type: 'Identifier', name: 'x' } } ] },
                      init: { type: 'Identifier', name: 'a' } },
                      { type: 'VariableDeclarator',
                        id: { type: 'Identifier', name: 'obj' },
                        init: null } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('non-destruct with ini and destruct', {
            code: 'const x = a, {y} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id: { type: 'Identifier', name: 'x' },
                      init: { type: 'Identifier', name: 'a' } },
                      { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'y' },
                              value: { type: 'Identifier', name: 'y' } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('non-destruct without ini and destruct', {
            code: 'const x, {y} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id: { type: 'Identifier', name: 'x' },
                      init: null },
                      { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'y' },
                              value: { type: 'Identifier', name: 'y' } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct with init', {
            code: 'const {x = y} = obj;',
            ast: { type: 'Program', body: [{
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [{
                type: 'VariableDeclarator',
                id: {
                  type: 'ObjectPattern',
                  properties: [{
                    type: 'Property',
                    computed: false,
                    kind: 'init',
                    method: false,
                    shorthand: false,
                    key: {type: 'Identifier', name: 'x'},
                    value: {
                      type: 'AssignmentPattern',
                      left: {type: 'Identifier', name: 'x'},
                      right: {type: 'Identifier', name: 'y'},
                    },
                  }],
                },
                init: { type: 'Identifier', name: 'obj' },
              }],
            }]},
            desc: 'note: value gets the assignment pattern! not the objectpattern:properties',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct with and without init', {
            code: 'const {x = y, z} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value:
                            { type: 'AssignmentPattern',
                              left: { type: 'Identifier', name: 'x' },
                              right: { type: 'Identifier', name: 'y' } } },
                            { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'z' },
                              value: { type: 'Identifier', name: 'z' } } ] },
                      init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct without and with init', {
            code: 'const {x, y = z} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value: { type: 'Identifier', name: 'x' } },
                            { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'y' },
                              value:
                              { type: 'AssignmentPattern',
                                left: { type: 'Identifier', name: 'y' },
                                right: { type: 'Identifier', name: 'z' } } } ] },
                      init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct both with init', {
            code: 'const {x = y, z = a} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value:
                            { type: 'AssignmentPattern',
                              left: { type: 'Identifier', name: 'x' },
                              right: { type: 'Identifier', name: 'y' } } },
                            { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'z' },
                              value:
                              { type: 'AssignmentPattern',
                                left: { type: 'Identifier', name: 'z' },
                                right: { type: 'Identifier', name: 'a' } } } ] },
                      init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct with rename', {
            code: 'const {x : y} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value: { type: 'Identifier', name: 'y' } } ] },
                      init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct with and without rename', {
            code: 'const {x : y, z} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value: { type: 'Identifier', name: 'y' } },
                            { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'z' },
                              value: { type: 'Identifier', name: 'z' } } ] },
                      init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct without and with rename', {
            code: 'const {x, y : z} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value: { type: 'Identifier', name: 'x' } },
                            { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'y' },
                              value: { type: 'Identifier', name: 'z' } } ] },
                      init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct both with rename', {
            code: 'const {x : y, z : a} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value: { type: 'Identifier', name: 'y' }
                          }, {
                            type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'z' },
                            value: { type: 'Identifier', name: 'a' },
                          } ] },
                      init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct with rename and init', {
            code: 'const {x : y = z} = obj;',
            ast: {
              type: 'Program',
              body: [ {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [ {
                  type: 'VariableDeclarator',
                  id: { type: 'ObjectPattern',
                    properties: [ {
                      type: 'Property',
                      computed: false,
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      key: { type: 'Identifier', name: 'x' },
                      value: {
                        type: 'AssignmentPattern',
                        left: { type: 'Identifier', name: 'y' },
                        right: { type: 'Identifier', name: 'z' },
                      },
                    } ],
                  },
                  init: { type: 'Identifier', name: 'obj' },
                } ],
              } ],
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct with rename and init', {
            code: 'const {x : y, z, a : b = c} = obj;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value: { type: 'Identifier', name: 'y' } },
                            { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'z' },
                              value: { type: 'Identifier', name: 'z' } },
                            { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'a' },
                              value:
                              { type: 'AssignmentPattern',
                                left: { type: 'Identifier', name: 'b' },
                                right: { type: 'Identifier', name: 'c' } } } ] },
                      init: { type: 'Identifier', name: 'obj' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct no assignment', {
            code: 'const {x};',
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct no assignment', {
            code: 'const {x}, {y} = z;',
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('ident and destruct no assignment', {
            code: 'const x, {y};',
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('destruct no assignment and ident', {
            code: 'const {x}, y;',
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('ident with init and destruct no assignment', {
            code: 'const x = y, {z};',
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct with rename and no assignment', {
            code: 'const {x:y};',
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct with default and no assignment', {
            code: 'const {x=y};',
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct with rename and default and no assignment', {
            code: 'const {x:y=z};',
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct with rename and default and with and without assignment', {
            code: 'const {x:y=z} = obj, {a:b=c};',
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct with rename and default and without and with assignment', {
            code: 'const {x:y=z}, {a:b=c} = obj;',
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct with colon-eq', {
            code: 'const {a:=c} = z;',
            throws: 'must be an identifier',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('correct dynamic property destructuring', {
            code: 'const {[x]: y} = z;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: true,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value: { type: 'Identifier', name: 'y' } } ] },
                      init: { type: 'Identifier', name: 'z' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('dynamic property destructuring missing alias', {
            code: 'const {[x]} = z;',
            throws: '(:)',
            tokens: [],
          });

          test('dynamic property destructuring missing alias and init', {
            code: 'const {[x]};',
            throws: '(:)',
            tokens: [],
          });

          test('dynamic property destructuring missing assignment', {
            code: 'const {[x]: y};',
            throws: 'without an assignment',
            tokens: [],
          });

          test('dynamic property destructuring with default missing alias', {
            code: 'const {[x] = y} = z;',
            throws: '(:)',
            tokens: [],
          });

          test('dynamic property destructuring with default and alias missing init', {
            code: 'const {[x]: y = z};',
            throws: 'without an assignment',
            tokens: [],
          });

          test('correct dynamic property destructuring with default and alias', {
            code: 'const {[x]: y = z} = a;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: true,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'x' },
                            value:
                            { type: 'AssignmentPattern',
                              left: { type: 'Identifier', name: 'y' },
                              right: { type: 'Identifier', name: 'z' } } } ] },
                      init: { type: 'Identifier', name: 'a' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('dynamic prop as second prop', {
            code: 'const {a, [x]: y} = a;',
            ast: { type: 'Program',
              body:
                [ { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id:
                      { type: 'ObjectPattern',
                        properties:
                          [ { type: 'Property',
                            computed: false,
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            key: { type: 'Identifier', name: 'a' },
                            value: { type: 'Identifier', name: 'a' } },
                            { type: 'Property',
                              computed: true,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value: { type: 'Identifier', name: 'y' } } ] },
                      init: { type: 'Identifier', name: 'a' } } ] } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });
        });
      });
    });

    describe('in a for-header', _ => {

      describe('regular vars', _ => {

        describe('regular for-loop', _ => {

          test('const, one var, no init, semi',{
            code: 'for (const foo;;);',
            ast: {
              type: 'Program',
              body: [{
                type: 'ForStatement',
                init: {
                  type: 'VariableDeclaration',
                  kind: 'const',
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

          test('const, two vars, no init, semi',{
            code: 'for (const foo, bar;;);',
            ast: {
              type: 'Program',
              body: [{
                type: 'ForStatement',
                init: {
                  type: 'VariableDeclaration',
                  kind: 'const',
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

          test('const, var with init, semi',{
            code: 'for (const foo = bar;;);',
            ast: {
              type: 'Program',
              body: [{
                type: 'ForStatement',
                init: {
                  type: 'VariableDeclaration',
                  kind: 'const',
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

          test('const, two vars with both init, semi',{
            code: 'for (const foo = bar, zoo = boo;;);',
            ast: {
              type: 'Program',
              body: [{
                type: 'ForStatement',
                init: {
                  type: 'VariableDeclaration',
                  kind: 'const',
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
            code: 'for (const\nfoo;;);',
            ast: {
              type: 'Program',
              body: [{
                type: 'ForStatement',
                init: {
                  type: 'VariableDeclaration',
                  kind: 'const',
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
            code: 'for (const\nfoo();;);',
            throws: '(;)', // expecting for-header semi
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });
        });

        describe('invalid colorless for statement', _ => {

          test('const, one var, no init, semi', {
            code: 'for (const foo);',
            throws: 'Missing required initializer',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('const, two vars, no init, semi', {
            code: 'for (const foo, bar);',
            throws: 'Missing required initializer',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('const, var with init, semi', {
            code: 'for (const foo = bar);',
            throws: 'Missing required initializer',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('const, two vars with both init, semi', {
            code: 'for (const foo = bar, zoo = boo);',
            throws: 'Missing required initializer',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('var on next line does not trigger asi', {
            code: 'for (const\nfoo);',
            throws: 'Missing required initializer',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('asi can not trigger if next token is ident', {
            code: 'for (const\nfoo());',
            throws: '(;)', // expecting for-header semi
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });
        });

        describe('for-in', _ => {

          test('const, one var, no init, semi',{
            code: 'for (const foo in x);',
            ast: { type: 'Program',
              body:
                [ { type: 'ForInStatement',
                  left:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id: { type: 'Identifier', name: 'foo' },
                        init: null } ] },
                  right: { type: 'Identifier', name: 'x' },
                  body: { type: 'EmptyStatement' } } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('const, two vars, no init, semi',{
            code: 'for (const foo, bar in x);',
            throws: 'can only have one var binding',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('const, var with init, semi', {
            code: 'for (const foo = bar in x);',
            throws: 'Missing required initializer',
            desc: 'for some reason, it is not the "cannot have an init" one, probably because `in` is an op while `of` is not',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('const, two vars with both init, semi', {
            code: 'for (const foo = bar, zoo = boo in x);',
            throws: 'Missing required initializer',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('var on next line does not trigger asi', {
            code: 'for (const\nfoo in x);',
            ast: { type: 'Program',
              body:
                [ { type: 'ForInStatement',
                  left:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id: { type: 'Identifier', name: 'foo' },
                        init: null } ] },
                  right: { type: 'Identifier', name: 'x' },
                  body: { type: 'EmptyStatement' } } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('asi can not trigger if next token is ident', {
            code: 'for (const\nfoo() in x);',
            throws: '(;)', // expecting for-header semi
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });
        });

        describe('for-of', _ => {

          test('const, one var, no init, semi',{
            code: 'for (const foo of x);',
            ast: { type: 'Program',
              body:
                [ { type: 'ForOfStatement',
                  left:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id: { type: 'Identifier', name: 'foo' },
                        init: null } ] },
                  right: { type: 'Identifier', name: 'x' },
                  body: { type: 'EmptyStatement' } } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('const, two vars, no init, semi',{
            code: 'for (const foo, bar of x);',
            throws: 'can only have one var binding',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('const, var with init, semi',{
            code: 'for (const foo = bar of x);',
            throws: 'cannot have an init',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('const, two vars with both init, semi',{
            code: 'for (const foo = bar, zoo = boo of x);',
            throws: 'cannot have an init',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('var on next line does not trigger asi', {
            code: 'for (const\nfoo of x);',
            ast: { type: 'Program',
              body:
                [ { type: 'ForOfStatement',
                  left:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id: { type: 'Identifier', name: 'foo' },
                        init: null } ] },
                  right: { type: 'Identifier', name: 'x' },
                  body: { type: 'EmptyStatement' } } ] },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('asi can not trigger if next token is ident', {
            code: 'for (const\nfoo() of x);',
            throws: '(;)', // expecting for-header semi
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });
        });
      });

      describe('destructuring', _ => {

        // note: a for-header must use `in` or `of` for the assignment if and only if it
        //       concerns a for-in or for-of statement respectively. For a regular
        //       for-loop the assignment can still only be `=`.

        // note: all tests are mirrored between for-loop for-in and for-of to ensure
        //       they all work (this caught at least one bug by itself; they're staying)

        describe('regular for-loop', _ => {

          describe('array', _ => {

            test('empty "array" should work', {
              code: 'for (const [] = x;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [,] = x;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [,,] = x;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [foo] = arr;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [foo,] = arr;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [foo,,] = arr;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [,foo] = arr;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [,,foo] = arr;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [foo,bar] = arr;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [foo,,bar] = arr;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [foo] = arr, [bar] = arr2;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [foo] = arr, bar;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [foo] = arr, bar = arr2;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const foo, [bar] = arr2;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const foo = arr, [bar] = arr2;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [foo=a] = arr;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [foo=a, bar] = arr;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [foo, bar=b] = arr;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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

            test('two vars, with and with initializer', {
              code: 'for (const [foo=a, bar=b] = arr;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
              code: 'for (const [foo];;);',
              throws: 'In a for-header',
              desc: 'this could be legal in sloppy except not at the start of a statement',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment with init', {
              code: 'for (const [foo = x];;);',
              throws: 'In a for-header',
              desc: 'this could be legal in sloppy except not at the start of a statement',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment with two declarations first', {
              code: 'for (const [foo], bar;;);',
              throws: 'In a for-header',
              desc: 'just like `foo[bar],baz` which is a fine expression in sloppy mode, except that it is still illegal',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment with two declarations second', {
              code: 'for (const foo, [bar];;);',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            describe('rest operator', _ => {

              test('rest as the only destruct', {
                code: 'for (const [...foo] = obj;;);',
                ast: { type: 'Program',
                  body:
                    [ { type: 'ForStatement',
                      init:
                      { type: 'VariableDeclaration',
                        kind: 'const',
                        declarations:
                          [ { type: 'VariableDeclarator',
                            id:
                            { type: 'ArrayPattern',
                              elements:
                                [ { type: 'RestElement',
                                  argument: { type: 'Identifier', name: 'foo' } } ] },
                            init: { type: 'Identifier', name: 'obj' } } ] },
                      test: null,
                      update: null,
                      body: { type: 'EmptyStatement' } } ] },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('rest preceded by an ident', {
                code: 'for (const [foo, ...bar] = obj;;);',
                ast: { type: 'Program',
                  body:
                    [ { type: 'ForStatement',
                      init:
                      { type: 'VariableDeclaration',
                        kind: 'const',
                        declarations:
                          [ { type: 'VariableDeclarator',
                            id:
                            { type: 'ArrayPattern',
                              elements:
                                [ { type: 'Identifier', name: 'foo' },
                                  { type: 'RestElement',
                                    argument: { type: 'Identifier', name: 'bar' } } ] },
                            init: { type: 'Identifier', name: 'obj' } } ] },
                      test: null,
                      update: null,
                      body: { type: 'EmptyStatement' } } ] },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('rest followed by an ident', {
                code: 'for (const [...foo, bar] = obj;;);',
                throws: 'follow a spread',
                tokens: [],
              });

              test('rest followed by a trailing comma', {
                code: 'for (const [...foo,] = obj;;);',
                throws: 'follow a spread',
                tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('rest followed by two commas', {
                code: 'for (const [...foo,,] = obj;;);',
                throws: 'follow a spread',
                tokens: [],
              });

              test('rest on a nested destruct', {
                code: 'for (const [...[foo, bar]] = obj;;);',
                ast: { type: 'Program',
                  body:
                    [ { type: 'ForStatement',
                      init:
                      { type: 'VariableDeclaration',
                        kind: 'const',
                        declarations:
                          [ { type: 'VariableDeclarator',
                            id:
                            { type: 'ArrayPattern',
                              elements:
                                [ { type: 'RestElement',
                                  argument:
                                  { type: 'ArrayPattern',
                                    elements:
                                      [ { type: 'Identifier', name: 'foo' },
                                        { type: 'Identifier', name: 'bar' } ] } } ] },
                            init: { type: 'Identifier', name: 'obj' } } ] },
                      test: null,
                      update: null,
                      body: { type: 'EmptyStatement' } } ] },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('trailing comma after rest on a nested destruct', {
                code: 'for (const [...[foo, bar],] = obj;;);',
                throws: 'follow a spread',
                tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double trailing comma after rest on a nested destruct', {
                code: 'for (const [...[foo, bar],,] = obj;;);',
                throws: 'follow a spread',
                tokens: [],
              });

              test('second param rest on a nested destruct', {
                code: 'for (const [x, ...[foo, bar]] = obj;;);',
                ast: { type: 'Program',
                  body:
                    [ { type: 'ForStatement',
                      init:
                      { type: 'VariableDeclaration',
                        kind: 'const',
                        declarations:
                          [ { type: 'VariableDeclarator',
                            id:
                            { type: 'ArrayPattern',
                              elements:
                                [ { type: 'Identifier', name: 'x' },
                                  { type: 'RestElement',
                                    argument:
                                    { type: 'ArrayPattern',
                                      elements:
                                        [ { type: 'Identifier', name: 'foo' },
                                          { type: 'Identifier', name: 'bar' } ] } } ] },
                            init: { type: 'Identifier', name: 'obj' } } ] },
                      test: null,
                      update: null,
                      body: { type: 'EmptyStatement' } } ] },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('spread with default', {
                code: 'for (const [...bar = foo] = obj;;);',
                throws: 'a rest value',
                desc: 'rest cannot get a default in var decls but they can as func args',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [... ...foo] = obj;;);',
                throws: 'Can not spread twice',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [...] = obj;;);',
                throws: 'missing an ident or destruct',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [...,] = obj;;);',
                throws: 'missing an ident or destruct',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [.x] = obj;;);',
                throws: 'Expecting nested ident or destructuring pattern',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [..x] = obj;;);',
                throws: 'Expecting nested ident or destructuring pattern',
                tokens: [],
              });
            });
          });

          describe('object', _ => {

            test('empty obj', {
              code: 'for (const {} = obj;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id: { type: 'ObjectPattern', properties: [] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('empty obj with trailing comma', {
              code: 'for (const {,} = obj;;);',
              throws: 'elided commas',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('empty obj with elided commas', {
              code: 'for (const {,,} = obj;;);',
              throws: 'elided commas',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('single var base case', {
              code: 'for (const {x} = obj;;);',
              ast: { type: 'Program', body: [{
                type: 'ForStatement',
                init: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                      type: 'ObjectPattern',
                      properties: [{
                        type: 'Property',
                        computed: false,
                        kind: 'init',
                        method: false,
                        shorthand: false,
                        key: {type: 'Identifier', name: 'x'},
                        value: {type: 'Identifier', name: 'x'},
                      }],
                    },
                    init: { type: 'Identifier', name: 'obj' },
                  }],
                },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single var with trailing comma', {
              code: 'for (const {x,} = obj;;);',
              ast: { type: 'Program', body: [{
                type: 'ForStatement',
                init: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                      type: 'ObjectPattern',
                      properties: [{
                        type: 'Property',
                        computed: false,
                        kind: 'init',
                        method: false,
                        shorthand: false,
                        key: {type: 'Identifier', name: 'x'},
                        value: {type: 'Identifier', name: 'x'},
                      }],
                    },
                    init: { type: 'Identifier', name: 'obj' },
                  }],
                },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single var with double trailing comma', {
              code: 'for (const {x,,} = obj;;);',
              throws: 'elided commas',
              desc: 'does not work with obj, only array',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with leading comma', {
              code: 'for (const {,x} = obj;;);',
              throws: 'elided commas',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with double leading comma', {
              code: 'for (const {,,x} = obj;;);',
              throws: 'elided commas',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'for (const {x, y} = obj;;);',
              ast: { type: 'Program', body: [{
                type: 'ForStatement',
                init: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                      type: 'ObjectPattern',
                      properties: [{
                        type: 'Property',
                        computed: false,
                        kind: 'init',
                        method: false,
                        shorthand: false,
                        key: {type: 'Identifier', name: 'x'},
                        value: {type: 'Identifier', name: 'x'},
                      }, {
                        type: 'Property',
                        computed: false,
                        kind: 'init',
                        method: false,
                        shorthand: false,
                        key: {type: 'Identifier', name: 'y'},
                        value: {type: 'Identifier', name: 'y'},
                      }],
                    },
                    init: { type: 'Identifier', name: 'obj' },
                  }],
                },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double var with double comma', {
              code: 'for (const {x,, y} = obj;;);',
              throws: 'elided commas',
              desc: 'works with array but not obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'for (const {x} = a, {y} = obj;;);',
              ast: { type: 'Program', body: [{
                type: 'ForStatement',
                init: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                      type: 'ObjectPattern',
                      properties: [{
                        type: 'Property',
                        computed: false,
                        kind: 'init',
                        method: false,
                        shorthand: false,
                        key: {type: 'Identifier', name: 'x'},
                        value: {type: 'Identifier', name: 'x'},
                      }],
                    },
                    init: { type: 'Identifier', name: 'a' },
                  }, {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'ObjectPattern',
                      properties: [{
                        type: 'Property',
                        computed: false,
                        kind: 'init',
                        method: false,
                        shorthand: false,
                        key: {type: 'Identifier', name: 'y'},
                        value: {type: 'Identifier', name: 'y'},
                      }],
                    },
                    init: { type: 'Identifier', name: 'obj' },
                  }],
                },
                test: null,
                update: null,
                body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('destruct and non-destruct with init', {
              code: 'for (const {x} = a, y = obj;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'x' } } ] },
                          init: { type: 'Identifier', name: 'a' } },
                          { type: 'VariableDeclarator',
                            id: { type: 'Identifier', name: 'y' },
                            init: { type: 'Identifier', name: 'obj' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('destruct and non-destruct without init', {
              code: 'for (const {x} = a, obj;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'x' } } ] },
                          init: { type: 'Identifier', name: 'a' } },
                          { type: 'VariableDeclarator',
                            id: { type: 'Identifier', name: 'obj' },
                            init: null } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('non-destruct with ini and destruct', {
              code: 'for (const x = a, {y} = obj;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id: { type: 'Identifier', name: 'x' },
                          init: { type: 'Identifier', name: 'a' } },
                          { type: 'VariableDeclarator',
                            id:
                            { type: 'ObjectPattern',
                              properties:
                                [ { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'y' },
                                  value: { type: 'Identifier', name: 'y' } } ] },
                            init: { type: 'Identifier', name: 'obj' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('non-destruct without ini and destruct', {
              code: 'for (const x, {y} = obj;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id: { type: 'Identifier', name: 'x' },
                          init: null },
                          { type: 'VariableDeclarator',
                            id:
                            { type: 'ObjectPattern',
                              properties:
                                [ { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'y' },
                                  value: { type: 'Identifier', name: 'y' } } ] },
                            init: { type: 'Identifier', name: 'obj' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct with init', {
              code: 'for (const {x = y} = obj;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'x' },
                                  right: { type: 'Identifier', name: 'y' } } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct with and without init', {
              code: 'for (const {x = y, z} = obj;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'x' },
                                  right: { type: 'Identifier', name: 'y' } } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value: { type: 'Identifier', name: 'z' } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct without and with init', {
              code: 'for (const {x, y = z} = obj;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'x' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'y' },
                                  value:
                                  { type: 'AssignmentPattern',
                                    left: { type: 'Identifier', name: 'y' },
                                    right: { type: 'Identifier', name: 'z' } } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct both with init', {
              code: 'for (const {x = y, z = a} = obj;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'x' },
                                  right: { type: 'Identifier', name: 'y' } } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value:
                                  { type: 'AssignmentPattern',
                                    left: { type: 'Identifier', name: 'z' },
                                    right: { type: 'Identifier', name: 'a' } } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct with rename', {
              code: 'for (const {x : y} = obj;;);',
              ast: {
                type: 'Program',
                body: [{
                  type: 'ForStatement',
                  init: {
                    type: 'VariableDeclaration',
                    kind: 'const',
                    declarations: [ {
                      type: 'VariableDeclarator',
                      id: {
                        type: 'ObjectPattern',
                        properties: [ { type: 'Property',
                          computed: false,
                          kind: 'init',
                          method: false,
                          shorthand: false,
                          key: { type: 'Identifier', name: 'x' },
                          value: { type: 'Identifier', name: 'y' } }],
                      },
                      init: { type: 'Identifier', name: 'obj' },
                    }],
                  },
                  test: null,
                  update: null,
                  body: { type: 'EmptyStatement' },
                }],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct with and without rename', {
              code: 'for (const {x : y, z} = obj;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value: { type: 'Identifier', name: 'z' } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct without and with rename', {
              code: 'for (const {x, y : z} = obj;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'x' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'y' },
                                  value: { type: 'Identifier', name: 'z' } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct both with rename', {
              code: 'for (const {x : y, z : a} = obj;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value: { type: 'Identifier', name: 'a' } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct with rename and init', {
              code: 'for (const {x : y = z} = obj;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'y' },
                                  right: { type: 'Identifier', name: 'z' } } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct with rename and init', {
              code: 'for (const {x : y, z, a : b = c} = obj;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value: { type: 'Identifier', name: 'z' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'a' },
                                  value:
                                  { type: 'AssignmentPattern',
                                    left: { type: 'Identifier', name: 'b' },
                                    right: { type: 'Identifier', name: 'c' } } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct no assignment', {
              code: 'for (const {x};;);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct no assignment', {
              code: 'for (const {x}, {y} = z;;);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident and destruct no assignment', {
              code: 'for (const x, {y};;);',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct no assignment and ident', {
              code: 'for (const {x}, y;;);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident with init and destruct no assignment', {
              code: 'for (const x = y, {z};;);',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and no assignment', {
              code: 'for (const {x:y};;);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with default and no assignment', {
              code: 'for (const {x=y};;);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and default and no assignment', {
              code: 'for (const {x:y=z};;);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and with and without assignment', {
              code: 'for (const {x:y=z} = obj, {a:b=c};;);',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and without and with assignment', {
              code: 'for (const {x:y=z}, {a:b=c} = obj;;);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with colon-eq', {
              code: 'for (const {a:=c} = z;;);',
              throws: 'must be an identifier',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('correct dynamic property destructuring', {
              code: 'for (const {[x]: y} = z;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: true,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } } ] },
                          init: { type: 'Identifier', name: 'z' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('dynamic property destructuring missing alias', {
              code: 'for (const {[x]} = z;;);',
              throws: '(:)',
              tokens: [],
            });

            test('dynamic property destructuring missing alias and init', {
              code: 'for (const {[x]};;);',
              throws: '(:)',
              tokens: [],
            });

            test('dynamic property destructuring missing assignment', {
              code: 'for (const {[x]: y};;);',
              throws: 'destructuring must be followed',
              tokens: [],
            });

            test('dynamic property destructuring with default missing alias', {
              code: 'for (const {[x] = y} = z;;);',
              throws: '(:)',
              tokens: [],
            });

            test('dynamic property destructuring with default and alias missing init', {
              code: 'for (const {[x]: y = z};;);',
              throws: 'destructuring must be followed',
              tokens: [],
            });

            test('correct dynamic property destructuring with default and alias', {
              code: 'for (const {[x]: y = z} = a;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: true,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'y' },
                                  right: { type: 'Identifier', name: 'z' } } } ] },
                          init: { type: 'Identifier', name: 'a' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('dynamic prop as second prop', {
              code: 'for (const {a, [x]: y} = a;;);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForStatement',
                    init:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'a' },
                                value: { type: 'Identifier', name: 'a' } },
                                { type: 'Property',
                                  computed: true,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'x' },
                                  value: { type: 'Identifier', name: 'y' } } ] },
                          init: { type: 'Identifier', name: 'a' } } ] },
                    test: null,
                    update: null,
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });
          });
        });

        describe('invalid colorless for-statement', _ => {

          // these are all the const tests sans `in`, `of`, and double semi in the for-header

          describe('array', _ => {

            test('empty "array" should work', {
              code: 'for (const [] = x);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('empty array with one comma', {
              code: 'for (const [,] = x);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('empty array with double comma', {
              code: 'for (const [,,] = x);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('with one var, no init, semi', {
              code: 'for (const [foo] = arr);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('trailing comma is insignificant', {
              code: 'for (const [foo,] = arr);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double trailing comma is significant', {
              code: 'for (const [foo,,] = arr);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('leading comma', {
              code: 'for (const [,foo] = arr);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double leading comma', {
              code: 'for (const [,,foo] = arr);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars', {
              code: 'for (const [foo,bar] = arr);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars with eliding comma', {
              code: 'for (const [foo,,bar] = arr);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct', {
              code: 'for (const [foo] = arr, [bar] = arr2);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('destruct and non-destruct without init', {
              code: 'for (const [foo] = arr, bar);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('destruct and non-destruct with init', {
              code: 'for (const [foo] = arr, bar = arr2);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('non-destruct without init and destruct', {
              code: 'for (const foo, [bar] = arr2);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('non-destruct with init and destruct', {
              code: 'for (const foo = arr, [bar] = arr2);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('one var with initializer', {
              code: 'for (const [foo=a] = arr);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars, with and without initializer', {
              code: 'for (const [foo=a, bar] = arr);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars, without and with initializer', {
              code: 'for (const [foo, bar=b] = arr);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars, with and with initializer', {
              code: 'for (const [foo=a, bar=b] = arr);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment without init', {
              code: 'for (const [foo]);',
              throws: 'destructuring must be followed',
              desc: 'this could be legal in sloppy except not at the start of a statement',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment with init', {
              code: 'for (const [foo = x]);',
              throws: 'destructuring must be followed',
              desc: 'this could be legal in sloppy except not at the start of a statement',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment with two declarations first', {
              code: 'for (const [foo], bar);',
              throws: 'destructuring must be followed',
              desc: 'just like `foo[bar],baz` which is a fine expression in sloppy mode, except that it is still illegal',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment with two declarations second', {
              code: 'for (const foo, [bar]);',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            describe('rest operator', _ => {

              test('rest as the only destruct', {
                code: 'for (const [...foo] = obj);',
                throws: 'Missing required initializer',
                tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('rest preceded by an ident', {
                code: 'for (const [foo, ...bar] = obj);',
                throws: 'Missing required initializer',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('rest followed by an ident', {
                code: 'for (const [...foo, bar] = obj);',
                throws: 'follow a spread',
                tokens: [],
              });

              test('rest followed by a trailing comma', {
                code: 'for (const [...foo,] = obj);',
                throws: 'follow a spread',
                tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('rest followed by two commas', {
                code: 'for (const [...foo,,] = obj);',
                throws: 'follow a spread',
                tokens: [],
              });

              test('rest on a nested destruct', {
                code: 'for (const [...[foo, bar]] = obj);',
                throws: 'Missing required initializer',
                tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('trailing comma after rest on a nested destruct', {
                code: 'for (const [...[foo, bar],] = obj);',
                throws: 'follow a spread',
                tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double trailing comma after rest on a nested destruct', {
                code: 'for (const [...[foo, bar],,] = obj);',
                throws: 'follow a spread',
                tokens: [],
              });

              test('second param rest on a nested destruct', {
                code: 'for (const [x, ...[foo, bar]] = obj);',
                throws: 'Missing required initializer',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('spread with default', {
                code: 'for (const [...bar = foo] = obj);',
                throws: 'a rest value',
                desc: 'rest cannot get a default in var decls but they can as func args',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [... ...foo] = obj);',
                throws: 'Can not spread twice',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [...] = obj);',
                throws: 'missing an ident or destruct',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [...,] = obj);',
                throws: 'missing an ident or destruct',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [.x] = obj);',
                throws: 'Expecting nested ident or destructuring pattern',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [..x] = obj);',
                throws: 'Expecting nested ident or destructuring pattern',
                tokens: [],
              });
            });
          });

          describe('object', _ => {

            test('empty obj', {
              code: 'for (const {} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('empty obj with trailing comma', {
              code: 'for (const {,} = obj);',
              throws: 'elided commas',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('empty obj with elided commas', {
              code: 'for (const {,,} = obj);',
              throws: 'elided commas',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('single var base case', {
              code: 'for (const {x} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single var with trailing comma', {
              code: 'for (const {x,} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single var with double trailing comma', {
              code: 'for (const {x,,} = obj);',
              throws: 'elided commas',
              desc: 'does not work with obj, only array',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with leading comma', {
              code: 'for (const {,x} = obj);',
              throws: 'elided commas',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with double leading comma', {
              code: 'for (const {,,x} = obj);',
              throws: 'elided commas',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'for (const {x, y} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double var with double comma', {
              code: 'for (const {x,, y} = obj);',
              throws: 'elided commas',
              desc: 'works with array but not obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'for (const {x} = a, {y} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('destruct and non-destruct with init', {
              code: 'for (const {x} = a, y = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('destruct and non-destruct without init', {
              code: 'for (const {x} = a, obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('non-destruct with ini and destruct', {
              code: 'for (const x = a, {y} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('non-destruct without ini and destruct', {
              code: 'for (const x, {y} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct with init', {
              code: 'for (const {x = y} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct with and without init', {
              code: 'for (const {x = y, z} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct without and with init', {
              code: 'for (const {x, y = z} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct both with init', {
              code: 'for (const {x = y, z = a} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct with rename', {
              code: 'for (const {x : y} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct with and without rename', {
              code: 'for (const {x : y, z} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct without and with rename', {
              code: 'for (const {x, y : z} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct both with rename', {
              code: 'for (const {x : y, z : a} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct with rename and init', {
              code: 'for (const {x : y = z} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct with rename and init', {
              code: 'for (const {x : y, z, a : b = c} = obj);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct no assignment', {
              code: 'for (const {x});',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct no assignment', {
              code: 'for (const {x}, {y} = z);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident and destruct no assignment', {
              code: 'for (const x, {y});',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct no assignment and ident', {
              code: 'for (const {x}, y);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident with init and destruct no assignment', {
              code: 'for (const x = y, {z});',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct no assignment and ident', {
              code: 'for (const {x}, y);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and no assignment', {
              code: 'for (const {x:y});',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with default and no assignment', {
              code: 'for (const {x=y});',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and default and no assignment', {
              code: 'for (const {x:y=z});',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and with and without assignment', {
              code: 'for (const {x:y=z} = obj, {a:b=c});',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and without and with assignment', {
              code: 'for (const {x:y=z}, {a:b=c} = obj);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with colon-eq', {
              code: 'for (const {a:=c} = z);',
              throws: 'must be an identifier',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('correct dynamic property destructuring', {
              code: 'for (const {[x]: y} = z);',
              throws: 'Missing required initializer',
              desc: 'TODO: the message is actually wrong here (since the init is present). not a big deal right now as long as something throws.',
              tokens: [],
            });

            test('dynamic property destructuring missing alias', {
              code: 'for (const {[x]} = z);',
              throws: '(:)',
              tokens: [],
            });

            test('dynamic property destructuring missing alias and init', {
              code: 'for (const {[x]});',
              throws: '(:)',
              tokens: [],
            });

            test('dynamic property destructuring missing assignment', {
              code: 'for (const {[x]: y});',
              throws: 'destructuring must be followed',
              tokens: [],
            });

            test('dynamic property destructuring with default missing alias', {
              code: 'for (const {[x] = y} = z);',
              throws: '(:)',
              tokens: [],
            });

            test('dynamic property destructuring with default and alias missing init', {
              code: 'for (const {[x]: y = z});',
              throws: 'destructuring must be followed',
              tokens: [],
            });

            test('correct dynamic property destructuring with default and alias', {
              code: 'for (const {[x]: y = z} = a);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('dynamic prop as second prop', {
              code: 'for (const {a, [x]: y} = a);',
              throws: 'Missing required initializer',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });
          });
        });

        describe('for-in', _ => {

          describe('array', _ => {

            test('empty "array" should work', {
              code: 'for (const [] in x);',
              ast: {type: 'Program', body: [{
                type: 'ForInStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {type: 'ArrayPattern', elements: []},
                    init: null,
                  }],
                },
                right: {type: 'Identifier', name: 'x'},
                body: {type: 'EmptyStatement' },
              }]},
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('empty array with one comma', {
              code: 'for (const [,] in x);',
              ast: {type: 'Program', body: [{
                type: 'ForInStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {type: 'ArrayPattern', elements: [null]},
                    init: null,
                  }],
                },
                right: {type: 'Identifier', name: 'x'},
                body: {type: 'EmptyStatement' },
              }]},
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('empty array with double comma', {
              code: 'for (const [,,] in x);',
              ast: {type: 'Program', body: [{
                type: 'ForInStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {type: 'ArrayPattern', elements: [null, null]},
                    init: null,
                  }],
                },
                right: {type: 'Identifier', name: 'x'},
                body: {type: 'EmptyStatement' },
              }]},
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('with one var, no init, semi', {
              code: 'for (const [foo] in arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements: [ { type: 'Identifier', name: 'foo' } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('trailing comma is insignificant', {
              code: 'for (const [foo,] in arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements: [ { type: 'Identifier', name: 'foo' } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double trailing comma is significant', {
              code: 'for (const [foo,,] in arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements: [ { type: 'Identifier', name: 'foo' }, null ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('leading comma', {
              code: 'for (const [,foo] in arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements: [ null, { type: 'Identifier', name: 'foo' } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double leading comma', {
              code: 'for (const [,,foo] in arr);',
              ast:  { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements: [ null, null, { type: 'Identifier', name: 'foo' } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars', {
              code: 'for (const [foo,bar] in arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements:
                              [ { type: 'Identifier', name: 'foo' },
                                { type: 'Identifier', name: 'bar' } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars with eliding comma', {
              code: 'for (const [foo,,bar] in arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements:
                              [ { type: 'Identifier', name: 'foo' },
                                null,
                                { type: 'Identifier', name: 'bar' } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct', {
              code: 'for (const [foo] = arr, [bar] in arr);',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('destruct and non-destruct without init', {
              code: 'for (const [foo], bar in arr);',
              throws: 'destructuring must be followed',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('destruct and non-destruct with init', {
              code: 'for (const [foo] = arr, bar in arr);',
              throws: 'can only have one var binding',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('non-destruct without init and destruct', {
              code: 'for (const foo, [bar] in arr);',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('non-destruct with init and destruct', {
              code: 'for (const foo = arr, [bar] in arr);',
              throws: ' destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('one var with initializer', {
              code: 'for (const [foo=a] in arr);',
              ast: {type: 'Program', body: [{
                type: 'ForInStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
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
                    init: null,
                  }],
                },
                right: {type: 'Identifier', name: 'arr'},
                body: {type: 'EmptyStatement'},
              }]},
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars, with and without initializer', {
              code: 'for (const [foo=a, bar] in arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements:
                              [ { type: 'AssignmentPattern',
                                left: { type: 'Identifier', name: 'foo' },
                                right: { type: 'Identifier', name: 'a' } },
                                { type: 'Identifier', name: 'bar' } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars, without and with initializer', {
              code: 'for (const [foo, bar=b] in arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements:
                              [ { type: 'Identifier', name: 'foo' },
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'bar' },
                                  right: { type: 'Identifier', name: 'b' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars, with and with initializer', {
              code: 'for (const [foo=a, bar=b] in arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment without init', {
              code: 'for (const [foo]);',
              throws: 'destructuring must be followed by',
              desc: '(these mirror tests are kind of moot as per for-in)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment with init', {
              code: 'for (const [foo = x]);',
              throws: 'destructuring must be followed by',
              desc: '(these mirror tests are kind of moot as per for-in)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment with two declarations first', {
              code: 'for (const [foo], bar);',
              throws: 'destructuring must be followed by',
              desc: '(these mirror tests are kind of moot as per for-in)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment with two declarations second', {
              code: 'for (const foo, [bar]);',
              throws: 'destructuring here without an assignment',
              desc: '(these mirror tests are kind of moot as per for-in)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            describe('rest operator', _ => {

              test('rest as the only destruct', {
                code: 'for (const [...foo] in obj);',
                ast: { type: 'Program',
                  body:
                    [ { type: 'ForInStatement',
                      left:
                      { type: 'VariableDeclaration',
                        kind: 'const',
                        declarations:
                          [ { type: 'VariableDeclarator',
                            id:
                            { type: 'ArrayPattern',
                              elements:
                                [ { type: 'RestElement',
                                  argument: { type: 'Identifier', name: 'foo' } } ] },
                            init: null } ] },
                      right: { type: 'Identifier', name: 'obj' },
                      body: { type: 'EmptyStatement' } } ] },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('rest preceded by an ident', {
                code: 'for (const [foo, ...bar] in obj);',
                ast: { type: 'Program',
                  body:
                    [ { type: 'ForInStatement',
                      left:
                      { type: 'VariableDeclaration',
                        kind: 'const',
                        declarations:
                          [ { type: 'VariableDeclarator',
                            id:
                            { type: 'ArrayPattern',
                              elements:
                                [ { type: 'Identifier', name: 'foo' },
                                  { type: 'RestElement',
                                    argument: { type: 'Identifier', name: 'bar' } } ] },
                            init: null } ] },
                      right: { type: 'Identifier', name: 'obj' },
                      body: { type: 'EmptyStatement' } } ] },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('rest followed by an ident', {
                code: 'for (const [...foo, bar] in obj);',
                throws: 'follow a spread',
                tokens: [],
              });

              test('rest followed by a trailing comma', {
                code: 'for (const [...foo,] in obj);',
                throws: 'follow a spread',
                tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('rest followed by two commas', {
                code: 'for (const [...foo,,] in obj);',
                throws: 'follow a spread',
                tokens: [],
              });

              test('rest on a nested destruct', {
                code: 'for (const [...[foo, bar]] in obj);',
                ast: { type: 'Program',
                  body:
                    [ { type: 'ForInStatement',
                      left:
                      { type: 'VariableDeclaration',
                        kind: 'const',
                        declarations:
                          [ { type: 'VariableDeclarator',
                            id:
                            { type: 'ArrayPattern',
                              elements:
                                [ { type: 'RestElement',
                                  argument:
                                  { type: 'ArrayPattern',
                                    elements:
                                      [ { type: 'Identifier', name: 'foo' },
                                        { type: 'Identifier', name: 'bar' } ] } } ] },
                            init: null } ] },
                      right: { type: 'Identifier', name: 'obj' },
                      body: { type: 'EmptyStatement' } } ] },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('trailing comma after rest on a nested destruct', {
                code: 'for (const [...[foo, bar],] in obj);',
                throws: 'follow a spread',
                tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double trailing comma after rest on a nested destruct', {
                code: 'for (const [...[foo, bar],,] in obj);',
                throws: 'follow a spread',
                tokens: [],
              });

              test('second param rest on a nested destruct', {
                code: 'for (const [x, ...[foo, bar]] in obj);',
                ast: { type: 'Program',
                  body:
                    [ { type: 'ForInStatement',
                      left:
                      { type: 'VariableDeclaration',
                        kind: 'const',
                        declarations:
                          [ { type: 'VariableDeclarator',
                            id:
                            { type: 'ArrayPattern',
                              elements:
                                [ { type: 'Identifier', name: 'x' },
                                  { type: 'RestElement',
                                    argument:
                                    { type: 'ArrayPattern',
                                      elements:
                                        [ { type: 'Identifier', name: 'foo' },
                                          { type: 'Identifier', name: 'bar' } ] } } ] },
                            init: null } ] },
                      right: { type: 'Identifier', name: 'obj' },
                      body: { type: 'EmptyStatement' } } ] },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('spread with default', {
                code: 'for (const [...bar = foo] in obj);',
                throws: 'a rest value',
                desc: 'rest cannot get a default in var decls but they can as func args',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [... ...foo] in obj);',
                throws: 'Can not spread twice',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [...] in obj);',
                throws: 'missing an ident or destruct',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [...,] in obj);',
                throws: 'missing an ident or destruct',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [.x] in obj);',
                throws: 'Expecting nested ident or destructuring pattern',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [..x] in obj);',
                throws: 'Expecting nested ident or destructuring pattern',
                tokens: [],
              });
            });
          });

          describe('object', _ => {

            test('empty obj', {
              code: 'for (const {} in obj);',
              ast: { type: 'Program', body: [ {
                type: 'ForInStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [ {
                    type: 'VariableDeclarator',
                    id: { type: 'ObjectPattern', properties: [] },
                    init: null,
                  } ],
                },
                right: { type: 'Identifier', name: 'obj' },
                body: { type: 'EmptyStatement' },
              } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('empty obj with trailing comma', {
              code: 'for (const {,} in obj);',
              throws: 'elided commas',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('empty obj with elided commas', {
              code: 'for (const {,,} in obj);',
              throws: 'elided commas',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('single var base case', {
              code: 'for (const {x} in obj);',
              ast: {type: 'Program', body: [{
                type: 'ForInStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {type: 'ObjectPattern', properties: [{
                      type: 'Property',
                      computed: false,
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      key: { type: 'Identifier', name: 'x' },
                      value: { type: 'Identifier', name: 'x' },
                    }]},
                    init: null,
                  }],
                },
                right: {type: 'Identifier', name: 'obj'},
                body: {type: 'EmptyStatement'},
              }]},
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single var with trailing comma', {
              code: 'for (const {x,} in obj);',
              ast: {type: 'Program', body: [{
                type: 'ForInStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {type: 'ObjectPattern', properties: [{
                      type: 'Property',
                      computed: false,
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      key: { type: 'Identifier', name: 'x' },
                      value: { type: 'Identifier', name: 'x' },
                    }]},
                    init: null,
                  }],
                },
                right: {type: 'Identifier', name: 'obj'},
                body: {type: 'EmptyStatement'},
              }]},
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single var with double trailing comma', {
              code: 'for (const {x,,} in obj);',
              throws: 'elided commas',
              desc: 'does not work with obj, only array',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with leading comma', {
              code: 'for (const {,x} in obj);',
              throws: 'elided commas',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with double leading comma', {
              code: 'for (const {,,x} in obj);',
              throws: 'elided commas',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'for (const {x, y} in obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'x' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'y' },
                                  value: { type: 'Identifier', name: 'y' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double var with double comma', {
              code: 'for (const {x,, y} in obj);',
              throws: 'elided commas',
              desc: 'works with array but not obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'for (const {x} = a, {y} in obj);',
              throws: 'destructuring here without an assignment',
              desc: 'confusing message for only supporting one var with this for-statement type',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('destruct and non-destruct with init', {
              code: 'for (const {x} = a, y in obj);',
              throws: 'can only have one var binding',
              desc: 'confusing message for only supporting one var with this for-statement type',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('destruct and non-destruct without init', {
              code: 'for (const {x} = a, obj in obj2);',
              throws: 'can only have one var binding',
              desc: 'confusing message for only supporting one var with this for-statement type',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('non-destruct with ini and destruct', {
              code: 'for (const x = a, {y} in obj);',
              throws: 'destructuring here without an assignment',
              desc: 'confusing message for only supporting one var with this for-statement type',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('non-destruct without ini and destruct', {
              code: 'for (const x, {y} in obj);',
              throws: 'destructuring here without an assignment',
              desc: 'confusing message for only supporting one var with this for-statement type',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct with init', {
              code: 'for (const {x = y} in obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'x' },
                                  right: { type: 'Identifier', name: 'y' } } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct with and without init', {
              code: 'for (const {x = y, z} in obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'x' },
                                  right: { type: 'Identifier', name: 'y' } } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value: { type: 'Identifier', name: 'z' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct without and with init', {
              code: 'for (const {x, y = z} in obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'x' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'y' },
                                  value:
                                  { type: 'AssignmentPattern',
                                    left: { type: 'Identifier', name: 'y' },
                                    right: { type: 'Identifier', name: 'z' } } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct both with init', {
              code: 'for (const {x = y, z = a} in obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'x' },
                                  right: { type: 'Identifier', name: 'y' } } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value:
                                  { type: 'AssignmentPattern',
                                    left: { type: 'Identifier', name: 'z' },
                                    right: { type: 'Identifier', name: 'a' } } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct with rename', {
              code: 'for (const {x : y} in obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct with and without rename', {
              code: 'for (const {x : y, z} in obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value: { type: 'Identifier', name: 'z' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct without and with rename', {
              code: 'for (const {x, y : z} in obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'x' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'y' },
                                  value: { type: 'Identifier', name: 'z' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct both with rename', {
              code: 'for (const {x : y, z : a} in obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value: { type: 'Identifier', name: 'a' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct with rename and init', {
              code: 'for (const {x : y = z} in obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'y' },
                                  right: { type: 'Identifier', name: 'z' } } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct with rename and init', {
              code: 'for (const {x : y, z, a : b = c} in obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value: { type: 'Identifier', name: 'z' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'a' },
                                  value:
                                  { type: 'AssignmentPattern',
                                    left: { type: 'Identifier', name: 'b' },
                                    right: { type: 'Identifier', name: 'c' } } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct no assignment', {
              code: 'for (const {x});',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct no assignment', {
              code: 'for (const {x}, {y} in z);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident and destruct no assignment', {
              code: 'for (const x, {y});',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct no assignment and ident', {
              code: 'for (const {x}, y);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident with init and destruct no assignment', {
              code: 'for (const x = y, {z});',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct no assignment and ident', {
              code: 'for (const {x}, y);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and no assignment', {
              code: 'for (const {x:y});',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with default and no assignment', {
              code: 'for (const {x=y});',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and default and no assignment', {
              code: 'for (const {x:y=z});',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and with and without assignment', {
              code: 'for (const {x:y=z} = obj, {a:b=c});',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and without and with assignment', {
              code: 'for (const {x:y=z}, {a:b=c} in obj);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with colon-eq', {
              code: 'for (const {a:=c} in z);',
              throws: 'must be an identifier',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('correct dynamic property destructuring', {
              code: 'for (const {[x]: y} in obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: true,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('dynamic property destructuring missing alias', {
              code: 'for (const {[x]} in obj);',
              throws: '(:)',
              tokens: [],
            });

            test('dynamic property destructuring with default missing alias', {
              code: 'for (const {[x] = y} in obj);',
              throws: '(:)',
              tokens: [],
            });

            test('correct dynamic property destructuring with default and alias', {
              code: 'for (const {[x]: y = z} in obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: true,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'y' },
                                  right: { type: 'Identifier', name: 'z' } } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('dynamic prop as second prop', {
              code: 'for (const {a, [x]: y} in obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForInStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'a' },
                                value: { type: 'Identifier', name: 'a' } },
                                { type: 'Property',
                                  computed: true,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'x' },
                                  value: { type: 'Identifier', name: 'y' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });
          });
        });

        describe('for-of', _ => {

          describe('array', _ => {

            test('empty "array" should work', {
              code: 'for (const [] of x);',
              ast: {type: 'Program', body: [{
                type: 'ForOfStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {type: 'ArrayPattern', elements: []},
                    init: null,
                  }],
                },
                right: {type: 'Identifier', name: 'x'},
                body: {type: 'EmptyStatement' },
              }]},
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('empty array with one comma', {
              code: 'for (const [,] of x);',
              ast: {type: 'Program', body: [{
                type: 'ForOfStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {type: 'ArrayPattern', elements: [null]},
                    init: null,
                  }],
                },
                right: {type: 'Identifier', name: 'x'},
                body: {type: 'EmptyStatement' },
              }]},
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('empty array with double comma', {
              code: 'for (const [,,] of x);',
              ast: {type: 'Program', body: [{
                type: 'ForOfStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {type: 'ArrayPattern', elements: [null, null]},
                    init: null,
                  }],
                },
                right: {type: 'Identifier', name: 'x'},
                body: {type: 'EmptyStatement' },
              }]},
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('with one var, no init, semi', {
              code: 'for (const [foo] of arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements: [ { type: 'Identifier', name: 'foo' } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('trailing comma is insignificant', {
              code: 'for (const [foo,] of arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements: [ { type: 'Identifier', name: 'foo' } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double trailing comma is significant', {
              code: 'for (const [foo,,] of arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements: [ { type: 'Identifier', name: 'foo' }, null ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('leading comma', {
              code: 'for (const [,foo] of arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements: [ null, { type: 'Identifier', name: 'foo' } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double leading comma', {
              code: 'for (const [,,foo] of arr);',
              ast:  { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements: [ null, null, { type: 'Identifier', name: 'foo' } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars', {
              code: 'for (const [foo,bar] of arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements:
                              [ { type: 'Identifier', name: 'foo' },
                                { type: 'Identifier', name: 'bar' } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars with eliding comma', {
              code: 'for (const [foo,,bar] of arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements:
                              [ { type: 'Identifier', name: 'foo' },
                                null,
                                { type: 'Identifier', name: 'bar' } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct', {
              code: 'for (const [foo] = arr, [bar] of arr);',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('destruct and non-destruct without init', {
              code: 'for (const [foo], bar of arr);',
              throws: 'destructuring must be followed',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('destruct and non-destruct with init', {
              code: 'for (const [foo] = arr, bar of arr);',
              throws: 'can only have one var binding',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('non-destruct without init and destruct', {
              code: 'for (const foo, [bar] of arr);',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('non-destruct with init and destruct', {
              code: 'for (const foo = arr, [bar] of arr);',
              throws: ' destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('one var with initializer', {
              code: 'for (const [foo=a] of arr);',
              ast: {type: 'Program', body: [{
                type: 'ForOfStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
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
                    init: null,
                  }],
                },
                right: {type: 'Identifier', name: 'arr'},
                body: {type: 'EmptyStatement'},
              }]},
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars, with and without initializer', {
              code: 'for (const [foo=a, bar] of arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements:
                              [ { type: 'AssignmentPattern',
                                left: { type: 'Identifier', name: 'foo' },
                                right: { type: 'Identifier', name: 'a' } },
                                { type: 'Identifier', name: 'bar' } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars, without and with initializer', {
              code: 'for (const [foo, bar=b] of arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements:
                              [ { type: 'Identifier', name: 'foo' },
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'bar' },
                                  right: { type: 'Identifier', name: 'b' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two vars, with and with initializer', {
              code: 'for (const [foo=a, bar=b] of arr);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
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
                          init: null } ] },
                    right: { type: 'Identifier', name: 'arr' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment without init', {
              code: 'for (const [foo]);',
              throws: 'destructuring must be followed by',
              desc: '(these mirror tests are kind of moot as per for-of)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment with init', {
              code: 'for (const [foo = x]);',
              throws: 'destructuring must be followed by',
              desc: '(these mirror tests are kind of moot as per for-of)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment with two declarations first', {
              code: 'for (const [foo], bar);',
              throws: 'destructuring must be followed by',
              desc: '(these mirror tests are kind of moot as per for-of)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('no assignment with two declarations second', {
              code: 'for (const foo, [bar]);',
              throws: 'destructuring here without an assignment',
              desc: '(these mirror tests are kind of moot as per for-of)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            describe('rest operator', _ => {

              test('rest as the only destruct', {
                code: 'for (const [...foo] of obj);',
                ast: { type: 'Program',
                  body:
                    [ { type: 'ForOfStatement',
                      left:
                      { type: 'VariableDeclaration',
                        kind: 'const',
                        declarations:
                          [ { type: 'VariableDeclarator',
                            id:
                            { type: 'ArrayPattern',
                              elements:
                                [ { type: 'RestElement',
                                  argument: { type: 'Identifier', name: 'foo' } } ] },
                            init: null } ] },
                      right: { type: 'Identifier', name: 'obj' },
                      body: { type: 'EmptyStatement' } } ] },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('rest preceded by an ident', {
                code: 'for (const [foo, ...bar] of obj);',
                ast: { type: 'Program',
                  body:
                    [ { type: 'ForOfStatement',
                      left:
                      { type: 'VariableDeclaration',
                        kind: 'const',
                        declarations:
                          [ { type: 'VariableDeclarator',
                            id:
                            { type: 'ArrayPattern',
                              elements:
                                [ { type: 'Identifier', name: 'foo' },
                                  { type: 'RestElement',
                                    argument: { type: 'Identifier', name: 'bar' } } ] },
                            init: null } ] },
                      right: { type: 'Identifier', name: 'obj' },
                      body: { type: 'EmptyStatement' } } ] },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('rest followed by an ident', {
                code: 'for (const [...foo, bar] of obj);',
                throws: 'follow a spread',
                tokens: [],
              });

              test('rest followed by a trailing comma', {
                code: 'for (const [...foo,] of obj);',
                throws: 'follow a spread',
                tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('rest followed by two commas', {
                code: 'for (const [...foo,,] of obj);',
                throws: 'follow a spread',
                tokens: [],
              });

              test('rest on a nested destruct', {
                code: 'for (const [...[foo, bar]] of obj);',
                ast: { type: 'Program',
                  body:
                    [ { type: 'ForOfStatement',
                      left:
                      { type: 'VariableDeclaration',
                        kind: 'const',
                        declarations:
                          [ { type: 'VariableDeclarator',
                            id:
                            { type: 'ArrayPattern',
                              elements:
                                [ { type: 'RestElement',
                                  argument:
                                  { type: 'ArrayPattern',
                                    elements:
                                      [ { type: 'Identifier', name: 'foo' },
                                        { type: 'Identifier', name: 'bar' } ] } } ] },
                            init: null } ] },
                      right: { type: 'Identifier', name: 'obj' },
                      body: { type: 'EmptyStatement' } } ] },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('trailing comma after rest on a nested destruct', {
                code: 'for (const [...[foo, bar],] of obj);',
                throws: 'follow a spread',
                tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double trailing comma after rest on a nested destruct', {
                code: 'for (const [...[foo, bar],,] of obj);',
                throws: 'follow a spread',
                tokens: [],
              });

              test('second param rest on a nested destruct', {
                code: 'for (const [x, ...[foo, bar]] of obj);',
                ast: { type: 'Program',
                  body:
                    [ { type: 'ForOfStatement',
                      left:
                      { type: 'VariableDeclaration',
                        kind: 'const',
                        declarations:
                          [ { type: 'VariableDeclarator',
                            id:
                            { type: 'ArrayPattern',
                              elements:
                                [ { type: 'Identifier', name: 'x' },
                                  { type: 'RestElement',
                                    argument:
                                    { type: 'ArrayPattern',
                                      elements:
                                        [ { type: 'Identifier', name: 'foo' },
                                          { type: 'Identifier', name: 'bar' } ] } } ] },
                            init: null } ] },
                      right: { type: 'Identifier', name: 'obj' },
                      body: { type: 'EmptyStatement' } } ] },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('spread with default', {
                code: 'for (const [...bar = foo] of obj);',
                throws: 'a rest value',
                desc: 'rest cannot get a default of var decls but they can as func args',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [... ...foo] of obj);',
                throws: 'Can not spread twice',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [...] of obj);',
                throws: 'missing an ident or destruct',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [...,] of obj);',
                throws: 'missing an ident or destruct',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [.x] of obj);',
                throws: 'Expecting nested ident or destructuring pattern',
                tokens: [],
              });

              test('spread with default', {
                code: 'for (const [..x] of obj);',
                throws: 'Expecting nested ident or destructuring pattern',
                tokens: [],
              });
            });
          });

          describe('object', _ => {

            test('empty obj', {
              code: 'for (const {} of obj);',
              ast: { type: 'Program', body: [ {
                type: 'ForOfStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [ {
                    type: 'VariableDeclarator',
                    id: { type: 'ObjectPattern', properties: [] },
                    init: null,
                  } ],
                },
                right: { type: 'Identifier', name: 'obj' },
                body: { type: 'EmptyStatement' },
              } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('empty obj with trailing comma', {
              code: 'for (const {,} of obj);',
              throws: 'elided commas',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('empty obj with elided commas', {
              code: 'for (const {,,} of obj);',
              throws: 'elided commas',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('single var base case', {
              code: 'for (const {x} of obj);',
              ast: {type: 'Program', body: [{
                type: 'ForOfStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {type: 'ObjectPattern', properties: [{
                      type: 'Property',
                      computed: false,
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      key: { type: 'Identifier', name: 'x' },
                      value: { type: 'Identifier', name: 'x' },
                    }]},
                    init: null,
                  }],
                },
                right: {type: 'Identifier', name: 'obj'},
                body: {type: 'EmptyStatement'},
              }]},
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single var with trailing comma', {
              code: 'for (const {x,} of obj);',
              ast: {type: 'Program', body: [{
                type: 'ForOfStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [{
                    type: 'VariableDeclarator',
                    id: {type: 'ObjectPattern', properties: [{
                      type: 'Property',
                      computed: false,
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      key: { type: 'Identifier', name: 'x' },
                      value: { type: 'Identifier', name: 'x' },
                    }]},
                    init: null,
                  }],
                },
                right: {type: 'Identifier', name: 'obj'},
                body: {type: 'EmptyStatement'},
              }]},
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single var with double trailing comma', {
              code: 'for (const {x,,} of obj);',
              throws: 'elided commas',
              desc: 'does not work with obj, only array',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with leading comma', {
              code: 'for (const {,x} of obj);',
              throws: 'elided commas',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with double leading comma', {
              code: 'for (const {,,x} of obj);',
              throws: 'elided commas',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'for (const {x, y} of obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'x' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'y' },
                                  value: { type: 'Identifier', name: 'y' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double var with double comma', {
              code: 'for (const {x,, y} of obj);',
              throws: 'elided commas',
              desc: 'works with array but not obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'for (const {x} = a, {y} of obj);',
              throws: 'destructuring here without an assignment',
              desc: 'confusing message for only supporting one var with this for-statement type',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('destruct and non-destruct with init', {
              code: 'for (const {x} = a, y of obj);',
              throws: 'can only have one var binding',
              desc: 'confusing message for only supporting one var with this for-statement type',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('destruct and non-destruct without init', {
              code: 'for (const {x} = a, obj of obj2);',
              throws: 'can only have one var binding',
              desc: 'confusing message for only supporting one var with this for-statement type',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('non-destruct with ini and destruct', {
              code: 'for (const x = a, {y} of obj);',
              throws: 'destructuring here without an assignment',
              desc: 'confusing message for only supporting one var with this for-statement type',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('non-destruct without ini and destruct', {
              code: 'for (const x, {y} of obj);',
              throws: 'destructuring here without an assignment',
              desc: 'confusing message for only supporting one var with this for-statement type',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct with init', {
              code: 'for (const {x = y} of obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'x' },
                                  right: { type: 'Identifier', name: 'y' } } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct with and without init', {
              code: 'for (const {x = y, z} of obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'x' },
                                  right: { type: 'Identifier', name: 'y' } } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value: { type: 'Identifier', name: 'z' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct without and with init', {
              code: 'for (const {x, y = z} of obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'x' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'y' },
                                  value:
                                  { type: 'AssignmentPattern',
                                    left: { type: 'Identifier', name: 'y' },
                                    right: { type: 'Identifier', name: 'z' } } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct both with init', {
              code: 'for (const {x = y, z = a} of obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'x' },
                                  right: { type: 'Identifier', name: 'y' } } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value:
                                  { type: 'AssignmentPattern',
                                    left: { type: 'Identifier', name: 'z' },
                                    right: { type: 'Identifier', name: 'a' } } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct with rename', {
              code: 'for (const {x : y} of obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct with and without rename', {
              code: 'for (const {x : y, z} of obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value: { type: 'Identifier', name: 'z' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct without and with rename', {
              code: 'for (const {x, y : z} of obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'x' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'y' },
                                  value: { type: 'Identifier', name: 'z' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct both with rename', {
              code: 'for (const {x : y, z : a} of obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value: { type: 'Identifier', name: 'a' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct with rename and init', {
              code: 'for (const {x : y = z} of obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'y' },
                                  right: { type: 'Identifier', name: 'z' } } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('double destruct with rename and init', {
              code: 'for (const {x : y, z, a : b = c} of obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'z' },
                                  value: { type: 'Identifier', name: 'z' } },
                                { type: 'Property',
                                  computed: false,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'a' },
                                  value:
                                  { type: 'AssignmentPattern',
                                    left: { type: 'Identifier', name: 'b' },
                                    right: { type: 'Identifier', name: 'c' } } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('single destruct no assignment', {
              code: 'for (const {x});',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct no assignment', {
              code: 'for (const {x}, {y} of z);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident and destruct no assignment', {
              code: 'for (const x, {y});',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct no assignment and ident', {
              code: 'for (const {x}, y);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident with init and destruct no assignment', {
              code: 'for (const x = y, {z});',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct no assignment and ident', {
              code: 'for (const {x}, y);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and no assignment', {
              code: 'for (const {x:y});',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with default and no assignment', {
              code: 'for (const {x=y});',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and default and no assignment', {
              code: 'for (const {x:y=z});',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and with and without assignment', {
              code: 'for (const {x:y=z} = obj, {a:b=c});',
              throws: 'destructuring here without an assignment',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and without and with assignment', {
              code: 'for (const {x:y=z}, {a:b=c} of obj);',
              throws: 'destructuring must be followed by',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with colon-eq', {
              code: 'for (const {a:=c} of z);',
              throws: 'must be an identifier',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('correct dynamic property destructuring', {
              code: 'for (const {[x]: y} of obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: true,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('dynamic property destructuring missing alias', {
              code: 'for (const {[x]} of obj);',
              throws: '(:)',
              tokens: [],
            });

            test('dynamic property destructuring with default missing alias', {
              code: 'for (const {[x] = y} of obj);',
              throws: '(:)',
              tokens: [],
            });

            test('correct dynamic property destructuring with default and alias', {
              code: 'for (const {[x]: y = z} of obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: true,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'y' },
                                  right: { type: 'Identifier', name: 'z' } } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('dynamic prop as second prop', {
              code: 'for (const {a, [x]: y} of obj);',
              ast: { type: 'Program',
                body:
                  [ { type: 'ForOfStatement',
                    left:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'a' },
                                value: { type: 'Identifier', name: 'a' } },
                                { type: 'Property',
                                  computed: true,
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  key: { type: 'Identifier', name: 'x' },
                                  value: { type: 'Identifier', name: 'y' } } ] },
                          init: null } ] },
                    right: { type: 'Identifier', name: 'obj' },
                    body: { type: 'EmptyStatement' } } ] },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });
          });
        });
      });
    });

    describe('in export decl', _ => {

      // not an extensive test suite here since it's always strict mode and uses the same parsing mechanisms

      describe('regular vars', _ => {

        test('const, one var, no init, semi',{
          code: 'export const foo;',
          SCRIPT: {throws: 'module goal'},
          ast: { type: 'Program',
            body:
              [ { type: 'ExportNamedDeclaration',
                specifiers: [],
                declaration:
                { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id: { type: 'Identifier', name: 'foo' },
                      init: null } ] },
                source: null } ] },
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR],
        });

        test('const, two vars, no init, semi',{
          code: 'export const foo, bar;',
          SCRIPT: {throws: 'module goal'},
          ast: { type: 'Program',
            body:
              [ { type: 'ExportNamedDeclaration',
                specifiers: [],
                declaration:
                { type: 'VariableDeclaration',
                  kind: 'const',
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

        test('const, var with init, semi',{
          code: 'export const foo = bar;',
          SCRIPT: {throws: 'module goal'},
          ast: { type: 'Program',
            body:
              [ { type: 'ExportNamedDeclaration',
                specifiers: [],
                declaration:
                { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id: { type: 'Identifier', name: 'foo' },
                      init: { type: 'Identifier', name: 'bar' } } ] },
                source: null } ] },
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('const, two vars with both init, semi',{
          code: 'export const foo = bar, zoo = boo;',
          SCRIPT: {throws: 'module goal'},
          ast: { type: 'Program',
            body:
              [ { type: 'ExportNamedDeclaration',
                specifiers: [],
                declaration:
                { type: 'VariableDeclaration',
                  kind: 'const',
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

        test('const on next line does not trigger asi', {
          code: 'export\nconst foo',
          SCRIPT: {throws: 'module goal'},
          ast: { type: 'Program',
            body:
              [ { type: 'ExportNamedDeclaration',
                specifiers: [],
                declaration:
                { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id: { type: 'Identifier', name: 'foo' },
                      init: null } ] },
                source: null } ] },
          tokens: [$IDENT, $IDENT, $IDENT, $ASI],
        });

        test('var on next line does not trigger asi', {
          code: 'export const\nfoo',
          SCRIPT: {throws: 'module goal'},
          ast: { type: 'Program',
            body:
              [ { type: 'ExportNamedDeclaration',
                specifiers: [],
                declaration:
                { type: 'VariableDeclaration',
                  kind: 'const',
                  declarations:
                    [ { type: 'VariableDeclarator',
                      id: { type: 'Identifier', name: 'foo' },
                      init: null } ] },
                source: null } ] },
          tokens: [$IDENT, $IDENT, $IDENT, $ASI],
        });

        test('asi can not trigger if next token is ident', {
          code: 'export const\nfoo()',
          SCRIPT: {throws: 'module goal'},
          throws: 'ASI',
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });
      });

      describe('destructuring', _ => {

        describe('array', _ => {

          test('empty "array" should work even if that does not export anything', {
            code: 'export const [] = x;',
            SCRIPT: {throws: 'module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id: { type: 'ArrayPattern', elements: [] },
                        init: { type: 'Identifier', name: 'x' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('with one var, no init, semi', {
            code: 'export const [foo] = arr;',
            SCRIPT: {throws: 'module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
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
            code: 'export const [foo,,] = arr;',
            SCRIPT: {throws: 'module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
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
            code: 'export const [foo,bar] = arr;',
            SCRIPT: {throws: 'module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
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
            code: 'export const [foo] = arr, [bar] = arr2;',
            SCRIPT: {throws: 'module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
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
            code: 'export const [foo=a, bar] = arr;',
            SCRIPT: {throws: 'module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
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
            code: 'export const [foo];',
            SCRIPT: {throws: 'module goal'},
            throws: 'without an assignment',
            desc: 'module goal is always strict',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('no assignment with init', {
            code: 'export const [foo = x];',
            SCRIPT: {throws: 'module goal'},
            throws: 'without an assignment',
            desc: 'module goal is always strict',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('no assignment with two declarations first', {
            code: 'export const [foo], bar;',
            SCRIPT: {throws: 'module goal'},
            throws: 'without an assignment',
            desc: 'module goal is always strict',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('no assignment with two declarations second', {
            code: 'export const foo, [bar];',
            SCRIPT: {throws: 'module goal'},
            throws: 'without an assignment',
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          describe('rest operator', _ => {

            test('rest as the only destruct', {
              code: 'export const [...foo] = obj;',
              ast: { type: 'Program',
                body:
                  [ { type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements:
                              [ { type: 'RestElement',
                                argument: { type: 'Identifier', name: 'foo' } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                    source: null } ] },
              SCRIPT: {throws: 'module goal'},
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('rest preceded by an ident', {
              code: 'export const [foo, ...bar] = obj;',
              ast: { type: 'Program',
                body:
                  [ { type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements:
                              [ { type: 'Identifier', name: 'foo' },
                                { type: 'RestElement',
                                  argument: { type: 'Identifier', name: 'bar' } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                    source: null } ] },
              SCRIPT: {throws: 'module goal'},
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('rest followed by an ident', {
              code: 'export const [...foo, bar] = obj;',
              throws: 'follow a spread',
              SCRIPT: {throws: 'module goal'},
              tokens: [],
            });

            test('rest followed by a trailing comma', {
              code: 'export const [...foo,] = obj;',
              throws: 'follow a spread',
              desc: 'while feasible the syntax spec currently does not have a rule for allowing trailing commas after rest',
              SCRIPT: {throws: 'module goal'},
              tokens: [],
            });

            test('rest followed by two commas', {
              code: 'export const [...foo,,] = obj;',
              throws: 'follow a spread',
              SCRIPT: {throws: 'module goal'},
              tokens: [],
            });

            test('rest on a nested destruct', {
              code: 'export const [...[foo, bar]] = obj;',
              ast: { type: 'Program',
                body:
                  [ { type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements:
                              [ { type: 'RestElement',
                                argument:
                                { type: 'ArrayPattern',
                                  elements:
                                    [ { type: 'Identifier', name: 'foo' },
                                      { type: 'Identifier', name: 'bar' } ] } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                    source: null } ] },
              SCRIPT: {throws: 'module goal'},
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('trailing comma after rest on a nested destruct', {
              code: 'export const [...[foo, bar],] = obj;',
              throws: 'follow a spread',
              SCRIPT: {throws: 'module goal'},
              tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double trailing comma after rest on a nested destruct', {
              code: 'export const [...[foo, bar],,] = obj;',
              throws: 'follow a spread',
              SCRIPT: {throws: 'module goal'},
              tokens: [],
            });

            test('second param rest on a nested destruct', {
              code: 'export const [x, ...[foo, bar]] = obj;',
              ast: { type: 'Program',
                body:
                  [ { type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration:
                    { type: 'VariableDeclaration',
                      kind: 'const',
                      declarations:
                        [ { type: 'VariableDeclarator',
                          id:
                          { type: 'ArrayPattern',
                            elements:
                              [ { type: 'Identifier', name: 'x' },
                                { type: 'RestElement',
                                  argument:
                                  { type: 'ArrayPattern',
                                    elements:
                                      [ { type: 'Identifier', name: 'foo' },
                                        { type: 'Identifier', name: 'bar' } ] } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                    source: null } ] },
              SCRIPT: {throws: 'module goal'},
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('spread with default', {
              code: 'export const [...bar = foo] = obj;',
              throws: 'a rest value',
              desc: 'rest cannot get a default in var decls but they can as func args',
              SCRIPT: {throws: 'module goal'},
              tokens: [],
            });

            test('spread with default', {
              code: 'export const [... ...foo] = obj;',
              throws: 'Can not spread twice',
              SCRIPT: {throws: 'module goal'},
              tokens: [],
            });

            test('spread with default', {
              code: 'export const [...] = obj;',
              throws: 'missing an ident or destruct',
              SCRIPT: {throws: 'module goal'},
              tokens: [],
            });

            test('spread with default', {
              code: 'export const [...,] = obj;',
              throws: 'missing an ident or destruct',
              SCRIPT: {throws: 'module goal'},
              tokens: [],
            });

            test('spread with default', {
              code: 'export const [.x] = obj;',
              throws: 'Expecting nested ident or destructuring pattern',
              SCRIPT: {throws: 'module goal'},
              tokens: [],
            });

            test('spread with default', {
              code: 'export const [..x] = obj;',
              throws: 'Expecting nested ident or destructuring pattern',
              SCRIPT: {throws: 'module goal'},
              tokens: [],
            });
          });
        });

        describe('object', _ => {

          test('empty obj', {
            code: 'export const {} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id: { type: 'ObjectPattern', properties: [] },
                        init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('empty obj with trailing comma', {
            code: 'export const {,} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'elided commas',
            desc: 'works for array but not for obj',
            tokens: [],
          });

          test('empty obj with elided commas', {
            code: 'export const {,,} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'elided commas',
            desc: 'works for array but not for obj',
            tokens: [],
          });

          test('single var base case', {
            code: 'export const {x} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value: { type: 'Identifier', name: 'x' } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single var with trailing comma', {
            code: 'export const {x,} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value: { type: 'Identifier', name: 'x' } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single var with double trailing comma', {
            code: 'export const {x,,} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'elided commas',
            desc: 'does not work with obj, only array',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single var with leading comma', {
            code: 'export const {,x} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'elided commas',
            desc: 'works with array but not with obj',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single var with double leading comma', {
            code: 'export const {,,x} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'elided commas',
            desc: 'works with array but not with obj',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double var simple', {
            code: 'export const {x, y} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value: { type: 'Identifier', name: 'x' } },
                              { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'y' },
                                value: { type: 'Identifier', name: 'y' } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double var with double comma', {
            code: 'export const {x,, y} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'elided commas',
            desc: 'works with array but not obj',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double var simple', {
            code: 'export const {x} = a, {y} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value: { type: 'Identifier', name: 'x' } } ] },
                        init: { type: 'Identifier', name: 'a' } },
                        { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'y' },
                                value: { type: 'Identifier', name: 'y' } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('destruct and non-destruct with init', {
            code: 'export const {x} = a, y = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value: { type: 'Identifier', name: 'x' } } ] },
                        init: { type: 'Identifier', name: 'a' } },
                        { type: 'VariableDeclarator',
                          id: { type: 'Identifier', name: 'y' },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('destruct and non-destruct without init', {
            code: 'export const {x} = a, obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value: { type: 'Identifier', name: 'x' } } ] },
                        init: { type: 'Identifier', name: 'a' } },
                        { type: 'VariableDeclarator',
                          id: { type: 'Identifier', name: 'obj' },
                          init: null } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('non-destruct with ini and destruct', {
            code: 'export const x = a, {y} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id: { type: 'Identifier', name: 'x' },
                        init: { type: 'Identifier', name: 'a' } },
                        { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'y' },
                                value: { type: 'Identifier', name: 'y' } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('non-destruct without ini and destruct', {
            code: 'export const x, {y} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id: { type: 'Identifier', name: 'x' },
                        init: null },
                        { type: 'VariableDeclarator',
                          id:
                          { type: 'ObjectPattern',
                            properties:
                              [ { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'y' },
                                value: { type: 'Identifier', name: 'y' } } ] },
                          init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct with init', {
            code: 'export const {x = y} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value:
                              { type: 'AssignmentPattern',
                                left: { type: 'Identifier', name: 'x' },
                                right: { type: 'Identifier', name: 'y' } } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            desc: 'note: value gets the assignment pattern! not the objectpattern:properties',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct with and without init', {
            code: 'export const {x = y, z} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value:
                              { type: 'AssignmentPattern',
                                left: { type: 'Identifier', name: 'x' },
                                right: { type: 'Identifier', name: 'y' } } },
                              { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'z' },
                                value: { type: 'Identifier', name: 'z' } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct without and with init', {
            code: 'export const {x, y = z} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value: { type: 'Identifier', name: 'x' } },
                              { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'y' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'y' },
                                  right: { type: 'Identifier', name: 'z' } } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct both with init', {
            code: 'export const {x = y, z = a} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value:
                              { type: 'AssignmentPattern',
                                left: { type: 'Identifier', name: 'x' },
                                right: { type: 'Identifier', name: 'y' } } },
                              { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'z' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'z' },
                                  right: { type: 'Identifier', name: 'a' } } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct with rename', {
            code: 'export const {x : y} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value: { type: 'Identifier', name: 'y' } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct with and without rename', {
            code: 'export const {x : y, z} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value: { type: 'Identifier', name: 'y' } },
                              { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'z' },
                                value: { type: 'Identifier', name: 'z' } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct without and with rename', {
            code: 'export const {x, y : z} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value: { type: 'Identifier', name: 'x' } },
                              { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'y' },
                                value: { type: 'Identifier', name: 'z' } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct both with rename', {
            code: 'export const {x : y, z : a} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value: { type: 'Identifier', name: 'y' } },
                              { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'z' },
                                value: { type: 'Identifier', name: 'a' } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct with rename and init', {
            code: 'export const {x : y = z} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value:
                              { type: 'AssignmentPattern',
                                left: { type: 'Identifier', name: 'y' },
                                right: { type: 'Identifier', name: 'z' } } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct with rename and init', {
            code: 'export const {x : y, z, a : b = c} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value: { type: 'Identifier', name: 'y' } },
                              { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'z' },
                                value: { type: 'Identifier', name: 'z' } },
                              { type: 'Property',
                                computed: false,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'a' },
                                value:
                                { type: 'AssignmentPattern',
                                  left: { type: 'Identifier', name: 'b' },
                                  right: { type: 'Identifier', name: 'c' } } } ] },
                        init: { type: 'Identifier', name: 'obj' } } ] },
                  source: null } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct no assignment', {
            code: 'export const {x};',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct no assignment', {
            code: 'export const {x}, {y} = z;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('ident and destruct no assignment', {
            code: 'export const x, {y};',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('destruct no assignment and ident', {
            code: 'export const {x}, y;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('ident with init and destruct no assignment', {
            code: 'export const x = y, {z};',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct with rename and no assignment', {
            code: 'export const {x:y};',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct with default and no assignment', {
            code: 'export const {x=y};',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct with rename and default and no assignment', {
            code: 'export const {x:y=z};',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct with rename and default and with and without assignment', {
            code: 'export const {x:y=z} = obj, {a:b=c};',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('double destruct with rename and default and without and with assignment', {
            code: 'export const {x:y=z}, {a:b=c} = obj;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'destructuring here without an assignment',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('single destruct with colon-eq', {
            code: 'export const {a:=c} = z;',
            SCRIPT: {throws: 'can only be used with the module goal'},
            throws: 'must be an identifier',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('correct dynamic property destructuring', {
            code: 'export const {[x]: y} = z;',
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: true,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value: { type: 'Identifier', name: 'y' } } ] },
                        init: { type: 'Identifier', name: 'z' } } ] },
                  source: null } ] },
            SCRIPT: {throws: 'can only be used with the module goal'},
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('dynamic property destructuring missing alias', {
            code: 'export const {[x]} = z;',
            throws: '(:)',
            SCRIPT: {throws: 'can only be used with the module goal'},
            tokens: [],
          });

          test('dynamic property destructuring missing alias and init', {
            code: 'export const {[x]};',
            throws: '(:)',
            SCRIPT: {throws: 'can only be used with the module goal'},
            tokens: [],
          });

          test('dynamic property destructuring missing assignment', {
            code: 'export const {[x]: y};',
            throws: 'without an assignment',
            SCRIPT: {throws: 'can only be used with the module goal'},
            tokens: [],
          });

          test('dynamic property destructuring with default missing alias', {
            code: 'export const {[x] = y} = z;',
            throws: '(:)',
            SCRIPT: {throws: 'can only be used with the module goal'},
            tokens: [],
          });

          test('dynamic property destructuring with default and alias missing init', {
            code: 'export const {[x]: y = z};',
            throws: 'without an assignment',
            SCRIPT: {throws: 'can only be used with the module goal'},
            tokens: [],
          });

          test('correct dynamic property destructuring with default and alias', {
            code: 'export const {[x]: y = z} = a;',
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: true,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'x' },
                              value:
                              { type: 'AssignmentPattern',
                                left: { type: 'Identifier', name: 'y' },
                                right: { type: 'Identifier', name: 'z' } } } ] },
                        init: { type: 'Identifier', name: 'a' } } ] },
                  source: null } ] },
            SCRIPT: {throws: 'can only be used with the module goal'},
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('dynamic prop as second prop', {
            code: 'export const {a, [x]: y} = a;',
            ast: { type: 'Program',
              body:
                [ { type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration:
                  { type: 'VariableDeclaration',
                    kind: 'const',
                    declarations:
                      [ { type: 'VariableDeclarator',
                        id:
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'a' },
                              value: { type: 'Identifier', name: 'a' } },
                              { type: 'Property',
                                computed: true,
                                kind: 'init',
                                method: false,
                                shorthand: false,
                                key: { type: 'Identifier', name: 'x' },
                                value: { type: 'Identifier', name: 'y' } } ] },
                        init: { type: 'Identifier', name: 'a' } } ] },
                  source: null } ] },
            SCRIPT: {throws: 'can only be used with the module goal'},
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });
        });
      });
    });
  });
});

// TODO: const probably has some constant-specific rules to test from the parser's perspective?
