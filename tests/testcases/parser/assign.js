let {$ASI, $IDENT, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('assigns', _ => {
    test('bin *=', {
      code: 'a *= b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '*=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin /=', {
      code: 'a /= b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '/=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin %=', {
      code: 'a %= b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '%=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin +=', {
      code: 'a += b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '+=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin -=', {
      code: 'a -= b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '-=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin <<=', {
      code: 'a <<= b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '<<=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin >>=', {
      code: 'a >>= b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '>>=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin >>>=', {
      code: 'a >>>= b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '>>>=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin &=', {
      code: 'a &= b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '&=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin |=', {
      code: 'a |= b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '|=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin ^=', {
      code: 'a ^= b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '^=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin |=', {
      code: 'a |= b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '|=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin **=', {
      code: 'a **= b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '**=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('triple eq chain', {
      code: 'a = b = c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '=',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('quad eq chain', {
      code: 'a = b = c = d',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '=',
                right: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'c'},
                  operator: '=',
                  right: {type: 'Identifier', name: 'd'},
                },
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('assign plus assign', {
      code: 'a = b + c = d',
      throws: 'Cannot assign a value',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('assign to single wrapped group', {
      code: '(a) = b;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('assign to double wrapped group', {
      code: '((a)) = b;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '=',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('double wrapped group in the middle', {
      code: 'x = ((y)) = z',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'x'},
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'y'},
                operator: '=',
                right: {type: 'Identifier', name: 'z'},
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('assign with dud group', {
      code: 'a = ((b)) = c;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '=',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    describe('assigning to keyword', _ => {

      [
        'break',
        'case',
        'catch',
        'class',
        'const',
        'continue',
        'debugger',
        'default',
        'delete',
        'do',
        'else',
        'export',
        'extends',
        'finally',
        'for',
        'function',
        'if',
        'import',
        'in',
        'instanceof',
        'new',
        'return',
        'super',
        'switch',
        'this',
        'throw',
        'try',
        'typeof',
        'var',
        'void',
        'while',
        'with',
        'null',
        'true',
        'false',
        'enum',
      ].forEach(keyword => {
        test.fail('assigning to [' + keyword + ']', {
          code: '(' + keyword + ' = "sentinal 453543")',
        });

        test.fail('should listen to use strict directive in global[' + keyword + ']', {
          code: '"use strict"; (' + keyword + ' = "sentinal 48945666");',
        });

        test.fail('should listen to use strict directive in function [' + keyword + ']', {
          code: 'function f() { "use strict"; (' + keyword + ' = "sentinal 79845134"); }',
        });

        test.fail('should listen to use strict directive in getter [' + keyword + ']', {
          code: 'foo = { get x(){  "use strict"; (' + keyword + ' = "sentinal 79845134");   }}',
        });
      });

      // strict mode only
      [
        'let',
        'implements',
        'package',
        'protected',
        'interface',
        'private',
        'public',
        'yield',
        // special non-keywords
        'static',
        'eval',
        'arguments',
      ].forEach(keyword => {
        test.fail_strict('assigning to [' + keyword + ']', {
          code: '(' + keyword + ' = "sentinal 543665")',
        });

        test.fail('should listen to use strict directive in global[' + keyword + ']', {
          code: '"use strict"; (' + keyword + ' = "sentinal 535426");',
        });

        test.fail('should listen to use strict directive in function [' + keyword + ']', {
          code: 'function f() { "use strict"; (' + keyword + ' = "sentinal 7533336"); }',
        });

        test.fail('should listen to use strict in getters [' + keyword + ']', {
          code : 'x = { get x() { "use strict"; ' + keyword + ' = 787984536; } }',
        });
      });

      describe('`await` is only but always an illegal var name with the _module_ goal', _ => {

        test.pass('no directive', {
          code: '(await = "sentinal 543665")',
          MODULE: {throws: true},
        });

        test.pass('global strict mode', {
          code: '"use strict"; (await = "sentinal 535426");',
          MODULE: {throws: true},
        });

        test.pass('local strict mode', {
          code: 'function f() { "use strict"; (await = "sentinal 7533336"); }',
          MODULE: {throws: true},
        });
      });

      // should be fine for non-keywords
      [
        'foo',
      ].forEach(keyword => {
        test.pass('assignment to [' + keyword + ']', {
          code: '(' + keyword + ' = "sentinal 453188")',
        });
      });
    });

    describe('keyword with escapes check', _ => {

      [
        'break',
        'case',
        'catch',
        'class',
        'const',
        'continue',
        'debugger',
        'default',
        'delete',
        'do',
        'else',
        'export',
        'extends',
        'finally',
        'for',
        'function',
        'if',
        'import',
        'in',
        'instanceof',
        'new',
        'return',
        'super',
        'switch',
        'this',
        'throw',
        'try',
        'typeof',
        'var',
        'void',
        'while',
        'with',
        'null',
        'true',
        'false',
        'enum',
      ].forEach(keyword => {

        // this should turn `switch` into `\u0073witch`
        let prefixed = '\\u' + keyword.charCodeAt(0).toString(16).padStart(4, '0')+keyword.slice(1);
        if (keyword === 'switch' && prefixed !== '\\u0073witch') throw new Error('Test is broken, fixmeee');

        test('leading escape [' + keyword + ' => ' + prefixed + ']', {
          code: '(' + prefixed + ' = "sentinal 1564646")',
          throws: 'escape',
        });

        // this should turn `switch` into `s\u0077itch`
        let middled = keyword.slice(0, 1) + '\\u' + keyword.charCodeAt(1).toString(16).padStart(4, '0')+keyword.slice(2);
        if (keyword === 'switch' && middled !== 's\\u0077itch') throw new Error('Test is broken, fixmeee');

        test('second char escaped [' + keyword + ' => ' + middled + ']', {
          code: '(' + middled + ' = "sentinal 1564646")',
          throws: 'escape',
        });
      });

      // strict mode only
      [
        'let',
        'implements',
        'package',
        'protected',
        'interface',
        'private',
        'public',
        // special non-keywords
        'static',
      ].forEach(keyword => {

        // this should turn `switch` into `\u0073witch`
        let prefixed = '\\u' + keyword.charCodeAt(0).toString(16).padStart(4, '0')+keyword.slice(1);

        test('leading escape [' + keyword + ' => ' + prefixed + ']', {
          code: '(' + prefixed + ' = "sentinal 3435")',
          STRICT: {throws: keyword === 'let' ? 'variable name' : 'escape'},
          ast: true,
          tokens: true,
        });

        // this should turn `switch` into `s\u0077itch`
        let middled = keyword.slice(0, 1) + '\\u' + keyword.charCodeAt(1).toString(16).padStart(4, '0')+keyword.slice(2);

        test('second char escaped [' + keyword + ' => ' + middled + ']', {
          code: '(' + middled + ' = "sentinal 6543322")',
          STRICT: {throws: keyword === 'let' ? 'variable name' : 'escape'},
          ast: true,
          tokens: true,
        });
      });

      [
        // special context
        'await',
      ].forEach(keyword => {

        // this should turn `switch` into `\u0073witch`
        let prefixed = '\\u' + keyword.charCodeAt(0).toString(16).padStart(4, '0')+keyword.slice(1);

        test.fail('leading escape [' + keyword + ' => ' + prefixed + ']', {
          code: 'async function f(){   (' + prefixed + ' "sentinal 45334")   }',
        });

        test.fail_strict('leading escape [' + keyword + ' => ' + prefixed + ']', {
          code: '(' + prefixed + ', "sentinal 15145")',
        });

        // this should turn `switch` into `s\u0077itch`
        let middled = keyword.slice(0, 1) + '\\u' + keyword.charCodeAt(1).toString(16).padStart(4, '0')+keyword.slice(2);

        test.fail('second char escaped [' + keyword + ' => ' + middled + ']', {
          code: 'async function f(){   (' + middled + ' "sentinal 45334")   }',
        });

        test.fail_strict('second char escaped [' + keyword + ' => ' + middled + ']', {
          code: '(' + middled + ', "sentinal 431431")',
        });
      });

      [
        // special context
        'yield',
      ].forEach(keyword => {

        // this should turn `switch` into `\u0073witch`
        let prefixed = '\\u' + keyword.charCodeAt(0).toString(16).padStart(4, '0')+keyword.slice(1);

        test.fail('cannot be yield expression [' + keyword + ' => ' + prefixed + ']', {
          code: 'function *f(){   (' + prefixed + ' "sentinal 89456")   }',
        });

        test.fail_strict('leading escape [' + keyword + ' => ' + prefixed + ']', {
          code: '(' + prefixed + ', "sentinal 89456")',
        });

        // this should turn `switch` into `s\u0077itch`
        let middled = keyword.slice(0, 1) + '\\u' + keyword.charCodeAt(1).toString(16).padStart(4, '0')+keyword.slice(2);

        test.fail('cannot be yield expression [' + keyword + ' => ' + middled + ']', {
          code: 'function *f(){   (' + middled + ' "sentinal 78432")   }',
        });

        test.fail_strict('second char escaped [' + keyword + ' => ' + middled + ']', {
          code: '(' + middled + ', "sentinal 78432")',
        });
      });

      // should be fine for non-keywords
      [
        'foo',
        'eval',
        'arguments',
      ].forEach(keyword => {

        // this should turn `switch` into `\u0073witch`
        let prefixed = '\\u' + keyword.charCodeAt(0).toString(16).padStart(4, '0')+keyword.slice(1);

        test.pass('leading escape [' + keyword + ' => ' + prefixed + ']', {
          code: '(' + prefixed + ' = "sentinal 432432")',
          STRICT: keyword === 'eval' || keyword === 'arguments' ? {throws: keyword} : undefined,
        });

        // this should turn `switch` into `s\u0077itch`
        let middled = keyword.slice(0, 1) + '\\u' + keyword.charCodeAt(1).toString(16).padStart(4, '0')+keyword.slice(2);

        test.pass('second char escaped [' + keyword + ' => ' + middled + ']', {
          code: '(' + middled + ' = "sentinal 62435")',
          STRICT: keyword === 'eval' || keyword === 'arguments' ? {throws: keyword} : undefined,
        });
      });
    });
  });
