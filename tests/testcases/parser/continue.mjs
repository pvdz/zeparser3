import {$ASI, $IDENT, $PUNCTUATOR} from '../../../src/zetokenizer';

export default (describe, test) =>
  describe('continue statement', _ => {

    describe('in a loop', _ => {
      test('continue without label inside a for-loop', {
        code: 'for (;;) continue',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: null,
              test: null,
              update: null,
              body: {type: 'ContinueStatement', label: null},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('continue without label inside a for-in', {
        code: 'for (x in y) continue',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {type: 'Identifier', name: 'x'},
              right: {type: 'Identifier', name: 'y'},
              body: {type: 'ContinueStatement', label: null},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('continue without label inside a for-of', {
        code: 'for (x of y) continue',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {type: 'Identifier', name: 'x'},
              right: {type: 'Identifier', name: 'y'},
              await: false,
              body: {type: 'ContinueStatement', label: null},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('continue without label inside a while', {
        code: 'while (x) continue',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'WhileStatement',
              test: {type: 'Identifier', name: 'x'},
              body: {type: 'ContinueStatement', label: null},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('continue without label inside a do-while', {
        code: 'do continue; while(foo);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'DoWhileStatement',
              body: {type: 'ContinueStatement', label: null},
              test: {type: 'Identifier', name: 'foo'},
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('continue with label inside a for-loop', {
        code: 'foo: for (;;) continue foo',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'LabeledStatement',
              label: {type: 'Identifier', name: 'foo'},
              body: {
                type: 'ForStatement',
                init: null,
                test: null,
                update: null,
                body: {
                  type: 'ContinueStatement',
                  label: {type: 'Identifier', name: 'foo'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });

      test('continue with label inside a for-in', {
        code: 'foo: for (x in y) continue foo',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'LabeledStatement',
              label: {type: 'Identifier', name: 'foo'},
              body: {
                type: 'ForInStatement',
                left: {type: 'Identifier', name: 'x'},
                right: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ContinueStatement',
                  label: {type: 'Identifier', name: 'foo'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });

      test('continue with label inside a for-of', {
        code: 'foo: for (x of y) continue foo',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'LabeledStatement',
              label: {type: 'Identifier', name: 'foo'},
              body: {
                type: 'ForOfStatement',
                left: {type: 'Identifier', name: 'x'},
                right: {type: 'Identifier', name: 'y'},
                await: false,
                body: {
                  type: 'ContinueStatement',
                  label: {type: 'Identifier', name: 'foo'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });

      test('continue with label inside a while', {
        code: 'foo: while (x) continue foo',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'LabeledStatement',
              label: {type: 'Identifier', name: 'foo'},
              body: {
                type: 'WhileStatement',
                test: {type: 'Identifier', name: 'x'},
                body: {
                  type: 'ContinueStatement',
                  label: {type: 'Identifier', name: 'foo'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });

      test('continue with label inside a do-while', {
        code: 'foo: do continue foo; while(foo);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'LabeledStatement',
              label: {type: 'Identifier', name: 'foo'},
              body: {
                type: 'DoWhileStatement',
                body: {
                  type: 'ContinueStatement',
                  label: {type: 'Identifier', name: 'foo'},
                },
                test: {type: 'Identifier', name: 'foo'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('cannot use in a switch', _ => {

      test.fail('continue without label inside a case', {
        code: 'switch (x) { case x: continue; }',
      });

      test.fail('continue without label inside a default', {
        code: 'switch (x) { default: continue; }',
      });

      test.fail('continue without label inside a switch nested if', {
        code: 'switch (x) { case x: if (foo) continue; }',
      });

      test.fail('continue without label inside a switch nested block', {
        code: 'switch (x) { case x: {continue;} }',
      });

      test.fail('continue with label inside a case', {
        code: 'switch (x) { case x: continue foo; }',
      });

      test.fail('continue with label inside a default', {
        code: 'switch (x) { default: continue foo; }',
      });

      test.fail('continue with label inside a switch nested block', {
        code: 'switch (x) { case x: if (foo) {continue foo;} }',
      });

      test.fail('continue with label inside a switch nested if', {
        code: 'switch (x) { case x: if (foo) continue foo; }',
      });
    });

    test.fail('continue at eof (without label, with semi)', {
      code: 'continue;',
    });

    test.fail('continue at eof (without label, without semi)', {
      code: 'continue',
    });

    test.fail('continue at eof (with label, with semi)', {
      code: 'continue foo;',
    });

    test.fail('continue at eof (with label, without semi)', {
      code: 'continue foo',
    });

    test.fail('double continue', {
      code: 'continue; continue;',
    });

    test.fail('double continue with asi', {
      code: 'continue\ncontinue;',
    });

    test.fail('double continue with label and semi', {
      code: 'continue foo;continue;',
    });

    test.fail('double continue with label and asi', {
      code: 'continue foo\ncontinue;',
    });

    describe('nesting', _ => {

      describe('bad', _ => {

        describe('global', _ => {

          test.fail('plain', {
            code: 'continue',
          });

          test.fail('block', {
            code: '{ continue }',
          });

          test.fail('nested', {
            code: 'if (x) continue',
          });

          test.fail('labeled', {
            code: 'continue y',
          });

          test.fail('labeled nested', {
            code: 'if (x) continue y',
          });
        });

        describe('function', _ => {

          test.fail('plain', {
            code: 'function f(){    continue    }',
          });

          test.fail('block', {
            code: 'function f(){   { continue }   }',
          });

          test.fail('nested', {
            code: 'function f(){    if (x) continue   }',
          });

          test.fail('labeled', {
            code: 'function f(){    continue y   }',
          });

          test.fail('labeled nested', {
            code: 'function f(){    if (x) continue y   }',
          });
        });

        describe('arrow', _ => {

          test.fail('expr', {
            code: '() =>     continue',
          });

          test.fail('plain', {
            code: '() => {    continue    }',
          });

          test.fail('block', {
            code: '() => {   { continue }   }',
          });

          test.fail('nested', {
            code: '() => {    if (x) continue   }',
          });

          test.fail('labeled', {
            code: '() => {    continue y   }',
          });

          test.fail('labeled nested', {
            code: '() => {    if (x) continue y   }',
          });
        });
      });

      describe('switch', _ => {

        describe('global', _ => {

          test.fail('plain', {
            code: 'switch (x){ case z:    continue   }',
          });

          test.fail('block', {
            code: 'switch (x){ case z:    { continue }  }',
          });

          test.fail('nested', {
            code: 'switch (x){ case z:    if (x) continue   }',
          });

          test.fail('labeled', {
            code: 'switch (x){ case z:    continue y   }',
          });

          test.fail('labeled nested', {
            code: 'switch (x){ case z:    if (x) continue y   }',
          });
        });

        describe('function', _ => {

          test.fail('plain', {
            code: 'function f(){ switch (x){ case z:       continue    }}',
          });

          test.fail('block', {
            code: 'function f(){ switch (x){ case z:       { continue }    }}',
          });

          test.fail('nested', {
            code: 'function f(){ switch (x){ case z:       if (x) continue   }}',
          });

          test.fail('labeled', {
            code: 'function f(){ switch (x){ case z:       continue y   }}',
          });

          test.fail('labeled nested', {
            code: 'function f(){ switch (x){ case z:       if (x) continue y   }}',
          });
        });

        describe('arrow', _ => {

          test.fail('plain', {
            code: '() => { switch (x){ case z:       continue    }}',
          });

          test.fail('nested', {
            code: '() => { switch (x){ case z:       if (x) continue   }}',
          });

          test.fail('labeled', {
            code: '() => { switch (x){ case z:       continue y   }}',
          });

          test.fail('labeled nested', {
            code: '() => { switch (x){ case z:       if (x) continue y   }}',
          });
        });
      });

      describe('for', _ => {

        describe('global', _ => {

          test.pass('plain', {
            code: 'for (;;)    continue   }',
          });

          test.pass('block', {
            code: 'for (;;)    { continue }   }',
          });

          test.pass('nested', {
            code: 'for (;;)    if (x) continue   }',
          });

          test.fail('labeled', {
            code: 'for (;;)    continue y   }',
          });

          test.fail('labeled nested', {
            code: 'for (;;)    if (x) continue y   }',
          });
        });

        describe('function', _ => {

          test.pass('plain', {
            code: 'function f(){ for (;;)       continue    }}',
          });

          test.pass('block', {
            code: 'function f(){ for (;;)       { continue }    }}',
          });

          test.pass('nested', {
            code: 'function f(){ for (;;)       if (x) continue   }}',
          });

          test.fail('labeled', {
            code: 'function f(){ for (;;)       continue y   }}',
          });

          test.fail('labeled nested', {
            code: 'function f(){ for (;;)       if (x) continue y   }}',
          });
        });

        describe('arrow', _ => {

          test.pass('plain', {
            code: '() => { for (;;)       continue    }}',
          });

          test.pass('block', {
            code: '() => { for (;;)       { continue }    }}',
          });

          test.pass('nested', {
            code: '() => { for (;;)       if (x) continue   }}',
          });

          test.fail('labeled', {
            code: '() => { for (;;)       continue y   }}',
          });

          test.fail('labeled nested', {
            code: '() => { for (;;)       if (x) continue y   }}',
          });
        });
      });

      describe('while', _ => {

        describe('global', _ => {

          test.pass('plain', {
            code: 'while (true)    continue   }',
          });

          test.pass('block', {
            code: 'while (true)    { continue }   }',
          });

          test.pass('nested', {
            code: 'while (true)    if (x) continue   }',
          });

          test.fail('labeled', {
            code: 'while (true)    continue y   }',
          });

          test.fail('labeled nested', {
            code: 'while (true)    if (x) continue y   }',
          });
        });

        describe('function', _ => {

          test.pass('plain', {
            code: 'function f(){ while (true)       continue    }}',
          });

          test.pass('block', {
            code: 'function f(){ while (true)       { continue }    }}',
          });

          test.pass('nested', {
            code: 'function f(){ while (true)       if (x) continue   }}',
          });

          test.fail('labeled', {
            code: 'function f(){ while (true)       continue y   }}',
          });

          test.fail('labeled nested', {
            code: 'function f(){ while (true)       if (x) continue y   }}',
          });
        });

        describe('arrow', _ => {

          test.pass('plain', {
            code: '() => { while (true)       continue    }}',
          });

          test.pass('block', {
            code: '() => { while (true)       { continue }    }}',
          });

          test.pass('nested', {
            code: '() => { while (true)       if (x) continue   }}',
          });

          test.fail('labeled', {
            code: '() => { while (true)       continue y   }}',
          });

          test.fail('labeled nested', {
            code: '() => { while (true)       if (x) continue y   }}',
          });
        });
      });

      describe('do-while', _ => {

        describe('global', _ => {

          test.pass('plain', {
            code: 'do     continue   ; while(true);',
          });

          test.pass('block', {
            code: 'do     {continue}    while(true);',
          });

          test.pass('nested', {
            code: 'do     if (x) continue   ; while(true);',
          });

          test.fail('labeled', {
            code: 'do     continue y   ; while(true);',
          });

          test.fail('labeled nested', {
            code: 'do     if (x) continue y   ; while(true);',
          });
        });

        describe('function', _ => {

          test.pass('plain', {
            code: 'function f(){ do        continue    ; while(true);}',
          });

          test.pass('block', {
            code: 'function f(){ do        { continue }     while(true);}',
          });

          test.pass('nested', {
            code: 'function f(){ do        if (x) continue   ; while(true);}',
          });

          test.fail('labeled', {
            code: 'function f(){ do        continue y   ; while(true);}',
          });

          test.fail('labeled nested', {
            code: 'function f(){ do        if (x) continue y   ; while(true);}',
          });
        });

        describe('arrow', _ => {

          test.pass('plain', {
            code: '() => { do        continue    ; while(true);}',
          });

          test.pass('block', {
            code: '() => { do        { continue }     while(true);}',
          });

          test.pass('nested', {
            code: '() => { do        if (x) continue   ; while(true);}',
          });

          test.fail('labeled', {
            code: '() => { do        continue y   ; while(true);}',
          });

          test.fail('labeled nested', {
            code: '() => { do        if (x) continue y   ; while(true);}',
          });
        });
      });
    });

    describe('labels', _ => {

      test.pass('continue to label in while', {
        code: 'foo: while(true)continue foo;',
      });

      test.pass('continue to label in do', {
        code: 'foo: do continue foo; while(true)',
      });

      test.pass('continue to label in for-loop', {
        code: 'foo: for (;;) continue foo;',
      });

      test.pass('continue to label in for-in', {
        code: 'foo: for (x in y) continue foo;',
      });

      test.pass('continue to label in for-of', {
        code: 'foo: for (x of y) continue foo;',
      });

      test.pass('continue to label in for-await', {
        code: 'async function f(){ foo: for await (x of y) continue foo; }',
      });

      test.pass('continue to label in nested if', {
        code: 'foo: while (true) if (x) continue foo;',
      });

      test.pass('continue to label in nested else', {
        code: 'foo: while (true) if (x); else continue foo;',
      });

      test.pass('continue to label in nested if block', {
        code: 'foo: while (true) if (x) { continue foo; }',
      });

      test.pass('continue to label in nested block', {
        code: 'foo: while (true) { continue foo; }',
      });

      test.pass('continue to label in nested block-if', {
        code: 'foo: while (true) { if (x) continue foo; }',
      });

      test.pass('continue to label in nested while', {
        code: 'foo: while (true) while (x) continue foo;',
      });

      test.pass('continue to nested inner label', {
        code: 'bar: foo: while (true) continue foo;',
      });

      test.pass('continue to nested outer label', {
        code: 'foo: bar: while (true) continue foo;',
      });

      test.pass('continue to nested middle label', {
        code: 'ding: foo: bar: while (true) continue foo;',
      });

      test('continue with non-existing label', {
        code: 'while (true) continue x;',
        throws: 'not defined',
      });

      test('continue with label not defined in current statement sub-tree', {
        code: 'x: foo; while (true) continue x;',
        throws: 'not defined',
      });

      test('label defined inside current loop', {
        code: 'while (true) x: continue x;',
        throws: 'defined inside',
      });

      test('label defined inside nested loop', {
        code: 'while (true) while (true) x: continue x;',
        throws: 'defined inside',
      });

      test.pass('label defined in outer loop', {
        code: 'while (true) x: while (true) continue x;',
      });

      test.pass('label defined before outer loop', {
        code: 'x: while (true) while (true) continue x;',
      });
    });
  });
