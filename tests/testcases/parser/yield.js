let {
  $ASI,
  $IDENT,
  $NUMBER_DEC,
  $PUNCTUATOR,
  $TICK_HEAD,
  $TICK_TAIL,
} = require('../../../src/zetokenizer');

module.exports = (describe, test) => describe('yield', _ => {

  describe('in global', _ => {

    describe('as a statement', _ => {

      test('sans arg', {
        code: 'yield',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'YieldExpression',
              delegate: false,
              argument: null,
            }},
          ]},
        },
        tokens: [$IDENT, $ASI],
      });

      test('with arg', {
        code: 'yield x',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'YieldExpression',
              delegate: false,
              argument: {type: 'Identifier', name: 'x'},
            }},
          ]},
        },
        tokens: [$IDENT, $IDENT, $ASI],
      });

      test('complex arg', {
        code: 'yield x + y',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [{
            type: 'ExpressionStatement', expression: {type: 'YieldExpression',
              delegate: false,
              argument: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '+',
                right: {type: 'Identifier', name: 'y'},
              },
            }},
          ]},
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });
    });

    describe('in an expression', _ => {

      test('sans args', {
        code: '5 + yield',
        throws: '`yield` outside',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {
              type: 'BinaryExpression',
              left: {type: 'Literal', value: '<TODO>', raw: '5'},
              operator: '+',
              right: {type: 'Identifier', name: 'yield'},
            }},
          ]},
        },
        tokens: [$NUMBER_DEC, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('with args', {
        code: '5 + yield x',
        throws: '`yield` outside',
        SLOPPY_SCRIPT: {
          throws: 'Unable to ASI',
        },
        tokens: [$NUMBER_DEC, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });

      test('with complex args', {
        code: '5 + yield x + y',
        throws: '`yield` outside',
        SLOPPY_SCRIPT: {
          throws: 'Unable to ASI',
        },
        tokens: [$NUMBER_DEC, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });
    });

    describe('inside a call', _ => {

      test('sans args', {
        code: 'call(yield)',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'CallExpression',
              callee: {type: 'Identifier', name: 'call'},
              arguments: [{type: 'YieldExpression',
                delegate: false,
                argument: null,
              }],
            }},
          ]},
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('with args', {
        code: 'call(yield x)',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'CallExpression',
              callee: {type: 'Identifier', name: 'call'},
              arguments: [{type: 'YieldExpression',
                delegate: false,
                argument: {type: 'Identifier', name: 'x'},
              }],
            }},
          ]},
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('complex args', {
        code: 'call(yield x + y)',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'CallExpression',
              callee: {type: 'Identifier', name: 'call'},
              arguments: [{type: 'YieldExpression',
                delegate: false,
                argument: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'x'},
                  operator: '+',
                  right: {type: 'Identifier', name: 'y'},
                },
              }],
            }},
          ]},
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });
    });
  });

  describe('inside a generator', _ => {

    describe('as a statement', _ => {

      test('sans arg', {
        code: 'function* f(){ yield; }',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: true,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: [{
            type: 'ExpressionStatement', expression: {type: 'YieldExpression',
              delegate: false,
              argument: null,
            },
          }]},
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('with arg', {
        code: 'function* f(){ yield x; }',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: true,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: [{
            type: 'ExpressionStatement',
            expression: {
              type: 'YieldExpression',
              delegate: false,
              argument: {type: 'Identifier', name: 'x'},
            },
          }]},
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('complex arg', {
        code: 'function* f(){ yield x + y; }',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: true,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: [{
            type: 'ExpressionStatement', expression: {
              type: 'YieldExpression',
              delegate: false,
              argument: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '+',
                right: {type: 'Identifier', name: 'y'},
              },
            },
          }]},
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('in an expression', _ => {

      test('sans args', {
        code: 'function* f(){ 5 + yield }',
        throws: '`yield` after non-operator',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [{
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'f'},
            params: [],
            body: {type: 'BlockStatement', body: [{
              type: 'ExpressionStatement', expression: {
                type: 'BinaryExpression',
                left: {type: 'Literal', value: '<TODO>', raw: '5'},
                operator: '+',
                right: {type: 'Identifier', name: 'yield'},
              },
            }]},
          }]},
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });

      test('with args', {
        code: 'function* f(){ 5 + yield x; }',
        throws: '`yield` after',
        SLOPPY_SCRIPT: {
          throws: 'Unable to ASI',
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $IDENT, $ASI, $PUNCTUATOR],
      });

      test('with complex args', {
        code: 'function* f(){ 5 + yield x + y; }',
        throws: '`yield` after',
        SLOPPY_SCRIPT: {
          throws: 'Unable to ASI',
        },
        tokens: [$NUMBER_DEC, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });
    });

    describe('inside a call', _ => {

      test('sans args', {
        code: 'function* f(){ call(yield); }',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: true,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: [{
            type: 'ExpressionStatement', expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'call'},
              arguments: [{type: 'YieldExpression',
                delegate: false,
                argument: null,
              }],
            },
          }]},
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('with args', {
        code: 'function* f(){ call(yield x); }',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: true,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: [{
            type: 'ExpressionStatement', expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'call'},
              arguments: [{type: 'YieldExpression',
                delegate: false,
                argument: {type: 'Identifier', name: 'x'},
              }],
            }
          }]},
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('complex args', {
        code: 'function* f(){ call(yield x + y); }',
        ast: {type: 'Program', body: [{
          type: 'FunctionDeclaration',
          generator: true,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: [{
            type: 'ExpressionStatement', expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'call'},
              arguments: [{
                type: 'YieldExpression',
                delegate: false,
                argument: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'x'},
                  operator: '+',
                  right: {type: 'Identifier', name: 'y'},
                },
              }],
            },
          }]},
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });
  });

  describe('inside a non-generator function', _ => {

    describe('as a statement', _ => {

      test('sans arg', {
        code: 'function f(){ yield; }',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [{
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'f'},
            params: [],
            body: {type: 'BlockStatement', body: [{
              type: 'ExpressionStatement', expression: {type: 'YieldExpression',
                delegate: false,
                argument: null,
              },
            }]},
          }]},
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('with arg', {
        code: 'function f(){ yield x; }',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [{
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'f'},
            params: [],
            body: {type: 'BlockStatement', body: [{
              type: 'ExpressionStatement', expression: {
                type: 'YieldExpression',
                delegate: false,
                argument: {type: 'Identifier', name: 'x'},
              },
            }]},
          }]},
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('complex arg', {
        code: 'function f(){ yield x + y; }',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [{
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'f'},
            params: [],
            body: {type: 'BlockStatement', body: [{
              type: 'ExpressionStatement', expression: {
                type: 'YieldExpression',
                delegate: false,
                argument: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'x'},
                  operator: '+',
                  right: {type: 'Identifier', name: 'y'},
                },
              },
            }]},
          }]},
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('in an expression', _ => {

      test('sans args', {
        code: 'function f(){ 5 + yield }',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [{
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'f'},
            params: [],
            body: {type: 'BlockStatement', body: [{
              type: 'ExpressionStatement', expression: {
                type: 'BinaryExpression',
                left: {type: 'Literal', value: '<TODO>', raw: '5'},
                operator: '+',
                right: {type: 'Identifier', name: 'yield'},
              },
            }]},
          }]},
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });

      test('with args', {
        code: 'function f(){ 5 + yield x; }',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          throws: 'Unable to ASI',
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $IDENT, $ASI, $PUNCTUATOR],
      });

      test('with complex args', {
        code: 'function f(){ 5 + yield x + y; }',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          throws: 'Unable to ASI',
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });
    });

    describe('inside a call', _ => {

      test('sans args', {
        code: 'function f(){ call(yield); }',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [{
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'f'},
            params: [],
            body: {type: 'BlockStatement', body: [{
              type: 'ExpressionStatement', expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'call'},
                arguments: [{type: 'YieldExpression',
                  delegate: false,
                  argument: null,
                }],
              },
            }]},
          }]},
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('with args', {
        code: 'function f(){ call(yield x); }',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [{
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'f'},
            params: [],
            body: {type: 'BlockStatement', body: [{
              type: 'ExpressionStatement', expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'call'},
                arguments: [{type: 'YieldExpression',
                  delegate: false,
                  argument: {type: 'Identifier', name: 'x'},
                }],
              },
            }]},
          }]},
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('complex args', {
        code: 'function f(){ call(yield x + y); }',
        throws: '`yield` outside of generator',
        SLOPPY_SCRIPT: {
          ast: {type: 'Program', body: [{
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'f'},
            params: [],
            body: {type: 'BlockStatement', body: [{
              type: 'ExpressionStatement', expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'call'},
                arguments: [{
                  type: 'YieldExpression',
                  delegate: false,
                  argument: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'x'},
                    operator: '+',
                    right: {type: 'Identifier', name: 'y'},
                  },
                }],
              },
            }]},
          }]},
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });
  });
  
  test('yield in assignment rhs is fine', {
    code: `function* g() { let x = yield 3; }`,
    ast: {type: 'Program', body: [{
      type: 'FunctionDeclaration',
      generator: true,
      async: false,
      expression: false,
      id: {type: 'Identifier', name: 'g'},
      params: [],
      body: {type: 'BlockStatement', body: [{
        type: 'VariableDeclaration',
        kind: 'let',
        declarations: [{
          type: 'VariableDeclarator',
          id: { type: 'Identifier', name: 'x' },
          init: {
            type: 'YieldExpression',
            delegate: false,
            argument: { type: 'Literal', value: '<TODO>', raw: '3' },
          },
        }],
      }]},
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    desc: 'AssignmentExpression can go into YieldExpression',
  });

  test('yielding an assignment is fine', {
    code: `function* g(x) { yield x = 3; }`,
    ast: { type: 'Program', body: [{
      type: 'FunctionDeclaration',
      generator: true,
      async: false,
      expression: false,
      id: { type: 'Identifier', name: 'g' },
      params: [{type: 'Identifier', name: 'x'}],
      body: {type: 'BlockStatement', body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'YieldExpression',
          delegate: false,
          argument: {
            type: 'AssignmentExpression',
            left: { type: 'Identifier', name: 'x' },
            operator: '=',
            right: { type: 'Literal', value: '<TODO>', raw: '3' },
          },
        },
      }]},
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    desc: 'AssignmentExpression can go into YieldExpression',
  });

  test('yielding an assignment with yield in rhs is fine', {
    code: `function* g(x) { yield x = yield 3; }`,
    ast: { type: 'Program', body: [{
      type: 'FunctionDeclaration',
      generator: true,
      async: false,
      expression: false,
      id: { type: 'Identifier', name: 'g' },
      params: [{type: 'Identifier', name: 'x'}],
      body: {type: 'BlockStatement', body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'YieldExpression',
          delegate: false,
          argument: {
            type: 'AssignmentExpression',
            left: { type: 'Identifier', name: 'x' },
            operator: '=',
            right: {
              type: 'YieldExpression',
              delegate: false,
              argument: { type: 'Literal', value: '<TODO>', raw: '3' },
            },
          },
        },
      }]},
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    desc: 'AssignmentExpression can go into YieldExpression',
  });

  test('yield after a non-assignment op cannot be parsed as an operator, only as var name so this throws in strict', {
    code: `function* g() { yield 3 + yield; }`,
    throws: '`yield` after',
    SLOPPY_SCRIPT: {
      ast: {type: 'Program', body: [{
        type: 'FunctionDeclaration',
        generator: true,
        async: false,
        expression: false,
        id: {type: 'Identifier', name: 'g'},
        params: [],
        body: { type: 'BlockStatement', body: [{
          type: 'ExpressionStatement',
          expression: {
            type: 'YieldExpression',
            delegate: false,
            argument: {
              type: 'BinaryExpression',
              left: { type: 'Literal', value: '<TODO>', raw: '3'},
              operator: '+',
              right: { type: 'Identifier', name: 'yield'},
            },
          },
        }]},
      }]},
    },
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    desc: 'AssignmentExpression can go into YieldExpression but not after a ConditionalExpression (which plus ends up belonging to)',
  });

  test('yield after a non-assignment op cannot be parsed as an operator, only as var name so this cant work at all', {
    code: `function* g() { yield 3 + yield 4; }`,
    throws: '`yield` after',
    SLOPPY_SCRIPT: {
      throws: 'ASI',
    },
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    desc: 'AssignmentExpression can go into YieldExpression but not after a ConditionalExpression (which plus ends up belonging to)',
  });

  test('yield in sloppy mode should still throw without generator', {
    code: 'async function f(){ yield a,b; }',
    throws: '`yield` outside of generator',
    SLOPPY_SCRIPT: {
      ast: {type: 'Program', body: [{
        type: 'FunctionDeclaration',
        generator: false,
        async: true,
        expression: false,
        id: {type: 'Identifier', name: 'f'},
        params: [],
        body: {
          type: 'BlockStatement',
          body: [{type: 'ExpressionStatement', expression: {
            type: 'YieldExpression',
            delegate: false,
            argument: {
              type: 'SequenceExpression',
              expressions: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
            },
          },
        }]},
      }]},
    },
    desc: '(all tests are ran 4x per input, in mixes of strict/sloppy and module/script mode)',
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  });
});
