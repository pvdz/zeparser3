import {$ASI, $IDENT, $PUNCTUATOR} from '../../../src/zetokenizer';

export default (describe, test) =>
  describe('statements and declarations', _ => {

    describe('cannot nest a declaration inside a non-block statement', _ => {

      // there are a bunch of declarations and statements to mix-and-match test. anything with sub statements / decls
      // if/else, try/catch/finally, for, while, do, block, case/default, with
      // const, let, class, function

      describe('function', _ => {

        describe('regular', _ => {

          test.fail('if', {
            code: 'if (x) function f() {}',
          });

          test.fail('else', {
            code: 'if (x); else function f() {}',
          });

          test.fail('label', {
            code: 'foo: function f() {}',
          });

          test.pass('try', {
            code: 'try { function f() {} } finally {}',
          });

          test.pass('catch', {
            code: 'try { } catch (e) { function f() {} }',
          });

          test.pass('finally', {
            code: 'try { } finally { function f() {} }',
          });

          test.fail('for', {
            code: 'for (;;) function f() {}',
          });

          test.fail('while', {
            code: 'while (;;) function f() {}',
          });

          test.fail('do', {
            code: 'do function f() {}; while (x);',
          });

          test.pass('block', {
            code: '{ function f() {} }',
          });

          test.pass('case', {
            code: 'switch (x) { case x: function f() {} }',
          });

          test.pass('default', {
            code: 'switch (x) { default: function f() {} }',
          });

          test.fail('with', {
            code: 'with(x) function f() {}',
            STRICT: {throws: 'strict mode'},
          });
        });

        describe('async', _ => {

          test.fail('if', {
            code: 'if (x) async function f() {}',
          });

          test.fail('else', {
            code: 'if (x); else async function f() {}',
          });

          test.fail('label', {
            code: 'foo: async function f() {}',
          });

          test.pass('try', {
            code: 'try { async function f() {} } finally {}',
          });

          test.pass('catch', {
            code: 'try { } catch (e) { async function f() {} }',
          });

          test.pass('finally', {
            code: 'try { } finally { async function f() {} }',
          });

          test.fail('for', {
            code: 'for (;;) async function f() {}',
          });

          test.fail('while', {
            code: 'while (;;) async function f() {}',
          });

          test.fail('do', {
            code: 'do async function f() {}; while (x);',
          });

          test.pass('block', {
            code: '{ async function f() {} }',
          });

          test.pass('case', {
            code: 'switch (x) { case x: async function f() {} }',
          });

          test.pass('default', {
            code: 'switch (x) { default: async function f() {} }',
          });

          test.fail('with', {
            code: 'with(x) async function f() {}',
            STRICT: {throws: 'strict mode'},
          });
        });

        describe('generator', _ => {

          test.fail('if', {
            code: 'if (x) function * f() {}',
          });

          test.fail('else', {
            code: 'if (x); else function * f() {}',
          });

          test.fail('label', {
            code: 'foo: function *f() {}',
          });

          test.pass('try', {
            code: 'try { function * f() {} } finally {}',
          });

          test.pass('catch', {
            code: 'try { } catch (e) { function * f() {} }',
          });

          test.pass('finally', {
            code: 'try { } finally { function * f() {} }',
          });

          test.fail('for', {
            code: 'for (;;) function * f() {}',
          });

          test.fail('while', {
            code: 'while (;;) function * f() {}',
          });

          test.fail('do', {
            code: 'do function * f() {}; while (x);',
          });

          test.pass('block', {
            code: '{ function * f() {} }',
          });

          test.pass('case', {
            code: 'switch (x) { case x: function * f() {} }',
          });

          test.pass('default', {
            code: 'switch (x) { default: function * f() {} }',
          });

          test.fail('with', {
            code: 'with(x) function * f() {}',
            STRICT: {throws: 'strict mode'},
          });
        });

        // TODO: async generator too
      });
      
      describe('let', _ => {

        test.fail('if', {
          code: 'if (x) let y = x',
        });

        test.fail('else', {
          code: 'if (x); else let y = x',
        });

        test.fail('label', {
          code: 'foo: let y = x',
        });

        test.pass('try', {
          code: 'try { let y = x } finally {}',
        });

        test.pass('catch', {
          code: 'try { } catch (e) { let y = x }',
        });

        test.pass('finally', {
          code: 'try { } finally { let y = x }',
        });

        test.fail('for', {
          code: 'for (;;) let y = x',
        });

        test.fail('while', {
          code: 'while (;;) let y = x',
        });

        test.fail('do', {
          code: 'do let y = x; while (x);',
        });

        test.pass('block', {
          code: '{ let y = x }',
        });

        test.pass('case', {
          code: 'switch (x) { case x: let y = x }',
        });

        test.pass('default', {
          code: 'switch (x) { default: let y = x }',
        });

        test.fail('with', {
          code: 'with(x) let y = x',
          STRICT: {throws: 'strict mode'},
        });
      });

      describe('const', _ => {

        test.fail('if', {
          code: 'if (x) const y = x',
        });

        test.fail('else', {
          code: 'if (x); else const y = x',
        });

        test.fail('label', {
          code: 'foo: const y = x',
        });

        test.pass('try', {
          code: 'try { const y = x } finally {}',
        });

        test.pass('catch', {
          code: 'try { } catch (e) { const y = x }',
        });

        test.pass('finally', {
          code: 'try { } finally { const y = x }',
        });

        test.fail('for', {
          code: 'for (;;) const y = x',
        });

        test.fail('while', {
          code: 'while (;;) const y = x',
        });

        test.fail('do', {
          code: 'do const y = x; while (x);',
        });

        test.pass('block', {
          code: '{ const y = x }',
        });

        test.pass('case', {
          code: 'switch (x) { case x: const y = x }',
        });

        test.pass('default', {
          code: 'switch (x) { default: const y = x }',
        });

        test.fail('with', {
          code: 'with(x) const y = x',
          STRICT: {throws: 'strict mode'},
        });
      });

      describe('class', _ => {

        test.fail('if', {
          code: 'if (x) class X {}',
        });

        test.fail('else', {
          code: 'if (x); else class X {}',
        });

        test.fail('label', {
          code: 'foo: class x {}',
        });

        test.pass('try', {
          code: 'try { class X {} } finally {}',
        });

        test.pass('catch', {
          code: 'try { } catch (e) { class X {} }',
        });

        test.pass('finally', {
          code: 'try { } finally { class X {} }',
        });

        test.fail('for', {
          code: 'for (;;) class X {}',
        });

        test.fail('while', {
          code: 'while (;;) class X {}',
        });

        test.fail('do', {
          code: 'do class X {}; while (x);',
        });

        test.pass('block', {
          code: '{ class X {} }',
        });

        test.pass('case', {
          code: 'switch (x) { case x: class X {} }',
        });

        test.pass('default', {
          code: 'switch (x) { default: class X {} }',
        });

        test.fail('with', {
          code: 'with(x) class X {}',
          STRICT: {throws: 'strict mode'},
        });
      });
    });
  });
