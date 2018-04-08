let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../../src/zetokenizer');


module.exports = (describe, test) => describe('unary ops', _ => {

  describe('positive prefix', _ => {

    test('statement',{
      code: '+a',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'UnaryExpression',
          operator: '+',
          prefix: true,
          argument: {type: 'Identifier', name: 'a'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $ASI],
    });
  });

  describe('negative prefix', _ => {

    test('statement',{
      code: '-a',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'UnaryExpression',
          operator: '-',
          prefix: true,
          argument: {type: 'Identifier', name: 'a'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $ASI],
    });
  });

  describe('bitwise invert', _ => {

    test('statement',{
      code: '~a',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'UnaryExpression',
          operator: '~',
          prefix: true,
          argument: {type: 'Identifier', name: 'a'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $ASI],
    });
  });

  describe('incremental prefix', _ => {

    describe('sans newline', _ => {

      test('base',{
        code: '++a',
        ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {
                type: 'UpdateExpression',
                operator: '++',
                prefix: true,
                argument: {type: 'Identifier', name: 'a'},
              }},
          ]},
        tokens: [$PUNCTUATOR, $IDENT, $ASI],
      });

      test('func',{
        code: 'function f(){ return ++a; }',
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
                    [ { type: 'ReturnStatement',
                      argument:
                        { type: 'UpdateExpression',
                          operator: '++',
                          prefix: true,
                          argument: { type: 'Identifier', name: 'a' } } } ] } } ] },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('arrow',{
        code: 'let x = () => ++a;',
        ast: { type: 'Program',
          body:
            [ { type: 'VariableDeclaration',
              kind: 'let',
              declarations:
                [ { type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: 'x' },
                  init:
                    { type: 'ArrowFunctionExpression',
                      params: [],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body:
                        { type: 'UpdateExpression',
                          operator: '++',
                          prefix: true,
                          argument: { type: 'Identifier', name: 'a' } } } } ] } ] } ,
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('statement header',{
        code: 'if (++a);',
        ast: { type: 'Program',
          body:
            [ { type: 'IfStatement',
              test:
                { type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: { type: 'Identifier', name: 'a' } },
              consequent: { type: 'EmptyStatement' },
              alternate: null } ] },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('sub-statement',{
        code: 'if (a) ++a;',
        ast: { type: 'Program',
          body:
            [ { type: 'IfStatement',
              test: { type: 'Identifier', name: 'a' },
              consequent:
                { type: 'ExpressionStatement',
                  expression:
                    { type: 'UpdateExpression',
                      operator: '++',
                      prefix: true,
                      argument: { type: 'Identifier', name: 'a' } } },
              alternate: null } ] },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
    });

    describe('with newline', _ => {

      test('base',{
        code: '++\na',
        ast: { type: 'Program',
          body:
            [ { type: 'ExpressionStatement',
              expression:
                { type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: { type: 'Identifier', name: 'a' } } } ] },
        tokens: [$PUNCTUATOR, $IDENT, $ASI],
      });

      test('func',{
        code: 'function f(){ return ++\na; }',
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
                    [ { type: 'ReturnStatement',
                      argument:
                        { type: 'UpdateExpression',
                          operator: '++',
                          prefix: true,
                          argument: { type: 'Identifier', name: 'a' } } } ] } } ] },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('arrow',{
        code: 'let x = () => ++\na;',
        ast: { type: 'Program',
          body:
            [ { type: 'VariableDeclaration',
              kind: 'let',
              declarations:
                [ { type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: 'x' },
                  init:
                    { type: 'ArrowFunctionExpression',
                      params: [],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body:
                        { type: 'UpdateExpression',
                          operator: '++',
                          prefix: true,
                          argument: { type: 'Identifier', name: 'a' } } } } ] } ] },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

      test('statement header',{
        code: 'if (++\na);',
        ast: { type: 'Program',
          body:
            [ { type: 'IfStatement',
              test:
                { type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: { type: 'Identifier', name: 'a' } },
              consequent: { type: 'EmptyStatement' },
              alternate: null } ] },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('sub-statement',{
        code: 'if (a) ++\na;',
        ast: { type: 'Program',
          body:
            [ { type: 'IfStatement',
              test: { type: 'Identifier', name: 'a' },
              consequent:
                { type: 'ExpressionStatement',
                  expression:
                    { type: 'UpdateExpression',
                      operator: '++',
                      prefix: true,
                      argument: { type: 'Identifier', name: 'a' } } },
              alternate: null } ] },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
    });
  });

  describe('decremental prefix', _ => {

    describe('sans newline', _ => {

      test('base',{
        code: '--a',
        ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {
                type: 'UpdateExpression',
                operator: '--',
                prefix: true,
                argument: {type: 'Identifier', name: 'a'},
              }},
          ]},
        tokens: [$PUNCTUATOR, $IDENT, $ASI],
      });

      test('func',{
        code: 'function f(){ return --a; }',
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
                    [ { type: 'ReturnStatement',
                      argument:
                        { type: 'UpdateExpression',
                          operator: '--',
                          prefix: true,
                          argument: { type: 'Identifier', name: 'a' } } } ] } } ] },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('arrow',{
        code: 'let x = () => --a;',
        ast: { type: 'Program',
          body:
            [ { type: 'VariableDeclaration',
              kind: 'let',
              declarations:
                [ { type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: 'x' },
                  init:
                    { type: 'ArrowFunctionExpression',
                      params: [],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body:
                        { type: 'UpdateExpression',
                          operator: '--',
                          prefix: true,
                          argument: { type: 'Identifier', name: 'a' } } } } ] } ] } ,
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('statement header',{
        code: 'if (--a);',
        ast: { type: 'Program',
          body:
            [ { type: 'IfStatement',
              test:
                { type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: { type: 'Identifier', name: 'a' } },
              consequent: { type: 'EmptyStatement' },
              alternate: null } ] },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('sub-statement',{
        code: 'if (a) --a;',
        ast: { type: 'Program',
          body:
            [ { type: 'IfStatement',
              test: { type: 'Identifier', name: 'a' },
              consequent:
                { type: 'ExpressionStatement',
                  expression:
                    { type: 'UpdateExpression',
                      operator: '--',
                      prefix: true,
                      argument: { type: 'Identifier', name: 'a' } } },
              alternate: null } ] },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
    });

    describe('with newline', _ => {

      test('base',{
        code: '--\na',
        ast: { type: 'Program',
          body:
            [ { type: 'ExpressionStatement',
              expression:
                { type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: { type: 'Identifier', name: 'a' } } } ] },
        tokens: [$PUNCTUATOR, $IDENT, $ASI],
      });

      test('func',{
        code: 'function f(){ return --\na; }',
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
                    [ { type: 'ReturnStatement',
                      argument:
                        { type: 'UpdateExpression',
                          operator: '--',
                          prefix: true,
                          argument: { type: 'Identifier', name: 'a' } } } ] } } ] },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('arrow',{
        code: 'let x = () => --\na;',
        ast: { type: 'Program',
          body:
            [ { type: 'VariableDeclaration',
              kind: 'let',
              declarations:
                [ { type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: 'x' },
                  init:
                    { type: 'ArrowFunctionExpression',
                      params: [],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body:
                        { type: 'UpdateExpression',
                          operator: '--',
                          prefix: true,
                          argument: { type: 'Identifier', name: 'a' } } } } ] } ] },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('statement header',{
        code: 'if (--\na);',
        ast: { type: 'Program',
          body:
            [ { type: 'IfStatement',
              test:
                { type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: { type: 'Identifier', name: 'a' } },
              consequent: { type: 'EmptyStatement' },
              alternate: null } ] },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('sub-statement',{
        code: 'if (a) --\na;',
        ast: { type: 'Program',
          body:
            [ { type: 'IfStatement',
              test: { type: 'Identifier', name: 'a' },
              consequent:
                { type: 'ExpressionStatement',
                  expression:
                    { type: 'UpdateExpression',
                      operator: '--',
                      prefix: true,
                      argument: { type: 'Identifier', name: 'a' } } },
              alternate: null } ] },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
    });
  });

  describe('incremental suffix', _ => {

    describe('sans newline', _ => {

      test('base',{
        code: 'a++',
        ast: { type: 'Program',
          body:
            [ { type: 'ExpressionStatement',
              expression:
                { type: 'UpdateExpression',
                  argument: { type: 'Identifier', name: 'a' },
                  operator: '++',
                  prefix: false } } ] },
        tokens: [$IDENT, $PUNCTUATOR, $ASI],
      });

      test('func',{
        code: 'function f(){ return a++; }',
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
                    [ { type: 'ReturnStatement',
                      argument:
                        { type: 'UpdateExpression',
                          argument: { type: 'Identifier', name: 'a' },
                          operator: '++',
                          prefix: false } } ] } } ] },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('arrow',{
        code: 'let x = () => a++;',
        ast: { type: 'Program',
          body:
            [ { type: 'VariableDeclaration',
              kind: 'let',
              declarations:
                [ { type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: 'x' },
                  init:
                    { type: 'ArrowFunctionExpression',
                      params: [],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body:
                        { type: 'UpdateExpression',
                          argument: { type: 'Identifier', name: 'a' },
                          operator: '++',
                          prefix: false } } } ] } ] },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('statement header',{
        code: 'if (a++);',
        ast: { type: 'Program',
          body:
            [ { type: 'IfStatement',
              test:
                { type: 'UpdateExpression',
                  argument: { type: 'Identifier', name: 'a' },
                  operator: '++',
                  prefix: false },
              consequent: { type: 'EmptyStatement' },
              alternate: null } ] },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('sub-statement',{
        code: 'if (a) a++;',
        ast: { type: 'Program',
          body:
            [ { type: 'IfStatement',
              test: { type: 'Identifier', name: 'a' },
              consequent:
                { type: 'ExpressionStatement',
                  expression:
                    { type: 'UpdateExpression',
                      argument: { type: 'Identifier', name: 'a' },
                      operator: '++',
                      prefix: false } },
              alternate: null } ] },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('with newline', _ => {
      // TODO: could work throw a more relevant error message when detecting this error pattern

      test('base',{
        code: 'a\n++',
        throws: 'Expected to parse a value',
        tokens: [$PUNCTUATOR, $IDENT, $ASI],
      });

      test('func',{
        code: 'function f(){ return a\n++; }',
        throws: 'Expected to parse a value',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('arrow',{
        code: 'let x = () => a\n++;',
        throws: 'Expected to parse a value',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('statement header',{
        code: 'if (a\n++);',
        throws: 'Found newline before ++/--',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('sub-statement',{
        code: 'if (a) a\n++;',
        throws: 'Expected to parse a value',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
    });
  });

  describe('decremental suffix', _ => {

    describe('sans newline', _ => {

      test('base',{
        code: 'a--',
        ast: { type: 'Program',
          body:
            [ { type: 'ExpressionStatement',
              expression:
                { type: 'UpdateExpression',
                  argument: { type: 'Identifier', name: 'a' },
                  operator: '--',
                  prefix: false } } ] },
        tokens: [$IDENT, $PUNCTUATOR, $ASI],
      });

      test('func',{
        code: 'function f(){ return a--; }',
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
                    [ { type: 'ReturnStatement',
                      argument:
                        { type: 'UpdateExpression',
                          argument: { type: 'Identifier', name: 'a' },
                          operator: '--',
                          prefix: false } } ] } } ] },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('arrow',{
        code: 'let x = () => a--;',
        ast: { type: 'Program',
          body:
            [ { type: 'VariableDeclaration',
              kind: 'let',
              declarations:
                [ { type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: 'x' },
                  init:
                    { type: 'ArrowFunctionExpression',
                      params: [],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body:
                        { type: 'UpdateExpression',
                          argument: { type: 'Identifier', name: 'a' },
                          operator: '--',
                          prefix: false } } } ] } ] },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('statement header',{
        code: 'if (a--);',
        ast: { type: 'Program',
          body:
            [ { type: 'IfStatement',
              test:
                { type: 'UpdateExpression',
                  argument: { type: 'Identifier', name: 'a' },
                  operator: '--',
                  prefix: false },
              consequent: { type: 'EmptyStatement' },
              alternate: null } ] },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('sub-statement',{
        code: 'if (a) a--;',
        ast: { type: 'Program',
          body:
            [ { type: 'IfStatement',
              test: { type: 'Identifier', name: 'a' },
              consequent:
                { type: 'ExpressionStatement',
                  expression:
                    { type: 'UpdateExpression',
                      argument: { type: 'Identifier', name: 'a' },
                      operator: '--',
                      prefix: false } },
              alternate: null } ] },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('with newline', _ => {
      // TODO: could work throw a more relevant error message when detecting this error pattern

      test('base',{
        code: 'a\n--',
        throws: 'Expected to parse a value',
        tokens: [$PUNCTUATOR, $IDENT, $ASI],
      });

      test('func',{
        code: 'function f(){ return a\n--; }',
        throws: 'Expected to parse a value',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('arrow',{
        code: 'let x = () => a\n--;',
        throws: 'Expected to parse a value',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('statement header',{
        code: 'if (a\n--);',
        throws: 'Found newline before ++/--',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('sub-statement',{
        code: 'if (a) a\n--;',
        throws: 'Expected to parse a value',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
    });
  });

  describe('ambiguity', _ => {

    describe('as statement', _ => {

      test('asi before', {
        code: 'a\n++b',
        ast: {
          type: 'Program',
          body:
            [{
              type: 'ExpressionStatement',
              expression: {type: 'Identifier', name: 'a'}
            },
              {
                type: 'ExpressionStatement',
                expression:
                  {
                    type: 'UpdateExpression',
                    operator: '++',
                    prefix: true,
                    argument: {type: 'Identifier', name: 'b'}
                  }
              }]
        },
        desc: 'postfix is restricted so ASI should happen', // https://tc39.github.io/ecma262/#sec-rules-of-automatic-semicolon-insertion (see notes)
        tokens: [$IDENT, $ASI, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('asi after', {
        code: 'a++\nb',
        ast: {
          type: 'Program',
          body:
            [{
              type: 'ExpressionStatement',
              expression:
                {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'a'},
                  operator: '++',
                  prefix: false
                }
            },
              {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'b'}
              }]
        },
        tokens: [$IDENT, $PUNCTUATOR, $ASI, $IDENT, $ASI],
      });

      test('asi both', {
        code: 'a\n++\nb',
        ast: {
          type: 'Program',
          body:
            [{
              type: 'ExpressionStatement',
              expression: {type: 'Identifier', name: 'a'}
            },
              {
                type: 'ExpressionStatement',
                expression:
                  {
                    type: 'UpdateExpression',
                    operator: '++',
                    prefix: true,
                    argument: {type: 'Identifier', name: 'b'}
                  }
              }]
        },
        desc: 'postfix is restricted so ASI should happen',
        tokens: [$IDENT, $ASI, $PUNCTUATOR, $IDENT, $ASI],
      });
    });

    describe('in statement header', _ => {

      test('asi before', {
        code: 'if (a\n++b);',
        throws: 'Found newline before ++/--',
        desc: 'postfix is restricted so ASI should happen', // https://tc39.github.io/ecma262/#sec-rules-of-automatic-semicolon-insertion (see notes)
        tokens: [$IDENT, $ASI, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('asi after', {
        code: 'if (a++\nb);',
        throws: 'Next ord should be',
        tokens: [$IDENT, $PUNCTUATOR, $ASI, $IDENT, $ASI],
      });

      test('asi both', {
        code: 'if (a\n++\nb);',
        throws: 'Found newline before ++/--',
        desc: 'postfix is restricted so ASI should happen',
        tokens: [$IDENT, $ASI, $PUNCTUATOR, $IDENT, $ASI],
      });
    });


    describe('return', _ => {

      test('asi before', {
        code: 'function f(){ return a\n++b; }',
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
                    [ { type: 'ReturnStatement',
                      argument: { type: 'Identifier', name: 'a' } },
                      { type: 'ExpressionStatement',
                        expression:
                          { type: 'UpdateExpression',
                            operator: '++',
                            prefix: true,
                            argument: { type: 'Identifier', name: 'b' } } } ] } } ] },
        desc: 'postfix is restricted so ASI should happen', // https://tc39.github.io/ecma262/#sec-rules-of-automatic-semicolon-insertion (see notes)
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('asi after', {
        code: 'function f(){ return a++\nb; }',
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
                    [ { type: 'ReturnStatement',
                      argument:
                        { type: 'UpdateExpression',
                          argument: { type: 'Identifier', name: 'a' },
                          operator: '++',
                          prefix: false } },
                      { type: 'ExpressionStatement',
                        expression: { type: 'Identifier', name: 'b' } } ] } } ] },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $ASI, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('asi both', {
        code: 'function f(){ return a\n++\nb; }',
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
                    [ { type: 'ReturnStatement',
                      argument: { type: 'Identifier', name: 'a' } },
                      { type: 'ExpressionStatement',
                        expression:
                          { type: 'UpdateExpression',
                            operator: '++',
                            prefix: true,
                            argument: { type: 'Identifier', name: 'b' } } } ] } } ] },
        desc: 'postfix is restricted so ASI should happen',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
    });
  });

  describe('boolean invert', _ => {

    test('statement',{
      code: '!a',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'UnaryExpression',
          operator: '!',
          prefix: true,
          argument: {type: 'Identifier', name: 'a'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $ASI],
    });
  });
});

// TODO: disambiguation tests of all the unaries (some have their own test file)
// typeof x++  (the typeof wraps the update)
// tests for asi and ++/-- for anything where LF_CAN_POSTFIX_ASI appears and async arrow functions because they're weird
// check whether postfix asi (++/--) can be blocked by something else than objlit/arrlit/arrow/group
