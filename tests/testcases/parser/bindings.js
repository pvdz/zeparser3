let {$ASI, $IDENT, $PUNCTUATOR, $TICK_BODY, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('tests related to bindings', _ => {

    // in strict mode only;
    // dupe param decls, dupe local bindings, binding that also appears as param
    // arrow params somehow

    test('double let single decl', {
      code: 'let a, a',
      throws: 'bound',
    });

    test('double let double decl', {
      code: 'let a; let a;',
      throws: 'bound',
    });

    test('double const single decl', {
      code: 'const a = 1, a = 2',
      throws: 'bound',
    });

    test('double const double decl', {
      code: 'const a = 1; const a = 2',
      throws: 'bound',
    });

    test('mixed let const', {
      code: 'let a = 1; const a = 2',
      throws: 'bound',
    });

    test('mixed const let', {
      code: 'const a = 1; let a = 2',
      throws: 'bound',
    });

    describe('for', _ => {

      // https://tc39.github.io/ecma262/#sec-for-statement-static-semantics-early-errors
      // > It is a Syntax Error if any element of the BoundNames of LexicalDeclaration also occurs in the
      //   VarDeclaredNames of Statement.
      // (for statement header)

      test('for-loop, let name as var name in statement', {
        code: 'for (let x;;) { var x; }',
        throws: 'bound',
      });

      test('for-loop, const name as var name in statement', {
        code: 'for (const x = y;;) { var x; }',
        throws: 'bound',
      });

      test('for-in, let name as var name in statement', {
        code: 'for (let x in y) { var x; }',
        throws: 'bound',
      });

      test('for-in, const name as var name in statement', {
        code: 'for (const x in y) { var x; }',
        throws: 'bound',
      });

      test('for-of, let name as var name in statement', {
        code: 'for (let x of y) { var x; }',
        throws: 'bound',
      });

      test('for-of, const name as var name in statement', {
        code: 'for (const x of y) { var x; }',
        throws: 'bound',
      });

      test('let name with other names as var name in statement', {
        code: 'for (let a, b, x, d;;) { var foo; var bar; { var doo, x, ee; } }',
        throws: 'bound',
      });

      test.pass('same let binding in for header and body are fine', {
        code: 'for (let a;;) { let a; }',
      });

      test.pass('same const binding in for header and body are fine', {
        code: 'for (const a = x;;) { let a; }',
      });

      test.pass('for-header var, for-body let', {
        code: 'for (var a;;) { let a; }',
        desc: 'the body is its own scope and there is no rule that says for-header vars cant occur as body lexicals',
      });

      test('can not create lexical binding when var binding already exists in current lex', {
        code: 'for (var a;;) { var b; let b; }',
        throws: 'bound',
      });

      test('for-header binding should check destructuring properly', {
        code: 'for (const [x, x] in {}) {}',
        throws: 'bound',
      });
    });

    describe('catch', _ => {

      // https://tc39.github.io/ecma262/#sec-try-statement-static-semantics-early-errors
      // > It is a Syntax Error if any element of the BoundNames of CatchParameter also occurs in the LexicallyDeclaredNames of Block.
      // > It is a Syntax Error if any element of the BoundNames of CatchParameter also occurs in the VarDeclaredNames of Block.
      // (catch var, also has an annex B case)

      test('catch var in let', {
        code: 'try {} catch (e) { let e = x; }',
        throws: 'same binding',
      });

      test.pass('catch var in blocked let', {
        code: 'try {} catch (e) { { let e = x; } }',
        desc: 'different scope is fine',
      });

      test('catch var in const', {
        code: 'try {} catch (e) { const e = x; }',
        throws: 'same binding',
      });

      test('catch var in var', {
        code: 'try {} catch (e) { var e = x; }',
        throws: 'same binding',
      });

      test.pass('destructed catch var can add multiple bindings', {
        code: 'try {} catch ([a,b,c]) { }',
      });

      test('destructed catch var can not cause dupe bindings', {
        code: 'try {} catch ([a,a]) { }',
        throws: 'bound',
      });

      describe('for-in edge case', _ => {

        // https://tc39.github.io/ecma262/#sec-variablestatements-in-catch-blocks
        // > It is a Syntax Error if any element of the BoundNames of CatchParameter also occurs in the VarDeclaredNames of Block
        //   unless CatchParameter is CatchParameter:BindingIdentifier and that element is only bound by
        //   - a VariableStatement,
        //   - the VariableDeclarationList of a for statement,
        //   - the ForBinding of a for-in statement, or
        //   - the BindingIdentifier of a for-in statement.
        // (explicitly not for-of, which makes sense as its only for backwards compat and for-of is too new)

        describe('without webcompat', _ => {

          test.fail('catch var as var statement', {
            code: 'try {} catch (e) { var e = x; }',
          });

          test.fail('catch var as for-in binding', {
            code: 'try {} catch (e) { for (var e;;) {} }',
          });

          test.fail('catch var as for-in binding', {
            code: 'try {} catch (e) { for (var e in y) {} }',
          });

          test.fail('catch var as for-of binding', {
            code: 'try {} catch (e) { for (var e of y) {} }',
          });

          test.pass('catch var as for-loop let', {
            code: 'try {} catch (e) { for (let e;;) {} }',
            desc: 'the let is a local binding which doesnt live in the same scope as the catch var so its fine',
          });

          test.pass('catch var as for-loop const', {
            code: 'try {} catch (e) { for (const e = y;;) {} }',
            desc: 'lexical binding does not live in same scope as catch var',
          });

          test.pass('catch var as for-in let', {
            code: 'try {} catch (e) { for (let e in y) {} }',
            desc: 'lexical binding does not live in same scope as catch var',
          });

          test.pass('catch var as for-in const', {
            code: 'try {} catch (e) { for (const e in y) {} }',
            desc: 'lexical binding does not live in same scope as catch var',
          });

          test.pass('catch var as for-of let', {
            code: 'try {} catch (e) { for (let e of y) {} }',
            desc: 'lexical binding does not live in same scope as catch var',
          });

          test.pass('catch var as for-of const', {
            code: 'try {} catch (e) { for (const e of y) {} }',
            desc: 'lexical binding does not live in same scope as catch var',
          });

          test.fail('catch var as let decl', {
            code: 'try {} catch (e) { let e = x; }',
          });

          test.fail('catch var as const decl', {
            code: 'try {} catch (e) { const e = x; }',
          });
        });

        describe('with webcompat', _ => {

          test.pass('catch var as var statement', {
            code: 'try {} catch (e) { var e = x; }',
            WEB: true,
          });

          test.pass('catch var as for-in binding', {
            code: 'try {} catch (e) { for (var e;;) {} }',
            WEB: true,
          });

          test.pass('catch var as for-in binding', {
            code: 'try {} catch (e) { for (var e in y) {} }',
            WEB: true,
          });

          test.fail('catch var as for-of binding', {
            code: 'try {} catch (e) { for (var e of y) {} }',
            WEB: true,
          });

          test.pass('catch var as for-loop let', {
            code: 'try {} catch (e) { for (let e;;) {} }',
            WEB: true,
            desc: 'let is in different scope so not even a problem at all',
          });

          test.pass('catch var as for-loop const', {
            code: 'try {} catch (e) { for (const e = y;;) {} }',
            desc: 'lexical binding does not live in same scope as catch var',
            WEB: true,
          });

          test.pass('catch var as for-in let', {
            code: 'try {} catch (e) { for (let e in y) {} }',
            WEB: true,
            desc: 'lexical binding does not live in same scope as catch var',
          });

          test.pass('catch var as for-in const', {
            code: 'try {} catch (e) { for (const e in y) {} }',
            desc: 'lexical binding does not live in same scope as catch var',
            WEB: true,
          });

          test.pass('catch var as for-of let', {
            code: 'try {} catch (e) { for (let e of y) {} }',
            desc: 'lexical binding does not live in same scope as catch var',
            WEB: true,
          });

          test.pass('catch var as for-of const', {
            code: 'try {} catch (e) { for (const e of y) {} }',
            desc: 'lexical binding does not live in same scope as catch var',
            WEB: true,
          });

          test.fail('catch var as let decl', {
            code: 'try {} catch (e) { let e = x; }',
            WEB: true,
          });

          test.fail('catch var as const decl', {
            code: 'try {} catch (e) { const e = x; }',
            WEB: true,
          });
        });
      });

      test.pass('catch shadowing catch', {
        code: 'try {} catch(e) { try {} catch (e) {} }',
      });
    });

    describe('functions', _ => {

      describe('dupe args with local bindings', _ => {

        // https://tc39.github.io/ecma262/#sec-function-definitions-static-semantics-early-errors
        // > It is a Syntax Error if any element of the BoundNames of FormalParameters also occurs in the LexicallyDeclaredNames of FunctionBody.
        //   > The LexicallyDeclaredNames of a FunctionBody does not include identifiers bound using var or function declarations.

        test('simple arg as a let', {
          code: 'function f(x) { let x }',
          throws: 'bound',
        });

        test('simple arg as a const', {
          code: 'function f(x) { const x = y }',
          throws: 'bound',
        });

        test.pass('simple arg as a blocked let', {
          code: 'function f(x) { { let x } }',
        });

        test.pass('simple arg as a blocked const', {
          code: 'function f(x) { { const x = y } }',
        });

        test.pass('simple arg as own func name', {
          code: 'function f(f) { }',
        });

        test.pass('complex arg as own func name', {
          code: 'function f([f]) { }',
        });

        test.pass('simple arg as a func name', {
          code: 'function f(x) { function x() {} }',
          desc: 'remember: The LexicallyDeclaredNames of a FunctionBody does not include identifiers bound using var or function declarations',
        });

        test.pass('simple arg as var name', {
          code: 'function f(x) { var x; }',
        });
      });

      describe('dupe args definitions', _ => {

        // https://tc39.github.io/ecma262/#sec-function-definitions-static-semantics-early-errors
        // > It is a Syntax Error if (IsSimpleParameterList of FormalParameterList is false or strict mode is true)
        //   and BoundNames of FormalParameterList contains any duplicate elements.

        describe('simple args', _ => {

          // dupe bindings are okay in simple args in sloppy script

          describe('without explicit directive', _ => {

            test.fail_strict('a a', {
              code: 'function f(a, a) {}',
            });

            test.fail_strict('a b a', {
              code: 'function f(a, b, a) {}',
            });

            test.fail_strict('b a a', {
              code: 'function f(b, a, a) {}',
            });

            test.fail_strict('a a b', {
              code: 'function f(a, a, b) {}',
            });

            test.fail_strict('b a b a', {
              code: 'function f(b, a, b, a) {}',
            });

            test('invalidated by destructuring', {
              code: 'function f(b, a, b, a, [fine]) {}',
              throws: 'bound',
            });

            test('invalidated by default', {
              code: 'function f(b, a, b, a = x) {}',
              throws: 'bound',
            });

            test('invalidated by rest', {
              code: 'function f(b, a, b, ...a) {}',
              throws: 'bound',
            });
          });

          describe('with explicit directive', _ => {

            test('a a', {
              code: 'function f(a, a) {"use strict"}',
              throws: 'bound',
            });

            test('a b a', {
              code: 'function f(a, b, a) {"use strict"}',
              throws: 'bound',
            });

            test('b a a', {
              code: 'function f(b, a, a) {"use strict"}',
              throws: 'bound',
            });

            test('a a b', {
              code: 'function f(a, a, b) {"use strict"}',
              throws: 'bound',
            });

            test('b a b a', {
              code: 'function f(b, a, b, a) {"use strict"}',
              throws: 'bound',
            });

            test('invalidated by destructuring', {
              code: 'function f(b, a, b, a, [fine]) {"use strict"}',
              throws: 'bound',
            });

            test('invalidated by default', {
              code: 'function f(b, a, b, a = x) {"use strict"}',
              throws: 'bound',
            });

            test('invalidated by rest', {
              code: 'function f(b, a, b, ...a) {"use strict"}',
              throws: 'bound',
            });
          });
        });

        describe('complex args', _ => {

          test('a a', {
            code: 'function f([a, a]) {}',
            throws: 'bound',
          });

          test('a b a', {
            code: 'function f([a, b, a]) {}',
            throws: 'bound',
          });

          test('b a a', {
            code: 'function f([b, a, a]) {}',
            throws: 'bound',
          });

          test('a a b', {
            code: 'function f([a, a, b]) {}',
            throws: 'bound',
          });

          test('b a b a', {
            code: 'function f([b, a, b, a]) {}',
            throws: 'bound',
          });

          test('[b a] b', {
            code: 'function f([b, a], b) {}',
            throws: 'bound',
          });

          test('[b a] {b}', {
            code: 'function f([b, a], {b}) {}',
            throws: 'bound',
          });

          test('[b a] b=x', {
            code: 'function f([b, a], b=x) {}',
            throws: 'bound',
          });

          test('[b a] ...b', {
            code: 'function f([b, a], ...b) {}',
            throws: 'bound',
          });
        });
      });

      describe('dupe local vars', _ => {

        // https://tc39.github.io/ecma262/#sec-function-definitions-static-semantics-early-errors
        // > It is a Syntax Error if any element of the LexicallyDeclaredNames of FunctionStatementList also occurs in the VarDeclaredNames of FunctionStatementList.
        //   > The LexicallyDeclaredNames of a FunctionBody does not include identifiers bound using var or function declarations.

        test('let and var', {
          code: 'function f(){ let x; var x; }',
          throws: 'bound',
        });

        test('var and let', {
          code: 'function f(){ var x; let x; }',
          throws: 'bound',
        });

        test('const and var', {
          code: 'function f(){ const x = y; var x; }',
          throws: 'bound',
        });

        test('var and const', {
          code: 'function f(){ var x; const x = y; }',
          throws: 'bound',
        });

        test('let and funcdecl', {
          code: 'function f(){ let x; function x(){} }',
          throws: 'bound',
        });

        test('funcdecl and let', {
          code: 'function f(){ function x(){} let x; }',
          throws: 'bound',
        });

        test('const and funcdecl', {
          code: 'function f(){ const x = y; function x(){} }',
          throws: 'bound',
        });

        test('funcdecl and const', {
          code: 'function f(){ function x(){} const x = y; }',
          throws: 'bound',
        });

        test.pass('funcdecl and var', {
          code: 'function f(){ function x(){} var x = y; }',
        });

        test.pass('var and funcdecl', {
          code: 'function f(){ var x = y; function x(){} }',
        });
      });

      describe('rebinding func name', _ => {

        // the func name is lexical but in its own scope, even for func exprs, however;
        // https://tc39.github.io/ecma262/#sec-block-static-semantics-toplevellexicallydeclarednames
        // > At the top level of a function, or script, function declarations are treated like var declarations
        //   rather than like lexical declarations.

        describe('plain function', _ => {

          test.pass('func decl and var', {
            code: 'function f(){ var f }',
          });

          test.pass('func decl and let', {
            code: 'function f(){ let f }',
          });

          test.pass('func expr and var', {
            code: 'x=function f(){ var f }',
          });

          test.pass('func expr and let', {
            code: 'x=function f(){ let f }',
          });

          test.pass('method and var', {
            code: 'x={f(){ var f }}',
          });

          test.pass('method and let', {
            code: 'x={f(){ let f }}',
          });

          test.pass('double decl in global scope', {
            code: 'function f(){} function f(){}',
            MODULE: {throws: 'bound'},
          });

          test('double decl in block scope', {
            code: '{ function f(){} function f(){} }',
            throws: 'bound',
          });

          test.pass('double decl in function scope', {
            code: 'function g() {  function f(){} function f(){} }',
          });
        });

        describe('async function', _ => {

          test.pass('func decl and var', {
            code: 'async function f(){ var f }',
          });

          test.pass('func decl and let', {
            code: 'async function f(){ let f }',
          });

          test.pass('func expr and var', {
            code: 'x=async function f(){ var f }',
          });

          test.pass('func expr and let', {
            code: 'x=async function f(){ let f }',
          });

          test.pass('method and var', {
            code: 'x={async f(){ var f }}',
          });

          test.pass('method and let', {
            code: 'x={async f(){ let f }}',
          });
        });

        describe('generator function', _ => {

          test.pass('func decl and var', {
            code: 'function *f(){ var f }',
          });

          test.pass('func decl and let', {
            code: 'function *f(){ let f }',
          });

          test.pass('func expr and var', {
            code: 'x=function *f(){ var f }',
          });

          test.pass('func expr and let', {
            code: 'x=function *f(){ let f }',
          });

          test.pass('method and var', {
            code: 'x={*f(){ var f }}',
          });

          test.pass('method and let', {
            code: 'x={*f(){ let f }}',
          });
        });

        describe('async generator function', _ => {

          test.pass('func decl and var', {
            code: 'async function *f(){ var f }',
          });

          test.pass('func decl and let', {
            code: 'async function *f(){ let f }',
          });

          test.pass('func expr and var', {
            code: 'x=async function *f(){ var f }',
          });

          test.pass('func expr and let', {
            code: 'x=async function *f(){ let f }',
          });

          test.pass('method and var', {
            code: 'x={async *f(){ var f }}',
          });

          test.pass('method and let', {
            code: 'x={async *f(){ let f }}',
          });
        });
      });
    });

    describe('arrow args', _ => {

      describe('dupe between args and local bindings', _ => {

        // https://tc39.github.io/ecma262/#sec-arrow-function-definitions-static-semantics-early-errors
        // > It is a Syntax Error if any element of the BoundNames of ArrowParameters also occurs in the LexicallyDeclaredNames of ConciseBody.

        test('simple arg as a let', {
          code: '(x) => { let x }',
          throws: 'bound',
        });

        test('simple arg as a const', {
          code: '(x) => { const x = y }',
          throws: 'bound',
        });

        test.pass('simple arg as a func name', {
          code: '(x) => { function x() {} }',
        });

        test.pass('simple arg as var name', {
          code: '(x) => { var x; }',
        });

        test.pass('single arg as a func name', {
          code: 'x => { function x() {} }',
        });

        test.pass('single arg as var name', {
          code: 'x => { var x; }',
        });

        test('complex arg as lex', {
          code: '([a,b,c]) => { const c = x; }',
          throws: 'bound',
        });

        test.pass('complex arg as var', {
          code: '([a,b,c]) => { var c }',
        });
      });

      describe('dupe args definitions', _ => {

        // https://tc39.github.io/ecma262/#prod-ArrowFormalParameters
        // https://tc39.github.io/ecma262/#prod-UniqueFormalParameters
        // https://tc39.github.io/ecma262/#prod-FormalParameters
        // > UniqueFormalParameters: FormalParameters
        // >   It is a Syntax Error if BoundNames of FormalParameters contains any duplicate elements.
        // (stricter than func decls since there's no exception for simple args and sloppy mode)

        describe('simple args', _ => {

          test('a a', {
            code: '(a, a) => {}',
            throws: 'bound',
          });

          test('a b a', {
            code: '(a, b, a) => {}',
            throws: 'bound',
          });

          test('b a a', {
            code: '(b, a, a) => {}',
            throws: 'bound',
          });

          test('a a b', {
            code: '(a, a, b) => {}',
            throws: 'bound',
          });

          test('b a b a', {
            code: '(b, a, b, a) => {}',
            throws: 'bound',
          });

          test('invalidated by destructuring', {
            code: '(b, a, b, a, [fine]) => {}',
            throws: 'bound',
          });

          test('invalidated by default', {
            code: '(b, a, b, a = x) => {}',
            throws: 'bound',
          });

          test('invalidated by rest', {
            code: '(b, a, b, ...a) => {}',
            throws: 'bound',
          });
        });

        describe('complex args', _ => {

          test('a a', {
            code: '([a, a]) => {}',
            throws: 'bound',
          });

          test('a b a', {
            code: '([a, b, a]) => {}',
            throws: 'bound',
          });

          test('b a a', {
            code: '([b, a, a]) => {}',
            throws: 'bound',
          });

          test('a a b', {
            code: '([a, a, b]) => {}',
            throws: 'bound',
          });

          test('b a b a', {
            code: '([b, a, b, a]) => {}',
            throws: 'bound',
          });

          test('[b a] b', {
            code: '([b, a], b) => {}',
            throws: 'bound',
          });

          test('[b a] {b}', {
            code: '([b, a], {b}) => {}',
            throws: 'bound',
          });

          test('[b a] b=x', {
            code: '([b, a], b=x) => {}',
            throws: 'bound',
          });

          test('[b a] ...b', {
            code: '([b, a], ...b) => {}',
            throws: 'bound',
          });
        });
      });
    });

    describe('methods', _ => {
      
      describe('object literal', _ => {

        describe('dupe args with local bindings', _ => {

          // https://tc39.github.io/ecma262/#sec-method-definitions-static-semantics-early-errors
          // > It is a Syntax Error if any element of the BoundNames of UniqueFormalParameters also occurs in the LexicallyDeclaredNames of FunctionBody.
          //   > The LexicallyDeclaredNames of a FunctionBody does not include identifiers bound using var or function declarations.
          // (also applies to the arg of a setter)

          test('simple arg as a let', {
            code: 'o = {f(x) { let x }}',
            throws: 'bound',
          });

          test('simple arg as a const', {
            code: 'o = {f(x) { const x = y }}',
            throws: 'bound',
          });

          test.pass('simple arg as own func name', {
            code: 'o = {f(f) { }}',
          });

          test.pass('simple arg as a func name', {
            code: 'o = {f(x) { function x() {} }}',
          });

          test.pass('simple arg as var name', {
            code: 'o = {f(x) { var x; }}',
          });
        });

        describe('dupe args definitions', _ => {

          // https://tc39.github.io/ecma262/#sec-method-definitions-static-semantics-early-errors
          // > It is a Syntax Error if any element of the BoundNames of UniqueFormalParameters also occurs in the
          //   LexicallyDeclaredNames of FunctionBody.

          describe('simple args', _ => {

            test('a a', {
              code: 'o = {f(a, a) {}}',
              throws: 'bound',
            });

            test('a b a', {
              code: 'o = {f(a, b, a) {}}',
              throws: 'bound',
            });

            test('b a a', {
              code: 'o = {f(b, a, a) {}}',
              throws: 'bound',
            });

            test('a a b', {
              code: 'o = {f(a, a, b) {}}',
              throws: 'bound',
            });

            test('b a b a', {
              code: 'o = {f(b, a, b, a) {}}',
              throws: 'bound',
            });

            test('invalidated by destructuring', {
              code: 'o = {f(b, a, b, a, [fine]) {}}',
              throws: 'bound',
            });

            test('invalidated by default', {
              code: 'o = {f(b, a, b, a = x) {}}',
              throws: 'bound',
            });

            test('invalidated by rest', {
              code: 'o = {f(b, a, b, ...a) {}}',
              throws: 'bound',
            });
          });

          describe('complex args', _ => {

            test('a a', {
              code: 'o = {f([a, a]) {}}',
              throws: 'bound',
            });

            test('a b a', {
              code: 'o = {f([a, b, a]) {}}',
              throws: 'bound',
            });

            test('b a a', {
              code: 'o = {f([b, a, a]) {}}',
              throws: 'bound',
            });

            test('a a b', {
              code: 'o = {f([a, a, b]) {}}',
              throws: 'bound',
            });

            test('b a b a', {
              code: 'o = {f([b, a, b, a]) {}}',
              throws: 'bound',
            });

            test('[b a] b', {
              code: 'o = {f([b, a], b) {}}',
              throws: 'bound',
            });

            test('[b a] {b}', {
              code: 'o = {f([b, a], {b}) {}}',
              throws: 'bound',
            });

            test('[b a] b=x', {
              code: 'o = {f([b, a], b=x) {}}',
              throws: 'bound',
            });

            test('[b a] ...b', {
              code: 'o = {f([b, a], ...b) {}}',
              throws: 'bound',
            });
          });
        });

        describe('dupe local vars', _ => {

          // https://tc39.github.io/ecma262/#sec-function-definitions-static-semantics-early-errors
          // > It is a Syntax Error if any element of the LexicallyDeclaredNames of FunctionStatementList also occurs in the VarDeclaredNames of FunctionStatementList.
          //   > The LexicallyDeclaredNames of a FunctionBody does not include identifiers bound using var or function declarations.

          test('let and var', {
            code: 'o = {f(){ let x; var x; }}',
            throws: 'bound',
          });

          test('var and let', {
            code: 'o = {f(){ var x; let x; }}',
            throws: 'bound',
          });

          test('const and var', {
            code: 'o = {f(){ const x = y; var x; }}',
            throws: 'bound',
          });

          test('var and const', {
            code: 'o = {f(){ var x; const x = y; }}',
            throws: 'bound',
          });

          test('let and funcdecl', {
            code: 'o = {f(){ let x; function x(){} }}',
            throws: 'bound',
          });

          test('funcdecl and let', {
            code: 'o = {f(){ function x(){} let x; }}',
            throws: 'bound',
          });

          test('const and funcdecl', {
            code: 'o = {f(){ const x = y; function x(){} }}',
            throws: 'bound',
          });

          test('funcdecl and const', {
            code: 'o = {f(){ function x(){} const x = y; }}',
            throws: 'bound',
          });

          test.pass('funcdecl and var', {
            code: 'o = {f(){ function x(){} var x = y; }}',
          });
        });
      });

      describe('classes', _ => {

        describe('dupe args with local bindings', _ => {

          // https://tc39.github.io/ecma262/#sec-method-definitions-static-semantics-early-errors
          // > It is a Syntax Error if any element of the BoundNames of UniqueFormalParameters also occurs in the LexicallyDeclaredNames of FunctionBody.
          //   > The LexicallyDeclaredNames of a FunctionBody does not include identifiers bound using var or function declarations.
          // (also applies to the arg of a setter)

          test('simple arg as a let', {
            code: 'class o {f(x) { let x }}',
            throws: 'bound',
          });

          test('simple arg as a const', {
            code: 'class o {f(x) { const x = y }}',
            throws: 'bound',
          });

          test.pass('simple arg as own func name', {
            code: 'class o {f(f) { }}',
          });

          test.pass('simple arg as a func name', {
            code: 'class o {f(x) { function x() {} }}',
          });

          test.pass('simple arg as var name', {
            code: 'class o {f(x) { var x; }}',
          });
        });

        describe('dupe args definitions', _ => {

          // https://tc39.github.io/ecma262/#sec-function-definitions-static-semantics-early-errors
          // > It is a Syntax Error if (IsSimpleParameterList of FormalParameterList is false or strict mode is true)
          //   and BoundNames of FormalParameterList contains any duplicate elements.

          describe('simple args', _ => {

            test('a a', {
              code: 'class o {f(a, a) {}}',
              throws: 'bound',
            });

            test('a b a', {
              code: 'class o {f(a, b, a) {}}',
              throws: 'bound',
            });

            test('b a a', {
              code: 'class o {f(b, a, a) {}}',
              throws: 'bound',
            });

            test('a a b', {
              code: 'class o {f(a, a, b) {}}',
              throws: 'bound',
            });

            test('b a b a', {
              code: 'class o {f(b, a, b, a) {}}',
              throws: 'bound',
            });

            test('invalidated by destructuring', {
              code: 'class o {f(b, a, b, a, [fine]) {}}',
              throws: 'bound',
            });

            test('invalidated by default', {
              code: 'class o {f(b, a, b, a = x) {}}',
              throws: 'bound',
            });

            test('invalidated by rest', {
              code: 'class o {f(b, a, b, ...a) {}}',
              throws: 'bound',
            });
          });

          describe('complex args', _ => {

            test('a a', {
              code: 'class o {f([a, a]) {}}',
              throws: 'bound',
            });

            test('a b a', {
              code: 'class o {f([a, b, a]) {}}',
              throws: 'bound',
            });

            test('b a a', {
              code: 'class o {f([b, a, a]) {}}',
              throws: 'bound',
            });

            test('a a b', {
              code: 'class o {f([a, a, b]) {}}',
              throws: 'bound',
            });

            test('b a b a', {
              code: 'class o {f([b, a, b, a]) {}}',
              throws: 'bound',
            });

            test('[b a] b', {
              code: 'class o {f([b, a], b) {}}',
              throws: 'bound',
            });

            test('[b a] {b}', {
              code: 'class o {f([b, a], {b}) {}}',
              throws: 'bound',
            });

            test('[b a] b=x', {
              code: 'class o {f([b, a], b=x) {}}',
              throws: 'bound',
            });

            test('[b a] ...b', {
              code: 'class o {f([b, a], ...b) {}}',
              throws: 'bound',
            });
          });
        });

        describe('dupe local vars', _ => {

          // https://tc39.github.io/ecma262/#sec-function-definitions-static-semantics-early-errors
          // > It is a Syntax Error if any element of the LexicallyDeclaredNames of FunctionStatementList also occurs in the VarDeclaredNames of FunctionStatementList.
          //   > The LexicallyDeclaredNames of a FunctionBody does not include identifiers bound using var or function declarations.

          test('let and var', {
            code: 'class o {f(){ let x; var x; }}',
            throws: 'bound',
          });

          test('var and let', {
            code: 'class o {f(){ var x; let x; }}',
            throws: 'bound',
          });

          test('const and var', {
            code: 'class o {f(){ const x = y; var x; }}',
            throws: 'bound',
          });

          test('var and const', {
            code: 'class o {f(){ var x; const x = y; }}',
            throws: 'bound',
          });

          test('let and funcdecl', {
            code: 'class o {f(){ let x; function x(){} }}',
            throws: 'bound',
          });

          test('funcdecl and let', {
            code: 'class o {f(){ function x(){} let x; }}',
            throws: 'bound',
          });

          test('const and funcdecl', {
            code: 'class o {f(){ const x = y; function x(){} }}',
            throws: 'bound',
          });

          test('funcdecl and const', {
            code: 'class o {f(){ function x(){} const x = y; }}',
            throws: 'bound',
          });

          test.pass('funcdecl and var', {
            code: 'class o {f(){ function x(){} var x = y; }}',
          });
        });
      });
    });

    describe('import', _ => {

      // https://tc39.github.io/ecma262/#sec-imports-static-semantics-early-errors
      // > It is a Syntax Error if the BoundNames of ImportDeclaration contains any duplicate entries.

      // https://tc39.github.io/ecma262/#sec-createimportbinding
      // The concrete Environment Record method CreateImportBinding for module Environment Records creates a new initialized
      // immutable indirect binding for the name N. A binding must not already exist in this Environment Record for N.

      describe('in a single import', _ => {

        test.pass('a b', {
          code: 'import {a, b} from "c"',
          SCRIPT: {throws: 'module'},
        });

        test('a a', {
          code: 'import {a, a} from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });

        test('a b a', {
          code: 'import {a, b, a} from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });

        test('b a a', {
          code: 'import {b, a, a} from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });

        test('a a b', {
          code: 'import {a, a, b} from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });

        test('alias', {
          code: 'import {a, b as a} from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });

        test('default and non-default', {
          code: 'import a, {a} from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });

        test('default and alias', {
          code: 'import a, {b as a} from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });

        test('default and redundant alias', {
          code: 'import {a, a as a} from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });

        test('default and star', {
          code: 'import a, * as a from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });
      });

      describe('in a multiple imports', _ => {

        test.pass('a b', {
          code: 'import {a} from "c"; import {b} from "c"',
          SCRIPT: {throws: 'module'},
        });

        test('a a', {
          code: 'import {a} from "c"; import {a} from "c";',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });

        test('a b a', {
          code: 'import {a} from "c"; import {b, a} from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });

        test('alias', {
          code: 'import {a} from "c"; import {b as a} from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });

        test('default and non-default', {
          code: 'import {a} from "c"; import a from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });

        test('default and alias', {
          code: 'import {a} from "c"; import {b as a} from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });

        test('default and redundant alias', {
          code: 'import {a} from "c"; import {a as a} from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });

        test('default and star', {
          code: 'import a from "c"; import * as a from "c"',
          SCRIPT: {throws: 'module'},
          throws: 'bound',
        });
      });
    });

    describe('export', _ => {

      // https://tc39.github.io/ecma262/#sec-module-semantics-static-semantics-early-errors
      // > It is a Syntax Error if the ExportedNames of ModuleItemList contains any duplicate entries.
      //   > The duplicate ExportedNames rule implies that multiple export default ExportDeclaration items within a ModuleBody is a Syntax Error.
      // > It is a Syntax Error if any element of the ExportedBindings of ModuleItemList does not also occur in either
      //   the VarDeclaredNames of ModuleItemList, or the LexicallyDeclaredNames of ModuleItemList.

      describe('in a single export', _ => {

        test.pass('a b', {
          code: 'var a,b; export {a, b}',
          SCRIPT: {throws: 'module'},
        });

        test('a a', {
          code: 'var a; export {a, a}',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('a b a', {
          code: 'var a, b; export {a, b, a}',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('b a a', {
          code: 'var a, b; export {b, a, a}',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('a a b', {
          code: 'var a, b; export {a, a, b}',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('alias', {
          code: 'var a, b; export {a, b as a}',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('export let destruct', {
          code: 'export let [x, x] = y;',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('prop and destruct', {
          code: 'export {x}; export let [x] = y;',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('destruct and prop', {
          code: 'export let [x] = y; export {x};',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('func and destruct', {
          code: 'export function x(){}; export let [x] = y;',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('destruct and func', {
          code: 'export let [x] = y; export function x(){};',
          SCRIPT: {throws: 'module'},
          throws: 'bound', // the let binding error will trigger first
        });

        test('let x, [x]', {
          code: 'export let x = y, [x] = y;',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('let x, [...x]', {
          code: 'export let x = y, [...x] = y;',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('let x, {...x}', {
          code: 'export let x = y, {...x} = y;',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('dupes with var', {
          code: 'export var a = x, a = y;',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });
      });

      describe('multiple exports', _ => {

        test.pass('a b', {
          code: 'var a,b; export {a}; export {b};',
          SCRIPT: {throws: 'module'},
        });

        test('a a', {
          code: 'var a; export {a}; export {a};',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('a b a', {
          code: 'var a,b; export {a, b}; export {a};',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('b a a', {
          code: 'var a,b; export {b, a}; export {a};',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('a a b', {
          code: 'var a,b; export {a}; export {a, b};',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('alias first', {
          code: 'export {b as a}; export {a};',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('alias second', {
          code: 'export {a}; export {b as a};',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test.pass('demand correct name to be declared for export when aliasing, this is correct', {
          code: 'var mustExist; export {mustExist as canBeUndeclared};',
          SCRIPT: {throws: 'module'},
        });

        test.fail('demand correct name to be declared for export when aliasing, this is incorrect', {
          code: 'var canBeUndeclared; export {mustExist as canBeUndeclared};',
          SCRIPT: {throws: 'module'},
        });

        test.fail('demand correct name to be declared for export when aliasing, this declared neither', {
          code: 'export {mustExist as canBeUndeclared};',
          SCRIPT: {throws: 'module'},
        });

        test('double decl', {
          code: 'export let foo; export let foo;',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('var and let', {
          code: 'export var foo; export let foo;',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('{x} and [x]', {
          code: 'export {x}; export let [x] = y;',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('{x} and [...x]', {
          code: 'export {x}; export let [...x] = y;',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('{x} and {...x}', {
          code: 'export {x}; export let {...x} = y;',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });
      });

      describe('default', _ => {

        test('double default', {
          code: 'export default function(){}; export default function(){};',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test.pass('default still exports symbol too but the export does not add another binding', {
          code: 'export default function f(){}; export {f};',
          SCRIPT: {throws: 'module'},
        });

        test('default is just a name', {
          code: 'export default x; export {y as default};',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });

        test('make sure exported symbols exist, double default name exported', {
          code: 'var x, y; export default x; export {y as default};',
          SCRIPT: {throws: 'module'},
          throws: 'twice',
        });
      });
    });

    describe('switch', _ => {

      // https://tc39.github.io/ecma262/#sec-switch-statement-static-semantics-early-errors
      // > It is a Syntax Error if the LexicallyDeclaredNames of CaseBlock contains any duplicate entries.
      // > It is a Syntax Error if any element of the LexicallyDeclaredNames of CaseBlock also occurs in the VarDeclaredNames of CaseBlock.

      test.pass('var is okay, cases', {
        code: 'switch (x) { case a: var foo; break; case b: var foo; break; }',
      });

      test.pass('var is okay, default', {
        code: 'switch (x) { case a: var foo; break; default: var foo; break; }',
      });

      test('let let, cases', {
        code: 'switch (x) { case a: let foo; break; case b: let foo; break; }',
        throws: 'bound',
      });

      test('let let, default', {
        code: 'switch (x) { case a: let foo; break; default: let foo; break; }',
        throws: 'bound',
      });

      test('let var, cases', {
        code: 'switch (x) { case a: let foo; break; case b: var foo; break; }',
        throws: 'bound',
      });

      test('var let, cases', {
        code: 'switch (x) { case a: var foo; break; case b: let foo; break; }',
        throws: 'bound',
      });

      test('let const, cases', {
        code: 'switch (x) { case a: let foo; break; case b: const foo = x; break; }',
        throws: 'bound',
      });

      test('const let, cases', {
        code: 'switch (x) { case a: const foo = x; break; case b: let foo; break; }',
        throws: 'bound',
      });

      test('const const, cases', {
        code: 'switch (x) { case a: const foo = x; break; case b: const foo = x; break; }',
        throws: 'bound',
      });

      test('const var, cases', {
        code: 'switch (x) { case a: const foo = x; break; case b: var foo = x; break; }',
        throws: 'bound',
      });

      test('var const, cases', {
        code: 'switch (x) { case a: var foo = x; break; case b: const foo = x; break; }',
        throws: 'bound',
      });

      // https://tc39.github.io/ecma262/#sec-switch-duplicates-allowed-static-semantics
      // duplicate function decl names do not cause an error in BlockStatement and SwitchStatement

      test.pass('func decls are considered `let` when not in scope root', {
        code: 'switch (x) {case a: function f(){}; break; case b: function f(){}; break; }',
        desc: 'throws in module goal since func decls are considered `let` there',
        throws: 'bound',
      });

      test('func decls can mix with let', {
        code: 'switch (x) {case a: function f(){}; break; case b: let f; break; }',
        throws: 'bound',
      });

      test('func decls cannot mix with const because it redefines', {
        code: 'switch (x) {case a: const f = x; break; case b: function f(){}; break; }',
        throws: 'bound',
      });
    });

    describe('global', _ => {

      // https://tc39.github.io/ecma262/#sec-scripts-static-semantics-early-errors
      // https://tc39.github.io/ecma262/#sec-module-semantics-static-semantics-early-errors
      // > It is a Syntax Error if the LexicallyDeclaredNames of ScriptBody contains any duplicate entries.
      // > It is a Syntax Error if any element of the LexicallyDeclaredNames of ScriptBody also occurs in the VarDeclaredNames of ScriptBody.

      test.pass('var var', {
        code: 'var x = a; var x = b;',
      });

      test('var let', {
        code: 'var x = a; let x = b;',
        throws: 'bound',
      });

      test('var const', {
        code: 'var x = a; const x = b;',
        throws: 'bound',
      });

      test.pass('var func in global', {
        code: 'var x = a; function x(){};',
        MODULE: {throws: 'bound'},
      });

      test('let let', {
        code: 'let x = a; let x = b;',
        throws: 'bound',
      });

      test('let const', {
        code: 'let x = a; const x = b;',
        throws: 'bound',
      });

      test('let func', {
        code: 'let x = a; function x(){};',
        throws: 'bound',
      });

      test('const const', {
        code: 'const x = a; const x = b;',
        throws: 'bound',
      });

      test('const func', {
        code: 'const x = a; function x(){};',
        throws: 'bound',
      });
    });

    describe('block', _ => {

      // https://tc39.github.io/ecma262/#sec-block-duplicates-allowed-static-semantics
      // duplicate function decl names do not cause an error in BlockStatement and SwitchStatement

      test.pass('dupe funcs in global are fine in SCRIPT', {
        code: 'function f(){} function f(){}',
        MODULE: {throws: 'bound'},
      });

      test('dupe funcs in block are bad', {
        code: '{ function f(){} function f(){} }',
        throws: 'bound',
      });

      test.pass('can redeclare arg as var', {
        code: 'function f(x) {var x}'
      });

      test.pass('can redeclare arg as blocked var', {
        code: 'function f(x) {{var x}}'
      });

      test.pass('can redeclare arg as blocked let', {
        code: 'function f(x) {{let x}}'
      });

      test.pass('can redeclare func name as var', {
        code: 'function f() {var f}'
      });

      test.pass('can redeclare func name as blocked var', {
        code: 'function f() {{var f}}'
      });

      test.pass('can redeclare func name as let', {
        code: 'function f() {let f}'
      });

      test.pass('can redeclare func name as blocked let', {
        code: 'function f() {{let f}}'
      });

      test.fail('var and let in same lexical scope', {
        code: 'var x; let x;',
      });

      test.fail('lex and var in same lexical scope', {
        code: 'let x; var x;',
      });

      test.pass('var outer before let inner', {
        code: 'var x; { let x; }',
      });

      test.pass('var outer after let inner', {
        code: '{ let x; } var x;',
      });

      test.fail('let outer before var inner', {
        code: 'let x; { var x; }',
      });

      test.fail('let outer after var inner', {
        code: '{ var x; } let x;',
        desc: 'this was a tricky case since `var` names share a single scope so something had to be added to still be able to scan downward, retroactively',
      });

      describe('annex b function statement exception', _ => {

        describe('without webcompat', _ => {

          test.fail('in block, illegal without webcompat', {
            code: '{ function f() {} ; function f() {} }',
          });

          test.fail('in block under if, illegal without webcompat', {
            code: '{ if (x) function f() {} ; function f() {} }',
          });

          test.pass('exception does not apply to global but its legal there regardless', {
            code: 'function f() {} ; function f() {}',
            MODULE: {throws: 'bound'},
          });

          test.pass('exception does not apply to function scope but its legal there regardless', {
            code: 'function g(){ function f() {} ; function f() {} }',
          });

          test.fail('func and var', {
            code: 'function f(){ var f = 123; if (true) function f(){} }',
          });

          test.fail('function statement gets own special block scope so does not clash with other vars', {
            code: '{ var f = 123; if (true) function f(){} }',
            desc: 'only with webcompat, though, so this test fails without it',
          });
        });

        describe('with webcompat', _ => {

          test('in block, in webcompat, lexical declarations should not trigger syntax error if only bound to function decl names', {
            code: '{ function f() {} ; function f() {} }',
            WEB: true,
            STRICT: {throws: true},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'FunctionDeclaration',
                      generator: false,
                      async: false,
                      expression: false,
                      id: {type: 'Identifier', name: 'f'},
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                    {type: 'EmptyStatement'},
                    {
                      type: 'FunctionDeclaration',
                      generator: false,
                      async: false,
                      expression: false,
                      id: {type: 'Identifier', name: 'f'},
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  ],
                },
              ],
            },
            tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('in block under if, in webcompat, lexical declarations should not trigger syntax error if only bound to function decl names', {
            code: '{ if (x) function f() {} ; function f() {} }',
            WEB: true,
            STRICT: {throws: true},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'IfStatement',
                      test: {type: 'Identifier', name: 'x'},
                      consequent: {
                        type: 'FunctionDeclaration',
                        generator: false,
                        async: false,
                        expression: false,
                        id: {type: 'Identifier', name: 'f'},
                        params: [],
                        body: {type: 'BlockStatement', body: []},
                      },
                      alternate: null,
                    },
                    {type: 'EmptyStatement'},
                    {
                      type: 'FunctionDeclaration',
                      generator: false,
                      async: false,
                      expression: false,
                      id: {type: 'Identifier', name: 'f'},
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  ],
                },
              ],
            },
            tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test.pass('exception does not apply to global but its legal there regardless', {
            code: 'function f() {} ; function f() {}',
            MODULE: {throws: 'bound'},
            WEB: true,
          });

          test.pass('exception does not apply to function scope but its legal there regardless', {
            code: 'function g(){ function f() {} ; function f() {} }',
            WEB: true,
          });

          test.pass('func and var', {
            code: 'function f(){ var f = 123; if (true) function f(){} }',
            MODULE: {throws: true},
            WEB: true,
          });

          test.fail_strict('function statement gets own special block scope so does not clash with other vars', {
            code: '{ var f = 123; if (true) function f(){} }',
            MODULE: {throws: true},
            WEB: true,
          });
        });
      });
    });
  });


