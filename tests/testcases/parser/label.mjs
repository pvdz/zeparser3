/** @format */
import {$IDENT, $PUNCTUATOR} from '../../../src/zetokenizer.mjs';
export default (describe, test) =>
  describe('debugger statement', _ => {
    test('debugger with semi', {
      code: 'foo: bar;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'foo',
            },
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'bar',
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });
    test('unicode escapes at the start of labels should not allow keywords', {
      code: 'async () => { \\u{61}wait: x }',
      throws: 'await',
    });
    test('unicode escapes in the middle of labels should not allow keywords', {
      code: 'async () => { aw\\u{61}it: x }',
      throws: 'await',
    });
    test('base case that passes without keyword', {
      code: 'foo: x;',
      ast: true,
      tokens: true,
    });
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
      test('can not use keywords as label name [' + keyword + ']', {
        code: keyword + ': x;',
        throws: true,
      });
    });
    [
      'implements',
      'package',
      'protected',
      'interface',
      'private',
      'public', // > In strict mode code, let and static are treated as reserved words through static semantic restrictions
      'let',
      'static',
    ].forEach(keyword => {
      test.fail_strict('can not use certain reserved keywords as label name in strict mode: keyword=`' + keyword + '`', {
        code: keyword + ': x;',
        throws: true,
      });
    });
    describe('await', _ => {
      test.pass('in sloppy', {
        code: 'await: x',
        MODULE: {
          throws: true,
        },
      });
      test.fail_strict('in a generator', {
        code: 'function *f(){ await: x; }',
      });
      test.fail('defined outside of generator as break label inside generator', {
        code: 'await: { function *f(){ break await; } }',
        desc: 'red herring; await is special for async, not generaotrs ;) but since the label does not exist it still fails',
      });
      test.fail('in async', {
        code: 'async function f(){ await: x; }',
      });
      test.fail('defined outside of async as break label inside async', {
        code: 'await: { async function f(){ break await; } }',
        desc: 'red herring; label sets do not cross function boundaries ;) so label is undefined and the break crashes',
      });
    });
    describe('await', _ => {
      test.fail_strict('in sloppy', {
        code: 'yield: x',
      });
      test.fail('in a generator', {
        code: 'function *f(){ yield: x; }',
      });
      test.fail('defined outside of generator as break label inside generator', {
        code: 'yield: { function *f(){ break await; } }',
        desc: 'red herring; await is special for async, not generaotrs ;) but since the label does not exist it still fails',
      });
    });
    describe('regex edge cases', _ => {
      // foo:/bar/
      // foo:\n/bar/
      // foo:\n/bar/g
    });
    test('cannot use the same label twice', {
      code: 'foo: foo: x',
      throws: 'same label',
    });
    test('a b a', {
      code: 'foo: bar: foo: x',
      throws: 'same label',
    });
    test('b a c a', {
      code: 'bar: foo: ding: foo: x',
      throws: 'same label',
    });
    test('a { a }', {
      code: 'a: { a: x }',
      throws: 'same label',
    });
    test.pass('eval is NOT a reserved word at all so ok to use as label', {
      code: 'eval: x;',
    });
    test.pass('arguments is NOT a reserved word at all so ok to use as label', {
      code: 'arguments: x;',
    }); // TODO: label:functiondecl is explicitly considered a syntax error
    // TODO: labels must be "identifiers", which may not be reserved
    // async, let, etc special keywords that once were valid labels (because sloppy mode)
  });
