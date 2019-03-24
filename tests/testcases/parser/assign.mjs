import {$ASI, $IDENT, $PUNCTUATOR} from '../../../src/zetokenizer';

export default (describe, test) =>
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

    test.fail('regression with invalid lhs of compound assignment', {
      // https://github.com/pvdz/zeparser3/issues/3
      code: '({x:y} += x)',
    });

    test.fail('do not be fooled by compound assigning to a grouped object', {
      // https://github.com/pvdz/zeparser3/issues/3
      // Basically, this proofs merely asserting the previous token is insufficient
      code: '(({x:y}) += x)',
    });

    test.fail('regression with invalid lhs that looks like destructuring', {
      // https://github.com/pvdz/zeparser3/issues/3
      code: '({foo: {x:y} += x})',
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

        test.fail_strict('assign to paren-wrapped await var', {
          code: '(await) = 1',
        });

        test.fail('assign to paren-wrapped await var', {
          code: 'async x => (await) = 1',
        });

        test.fail_strict('assign to paren-wrapped await var in param default', {
          code: '(x = (await) = f) => {}',
        });

        test.fail('assign to paren-wrapped await keyword in param default', {
          code: 'async (x = (await) = f) => {}',
        });

        test.fail_strict('assign to paren-wrapped await var inside delete in param default', {
          code: '(x = delete ((await) = f)) => {}',
        });

        test.fail('assign to paren-wrapped await keyword inside delete in param default', {
          code: 'async (x = delete ((await) = f)) => {}',
        });
      });

      describe('yield is not keyword', _ => {

        test.fail_strict('assign to yield as a var name', {
          code: 'yield = 1;',
        });

        test.fail('assign to yield as a keyword', {
          code: 'function *f(){ yield = 1; }',
        });

        test.fail_strict('assign to paren-wrapped yield as a var name', {
          code: '(yield) = 1;',
        });

        test.fail('assign to yield as a keyword', {
          code: 'function *f(){ (yield) = 1; }',
        });

        test.fail_strict('assign to paren-wrapped yield var in param default', {
          code: '(x = (yield) = f) => {}',
        });

        test.fail('assign to paren-wrapped yield keyword in param default', {
          code: 'function *f(x = (yield) = f) {}',
        });

        test.fail_strict('assign to paren-wrapped yield var inside delete in param default', {
          code: '(x = delete ((yield) = f)) => {}',
        });

        test.fail('assign to paren-wrapped yield keyword inside delete in param default', {
          code: 'function *f(x = delete ((yield) = f)) {}',
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

    test.fail('assignment to array pattern with grouped assignment is illegal', {
      // https://github.com/pvdz/zeparser3/issues/3#issuecomment-471157627
      code: '[(a = 0)] = 1',
    });

    test.pass('assignment to paren wrapped ident in array is okay', {
      // https://github.com/pvdz/zeparser3/issues/3#issuecomment-471157627
      code: '[(a)] = x',
    });

    test.pass('assignment destructuring with noop-group with default being an assignable', {
      code: '({a:(b) = c})',
    });

    test.pass('assignment destructuring with noop-group with double default being an assignable', {
      code: '({a:(b) = c} = 1)',
    });

    test.pass('assignment destructuring with noop-group with double default being non-assignable', {
      code: '({a:(b) = 0} = 1)',
    });

    test.fail('assignment destructuring with real group', {
      code: '({a:(a,y) = 0} = 1)',
    });

    test.pass('destruct assignment to a noop-grouped ident', {
      code: '[(a), b] = [];',
    });

    test.pass('destruct assignment to noop-groups ident', {
      code: '[((((a)))), b] = [];',
    });

    test.fail('this is not destructuring', {
      code: '(...{a: b}.c = [])',
    });

    test.pass('destruct to arr wrapped property of obj lit that is a rest', {
      code: '[...{a: b}.c] = []',
    });

    test.pass('destruct assignment to prop of rest of obj-lit inside arr', {
      code: '[...[{a: b}.c]] = [];',
    });

    test.pass('prop on obj that is assign destructed', {
      code: '[...[{prop: 1}.prop]] = []',
    });

    test.pass('prop on nested obj that is assign destructed', {
      code: '({ a: {prop: 1}.prop } = {})',
    });

    test.fail('cannot destruct when the aliased key is invalid (group)', {
      code: '({a: 1} = []);',
    });

    test.fail('cannot destruct when the aliased key is invalid (arr)', {
      code: '[{a: 1} = []];',
    });

    test.fail('cannot destruct when the aliased key is invalid (obj)', {
      code: 'x, {a: {a: 1} = []};',
    });

    test.fail('cannot destruct when the aliased key is invalid (comma)', {
      code: 'x, {a: 1} = [];',
    });

    test.pass('destruct assignment to prop of obj pattern where alias is number is valid', {
      // Regression: the number was causing the whole obj pattern to be marked non-destructible
      code: '[{a: 1}.c] = [];',
    });

    test.pass('noop-group edge case for destruct assignment to prop of obj pattern where alias is number is valid', {
      code: '[({a: 1}.c)] = [];',
    });

    test.fail('cannot destruct arr pattern with a number', {
      code: '[[1]] = [];',
    });

    test.pass('destruct assignment to prop of arr pattern where alias is number is valid', {
      code: '[[1].c] = [];',
    });
    test.pass('noop-group edge case for destruct assignment to prop of arr pattern where alias is number is valid', {
      code: '[([1].c)] = [];',
    });

    test.pass('destruct assignment to prop of nested object', {
      code: '({ a: {prop: 1}.prop } = {})',
    });

    test.fail_strict('rest with await var', {
      code: '[...await] = obj',
    });

    test.fail_strict('rest with yield var', {
      code: '[...yield] = obj',
    });

    test.fail('rest with await keyword', {
      code: 'async x => [...await x] = obj',
    });

    test.fail('rest with argless yield keyword', {
      code: 'function *f(){ return [...yield] = obj; }',
    });

    test.fail('rest with arged yield keyword', {
      code: 'function *f(){ return [...yield x] = obj; }',
    });

    test.fail_strict('obj rest with await', {
      code: '({...await} = obj)',
    });

    test.fail_strict('obj rest with yield', {
      code: '({...yield} = obj)',
    });

    test.pass('destruct assign after comma', {
      code: 'x, [foo, bar] = doo;',
    });

    test('destruct assign with default after comma', {
      code: 'x, [foo = y, bar] = doo',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {type: 'Identifier', name: 'x'},
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {type: 'Identifier', name: 'foo'},
                        right: {type: 'Identifier', name: 'y'},
                      },
                      {type: 'Identifier', name: 'bar'},
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'doo'},
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test.fail('destruct assign with illegal content after comma', {
      code: 'x, [foo + y, bar] = doo;',
    });

    test('destructuring between equal signs', {
      code: 'x = [a, b] = y',
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
                left: {
                  type: 'ArrayPattern',
                  elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'y'},
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('destructuring assignment with two rhs assigns', {
      code: '[a, b] = c = d',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'c'},
                operator: '=',
                right: {type: 'Identifier', name: 'd'},
              },
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    // https://tc39.github.io/ecma262/#sec-destructuring-assignment-static-semantics-early-errors
    // It is a Syntax Error if LeftHandSideExpression is neither an ObjectLiteral nor an ArrayLiteral and AssignmentTargetType(LeftHandSideExpression) is not simple.
    [
      '({...obj1,} = foo)',
      '({...obj1,a} = foo)',
      '({...obj1,...obj2} = foo)',
      '({...(a,b)} = foo)',
      '({...{}} = {})',
    ].forEach((tcase,i) => {
      test.fail('bad destruct assign of obj case ' + i, {
        code: tcase,
      });
    });
    [
      '({...(obj)} = foo)', // rest arg must be "simple" assignment. parenthesized expr is simple if its arg is. so ok.
      '({...obj} = foo)',
    ].forEach((tcase,i) => {
      test.pass('good destruct assign of obj case ' + i, {
        code: tcase,
      });
    });

    describe('assignment to number', _ => {

      test.fail('base case should fail', {
        code: '1 = x',
      });

      test.fail('wrapped in noop-parens should fail', {
        code: '(1) = x',
      });

      test.fail('wrapped in noop-parens in the middle should fail', {
        code: 'y = (1) = x',
      });

      test.fail('wrapped in noop-parens in the middle with left wrapped too should fail', {
        code: '(y) = (1) = x',
      });

      test.fail('wrapped in noop-parens in the left should fail', {
        code: '(1) = y = x',
      });

      test.fail('wrapped in noop-parens in the left with middle wrapped too should fail', {
        code: '(1) = (y) = x',
      });

      test.fail('obj prop value; base case should fail', {
        code: '({a: 1 = x })',
      });

      test.fail('obj prop value; wrapped in noop-parens should fail', {
        code: '({a: (1) = x })',
      });
    });
  });