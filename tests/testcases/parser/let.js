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

  describe('array destructuring', _ => {

    test('let, destructured array with one var, no init, semi',{
      code: 'let [foo] = arr;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'foo'}]}, init: {type: 'Identifier', name: 'arr'}},
        ]},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });
    
    test('let, destructuring with leading elisions, no init, semi',{
      code: 'let [,,,foo] = arr;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'ArrayPattern', elements: [
            null,
            null,
            null,
            {type: 'Identifier', name: 'foo'},
          ]}, init: {type: 'Identifier', name: 'arr'}},
        ]},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });
    
    test('let, destructuring with trailing elisions, no init, semi',{
      code: 'let [foo,,,] = arr;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'ArrayPattern', elements: [
            {type: 'Identifier', name: 'foo'},
            null,
            null,
          ]}, init: {type: 'Identifier', name: 'arr'}},
        ]},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });
    
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

    false && describe('let as identifier in sloppy mode', _ => {

      // these tests must run in module mode and in explicit strict mode toggles
      // (note: the spec doesn't explicitly allow `let` as a var name but rather forbids
      // it under certain situations. For example: in strict mode and as let/const names)

      describe('let as var name', _ => {

        test('var decl', {
          code: 'var let;',
          throws: 'var name in strict',
          SLOPPY: {SCRIPT: {
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
          }},
          tokens: [$IDENT, $IDENT, $PUNCTUATOR],
        });
      });

      describe('statement start', _ => {

        // A statement can not start with dynamic property access on `let` (`let[foo]=bar`)
        // because it would be ambiguous with let destructuring. See note in
        // https://tc39.github.io/ecma262/#prod-ExpressionStatement

        test('in global', {
          code: 'let[foo];',
          throws: 'xxx',
          tokens: [],
        });

        test('in regular function', {
          code: 'function f(){ let[foo]; }',
          throws: 'xxx',
          tokens: [],
        });

        test('in arrow expr body', {
          code: '_ => let[foo];',
          throws: 'xxx',
          desc: '(arrows are not strict by default) the non-block arrow body is an expression',
          tokens: [],
        });

        test('in arrow stmt body', {
          code: '_ => { let[foo]; }',
          throws: 'xxx',
          desc: '(arrows are not strict by default) the non-block arrow body is a statement block',
          tokens: [],
        });

        test('in classes', {
          code: 'class x { foo() { let[foo]; }}',
          throws: 'xxx',
          tokens: [],
          desc: 'classes are implicitly always strict',
        });
      });
    });
  });

  //[
  //  '  object destructuring',
  //  {
  //    code: 'let {foo} = arr;',
  //    ast: {type: 'Program', body: [
  //      {type: 'VariableDeclaration', kind: 'let', declarations: [
  //        {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
  //      ]},
  //    ]},
  //    desc: 'let, one var, no init, semi',
  //    tokens: [$IDENT, $IDENT, $PUNCTUATOR],
  //  },
  //],
});
