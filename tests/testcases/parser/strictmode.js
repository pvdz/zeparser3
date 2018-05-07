let {
  $ASI,
  $IDENT,
  $NUMBER_DEC,
  $PUNCTUATOR,
  $TICK_HEAD,
  $TICK_PURE,
  $TICK_TAIL,
} = require('../../../src/zetokenizer');

module.exports = (describe, test) => describe('strict mode', _ => {

  /*
    https://tc39.github.io/ecma262/#sec-strict-mode-code

    Global code is strict mode code if it starts with use strict
    Module code is always strict mode code.
    All parts of a ClassDeclaration or a ClassExpression are strict mode code.
    Eval code is strict mode code if
      - it begins with use strict
      - the call to eval is a direct eval that is contained in strict mode code.
    Function code is strict mode code if
      - it's contained in strict mode code
      - it starts with use strict
    Dynamic functions (like Function) with a body that starts with use strict
  */

  // base case: with is not allowed in strict mode

  test('base test; confirm `with` is fine without strict mode', {
    code: '; with (x) y;',
    desc: 'The idea is that strict mode should throw for using `with` but fine in sloppy mode',
    ast: true,
    tokens: true,
    STRICT: {throws: 'strict'},
  });

  test('global directive / module code', {
    code: '"use strict"; with (x) y;',
    throws: 'strict',
  });

  test('inside a class', {
    code: 'class X { foo() { with (x) y; } }',
    throws: 'strict',
  });

  describe('with directive', _ => {

    describe('in global', _ => {

      test('double quoted', {
        code: '"use strict"; with (x) y;',
        throws: 'strict',
      });

      test('single quoted', {
        code: '\'use strict\'; with (x) y;',
        throws: 'strict',
      });

      test('templates dont count', {
        code: '`use strict`; with (x) y;',
        ast: { type: 'Program',
          body:
            [ { type: 'ExpressionStatement',
              expression:
                { type: 'TemplateLiteral',
                  expressions: [],
                  quasis:
                    [ { type: 'TemplateElement',
                      tail: true,
                      value: { raw: '`use strict`', cooked: '<TODO>' } } ] } },
              { type: 'WithStatement',
                object: { type: 'Identifier', name: 'x' },
                body:
                  { type: 'ExpressionStatement',
                    expression: { type: 'Identifier', name: 'y' } } } ] },
        tokens: [$TICK_PURE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        STRICT: {throws: 'strict'},
      });

      test('newline after semi', {
        code: '"use strict";\nwith (x) y;',
        throws: 'strict',
      });

      test('newline before semi', {
        code: '"use strict"\n;with (x) y;',
        throws: 'strict',
      });

      test('asi', {
        code: '"use strict"\nwith (x) y;',
        throws: 'strict',
      });

      test('double', {
        code: '"use strict"; "use strict"; with (x) y;',
        throws: 'strict',
      });

      test('mixed double', {
        code: '"use strict"; \'use strict\'; with (x) y;',
        throws: 'strict',
      });

      test('crap first', {
        code: '"not a directive"; "use strict"; with (x) y;',
        throws: 'strict',
      });

      test('newlined first', {
        code: '"haha\\\nstill\\\nfine"; "use strict"; with (x) y;',
        throws: 'strict',
      });

      test('not first', {
        code: 'const x; "use strict"; with (x) y;',
        ast: true,
        tokens: true,
        STRICT: {throws: 'strict'},
      });

      test('comments are fine', {
        code: '// one comment\n/* two \n comment */ "use strict"; with (x) y;',
        throws: 'strict',
      });
    });

    describe('in function', _ => {

      test('double quoted', {
        code: 'function f(){ "use strict"; with (x) y; }',
        throws: 'strict',
      });

      test('single quoted', {
        code: 'function f(){ \'use strict\'; with (x) y; }',
        throws: 'strict',
      });

      test('templates dont count', {
        code: 'function f(){ `use strict`; with (x) y; }',
        ast: true,
        tokens: true,
        STRICT: {throws: 'strict'},
      });

      test('newline after semi', {
        code: 'function f(){ "use strict";\nwith (x) y; }',
        throws: 'strict',
      });

      test('newline before semi', {
        code: 'function f(){ "use strict"\n;with (x) y; }',
        throws: 'strict',
      });

      test('asi', {
        code: 'function f(){ "use strict"\nwith (x) y; }',
        throws: 'strict',
      });
    });

    describe('in arrow', _ => {

      test('double quoted', {
        code: '() => { "use strict"; with (x) y; }',
        throws: 'strict',
      });

      test('single quoted', {
        code: '() => { \'use strict\'; with (x) y; }',
        throws: 'strict',
      });

      test('templates dont count', {
        code: '() => { `use strict`; with (x) y; }',
        ast: true,
        tokens: true,
        STRICT: {throws: 'strict'},
      });

      test('newline after semi', {
        code: '() => { "use strict";\nwith (x) y; }',
        throws: 'strict',
      });

      test('newline before semi', {
        code: '() => { "use strict"\n;with (x) y; }',
        throws: 'strict',
      });

      test('asi', {
        code: '() => { "use strict"\nwith (x) y; }',
        throws: 'strict',
      });
    });

    describe('mixed cases', _ => {

      test('ignored when not first', {
        code: 'const x; "use strict"; with (x) y;',
        ast: true,
        tokens: true,
        STRICT: {throws: 'strict'},
      });

      test('other contexts inherit it', {
        code: '"use strict"; function f(){ with (x) y; }',
        throws: 'strict',
      });

      test('function does not taint global scope', {
        code: 'function f(){ "use strict"; foo; } with (x) y;',
        ast: true,
        tokens: true,
        STRICT: {throws: 'strict'},
      });

      test('sibling does not taint global scope', {
        code: 'function f(){ "use strict"; foo; } function g() { with (x) y; }',
        ast: true,
        tokens: true,
        STRICT: {throws: 'strict'},
      });

      test('parent taints child', {
        code: 'function f(){ "use strict"; foo; function g() { with (x) y; } } ',
        throws: 'strict',
      });

      test('sibling does not taint parent', {
        code: 'function g() { function f(){ "use strict"; foo; } with (x) y; }',
        ast: true,
        tokens: true,
        STRICT: {throws: 'strict'},
      });

      test('NOT block scoped', {
        code: 'if (x) { "use strict"; with (x) y; }',
        ast: true,
        tokens: true,
        STRICT: {throws: 'strict'},
      });
    });
  });
});
