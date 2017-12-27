let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('var statement', _ => {

  describe('regular vars', _ => {

    test('var, one var, no init, semi',{
      code: 'var foo;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'var', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR],
    });

    test('var, one var, no init, eof',{
      code: 'var foo',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'var', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
        ]}
      ]},
      tokens: [$IDENT, $IDENT, $ASI],
    });

    test('var, two vars, no init, semi',{
      code: 'var foo, bar;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'var', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('var, two vars, no init, eof',{
      code: 'var foo, bar',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'var', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('var, var with init, semi',{
      code: 'var foo = bar;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'var', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('var, var with init, eof',{
      code: 'var foo = bar',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'var', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('var, var with init, asi',{
      code: 'var foo = bar\nvar zoo;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'var', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
        ]},
        {type: 'VariableDeclaration', kind: 'var', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: null},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR],
    });

    test('var, two vars with both init, semi',{
      code: 'var foo = bar, zoo = boo;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'var', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('var, two vars with both init, asi',{
      code: 'var foo = bar, zoo = boo',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'var', declarations: [
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
          {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
        ]},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
  });

  describe('destructuring', _ => {

    // TIL

    describe('array', _ => {

      // TODO
      // var [] = x;
      // var [,] = x;
      // var [,,] = x;
      // var [foo] = x;
      // var [foo,] = x;
      // var [foo,,] = x;
      // var [,foo] = x;
      // var [,,foo] = x;
      // var [foo,bar] = x;
      // var [foo,,bar] = x;
      // var [foo] = x, [foo] = y;
      // var [foo] = x, b;
      // var [foo] = x, b = y;
      // var x, [foo] = y;
      // var x = y, [foo] = z;
      // var [foo=a] = c;
      // var [foo=a,bar] = x;
      // var [foo,bar=b] = x;
      // var [foo=a,bar=b] = x;
      // var [foo];                 // error
      // var [foo=a];               // error
      // var [foo], bar;            // error
      // var foo, [bar];            // error

    });

    describe('object', _ => {

      // TODO
      // var {} = x;
      // var {,} = x;             //?
      // var {,,} = x;            //?
      // var {foo} = x;
      // var {foo,} = x;
      // var {foo,,} = x;         //?
      // var {,foo} = x;          //?
      // var {foo,bar} = x;
      // var {foo,,bar} = x;      //?
      // var {foo} = x, {foo} = y;
      // var {foo} = x, b;
      // var {foo} = x, b = y;
      // var x, {foo} = y;
      // var {foo=a} = x;
      // var {foo=a,bar} = x;
      // var {foo,bar=b} = x;
      // var {foo=a,bar=b} = x;
      // var {foo:a} = x;
      // var {foo:a,bar} = x;
      // var {foo,bar:b} = x;
      // var {foo:a,bar:b} = x;
      // var {foo:a,bar:b} = x;
      // var {foo:a=b} = x;
      // var {foo:a=b, bar:c=d} = x;
      // var {foo};                // ERROR

    });
  });

  //[
  //  '  array destructuring',
  //  {
  //    code: 'var [foo] = arr;',
  //    ast: {type: 'Program', body: [
  //      {type: 'VariableDeclaration', kind: 'var', declarations: [
  //        {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
  //      ]},
  //    ]},
  //    desc: 'var, one var, no init, semi',
  //    tokens: [$IDENT, $IDENT, $PUNCTUATOR],
  //  },
  //],
  //[
  //  '  object destructuring',
  //  {
  //    code: 'var {foo} = arr;',
  //    ast: {type: 'Program', body: [
  //      {type: 'VariableDeclaration', kind: 'var', declarations: [
  //        {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
  //      ]},
  //    ]},
  //    desc: 'var, one var, no init, semi',
  //    tokens: [$IDENT, $IDENT, $PUNCTUATOR],
  //  },
  //],
});

// forbid "let" and "static" only in strict mode
