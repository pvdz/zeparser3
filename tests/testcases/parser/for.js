let {
  $IDENT,
  $NUMBER_DEC,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('for statement', _ => {

  describe('for-loop', _ => {

    test('empty for-classic',{
      code: 'for (;;);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement', init: null, test: null, update: null, body: {type: 'EmptyStatement'}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, only init, empty body',{
      code: 'for (a;;);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement', init: {type: 'Identifier', name: 'a'}, test: null, update: null, body: {type: 'EmptyStatement'}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, only test, empty body',{
      code: 'for (;b;);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement', init: null, test: {type: 'Identifier', name: 'b'}, update: null, body: {type: 'EmptyStatement'}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, only update, empty body',{
      code: 'for (;;c);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement', init: null, test: null, update: {type: 'Identifier', name: 'c'}, body: {type: 'EmptyStatement'}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, only init and test, empty body',{
      code: 'for (a;b;);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement', init: {type: 'Identifier', name: 'a'}, test: {type: 'Identifier', name: 'b'}, update: null, body: {type: 'EmptyStatement'}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, only init and update, empty body',{
      code: 'for (a;;c);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement', init: {type: 'Identifier', name: 'a'}, test: null, update: {type: 'Identifier', name: 'c'}, body: {type: 'EmptyStatement'}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, only test and update, empty body',{
      code: 'for (;b;c);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement', init: null, test: {type: 'Identifier', name: 'b'}, update: {type: 'Identifier', name: 'c'}, body: {type: 'EmptyStatement'}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, init and test and update, empty body',{
      code: 'for (a;b;c);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement', init: {type: 'Identifier', name: 'a'}, test: {type: 'Identifier', name: 'b'}, update: {type: 'Identifier', name: 'c'}, body: {type: 'EmptyStatement'}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, init and test and update, empty body',{
      code: 'for (a + b * c * d;b;c);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '+',
            right: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '*',
                right: {type: 'Identifier', name: 'c'},
              },
              operator: '*',
              right: {type: 'Identifier', name: 'd'},
            },
          },
          test: {type: 'Identifier', name: 'b'},
          update: {type: 'Identifier', name: 'c'},
          body: {type: 'EmptyStatement'}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, init and test and update, empty body',{
      code: 'for (a * b + c * d;b;c);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {
            type: 'BinaryExpression',
            left: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '*',
              right: {type: 'Identifier', name: 'b'},
            },
            operator: '+',
            right: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'c'},
              operator: '*',
              right: {type: 'Identifier', name: 'd'},
            },
          },
          test: {type: 'Identifier', name: 'b'},
          update: {type: 'Identifier', name: 'c'},
          body: {type: 'EmptyStatement'}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, expression disambiguation test',{
      code: 'for ((a * b + c) * d;b;c);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {
            type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '*',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '+',
              right: {type: 'Identifier', name: 'c'},
            },
            operator: '*',
            right: {type: 'Identifier', name: 'd'},
          },
          test: {type: 'Identifier', name: 'b'},
          update: {type: 'Identifier', name: 'c'},
          body: {type: 'EmptyStatement'}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });
  });

  describe('var decls', _ => {

    test('for-classic, one var, empty body',{
      code: 'for (var a;;);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {type: 'VariableDeclaration', kind: 'var', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
          test: null,
          update: null,
          body: {type: 'EmptyStatement'}
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, three vars, empty body',{
      code: 'for (var a,b,c;;);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'c'}, init: null},
          ]},
          test: null,
          update: null,
          body: {type: 'EmptyStatement'}
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, one let, empty body',{
      code: 'for (let a;;);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {type: 'VariableDeclaration', kind: 'let', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
          test: null,
          update: null,
          body: {type: 'EmptyStatement'}
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, three lets, empty body',{
      code: 'for (let a,b,c;;);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'c'}, init: null},
          ]},
          test: null,
          update: null,
          body: {type: 'EmptyStatement'}
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, only init, empty body',{
      code: 'for (const a;;);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {type: 'VariableDeclaration', kind: 'const', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
          test: null,
          update: null,
          body: {type: 'EmptyStatement'}
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, three consts, empty body',{
      code: 'for (const a,b,c;;);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {type: 'VariableDeclaration', kind: 'const', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'c'}, init: null},
          ]},
          test: null,
          update: null,
          body: {type: 'EmptyStatement'}
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
  });

  describe('vars with initializers', _ => {

    test('for-classic, one var with init, empty body',{
      code: 'for (var a=1;;);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: {type: 'Literal', value: '<TODO>', raw: '1'}},
          ]},
          test: null,
          update: null,
          body: {type: 'EmptyStatement'}
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, two vars only first has init, empty body',{
      code: 'for (var a=1, b;;);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: {type: 'Literal', value: '<TODO>', raw: '1'}},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: null},
          ]},
          test: null,
          update: null,
          body: {type: 'EmptyStatement'}
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, two vars only second has init, empty body',{
      code: 'for (var a, b=1;;);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: {type: 'Literal', value: '<TODO>', raw: '1'}},
          ]},
          test: null,
          update: null,
          body: {type: 'EmptyStatement'}
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('for-classic, two vars both have init, empty body',{
      code: 'for (var a=1, b=2;;);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: {type: 'Literal', value: '<TODO>', raw: '1'}},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: {type: 'Literal', value: '<TODO>', raw: '2'}},
          ]},
          test: null,
          update: null,
          body: {type: 'EmptyStatement'}
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
  });

  describe('for-in', _ => {

    test('empty for-in',{
      code: 'for (a in b);',
      ast: {type: 'Program', body: [
        {type: 'ForInStatement', left: {type: 'Identifier', name: 'a'}, right: {type: 'Identifier', name: 'b'}, body: {type: 'EmptyStatement'}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('empty for-in',{
      code: 'for (var a in b);',
      ast: {type: 'Program', body: [
        {type: 'ForInStatement',
          left: {type: 'VariableDeclaration', kind: 'var', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
          right: {type: 'Identifier', name: 'b'},
          body: {type: 'EmptyStatement'},
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('empty for-in',{
      code: 'for (let a in b);',
      ast: {type: 'Program', body: [
        {type: 'ForInStatement',
          left: {type: 'VariableDeclaration', kind: 'let', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
          right: {type: 'Identifier', name: 'b'},
          body: {type: 'EmptyStatement'},
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('empty for-in',{
      code: 'for (const a in b);',
      ast: {type: 'Program', body: [
        {type: 'ForInStatement',
          left: {type: 'VariableDeclaration', kind: 'const', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
          right: {type: 'Identifier', name: 'b'},
          body: {type: 'EmptyStatement'},
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });
  });

  describe('for-of', _ => {

    test('empty for-of',{
      code: 'for (a of b);',
      ast: {type: 'Program', body: [
        {type: 'ForOfStatement', left: {type: 'Identifier', name: 'a'}, right: {type: 'Identifier', name: 'b'}, body: {type: 'EmptyStatement'}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('empty for-of',{
      code: 'for (var a of b);',
      ast: {type: 'Program', body: [
        {type: 'ForOfStatement',
          left: {type: 'VariableDeclaration', kind: 'var', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
          right: {type: 'Identifier', name: 'b'},
          body: {type: 'EmptyStatement'},
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('empty for-of',{
      code: 'for (let a of b);',
      ast: {type: 'Program', body: [
        {type: 'ForOfStatement',
          left: {type: 'VariableDeclaration', kind: 'let', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
          right: {type: 'Identifier', name: 'b'},
          body: {type: 'EmptyStatement'},
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('empty for-of',{
      code: 'for (const a of b);',
      ast: {type: 'Program', body: [
        {type: 'ForOfStatement',
          left: {type: 'VariableDeclaration', kind: 'const', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
          right: {type: 'Identifier', name: 'b'},
          body: {type: 'EmptyStatement'},
        },
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });
  });

  describe('async for', _ => {
    // https://github.com/tc39/proposal-async-iteration

    //test('base case', {
    //  code: `
    //    async function * fn() {
    //      for await (x of y) {
    //      }
    //    }
    //  `,
    //});
  })
});
