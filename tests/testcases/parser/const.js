let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('const statement', _ => {

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
  });

  describe('destructurnig', _ => {

    test('array', {
      code: 'const [foo] = arr;',
      ast: {type: 'Program', body: [{
        type: 'VariableDeclaration',
        kind: 'const',
        declarations: [{
          type: 'VariableDeclarator',
          id: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'foo'}]},
          init: {type: 'Identifier', name: 'arr'}},
        ]},
      ]},
      desc: 'const, one var, no init, semi',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('object', {
      code: 'const {foo} = arr;',
      ast: {type: 'Program', body: [{
        type: 'VariableDeclaration',
        kind: 'const',
        declarations: [{
          type: 'VariableDeclarator',
          id: {type: 'ObjectPattern', properties: [{type: 'Identifier', name: 'foo'}]},
          init: {type: 'Identifier', name: 'arr'}},
        ]},
      ]},
      desc: 'const, one var, no init, semi',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });
  });
});
