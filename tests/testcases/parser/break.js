let {$ASI, $IDENT, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('break statement', _ => {

    describe('in a switch', _ => {

      test('break without label inside a case', {
        code: 'switch (x) { case x: break; }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'SwitchStatement',
              discriminant: {type: 'Identifier', name: 'x'},
              cases: [
                {
                  type: 'SwitchCase',
                  test: {type: 'Identifier', name: 'x'},
                  consequent: [{type: 'BreakStatement', label: null}],
                },
              ],
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('break without label inside a default', {
        code: 'switch (x) { default: break; }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'SwitchStatement',
              discriminant: {type: 'Identifier', name: 'x'},
              cases: [
                {
                  type: 'SwitchCase',
                  test: null,
                  consequent: [{type: 'BreakStatement', label: null}],
                },
              ],
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('break without label inside a switch nested if', {
        code: 'switch (x) { case x: if (foo) break; }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'SwitchStatement',
              discriminant: {type: 'Identifier', name: 'x'},
              cases: [
                {
                  type: 'SwitchCase',
                  test: {type: 'Identifier', name: 'x'},
                  consequent: [
                    {
                      type: 'IfStatement',
                      test: {type: 'Identifier', name: 'foo'},
                      consequent: {type: 'BreakStatement', label: null},
                      alternate: null,
                    },
                  ],
                },
              ],
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('break without label inside a switch nested block', {
        code: 'switch (x) { case x: {break;} }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'SwitchStatement',
              discriminant: {type: 'Identifier', name: 'x'},
              cases: [
                {
                  type: 'SwitchCase',
                  test: {type: 'Identifier', name: 'x'},
                  consequent: [
                    {
                      type: 'BlockStatement',
                      body: [{type: 'BreakStatement', label: null}],
                    },
                  ],
                },
              ],
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('break with label inside a case', {
        code: 'switch (x) { case x: break foo; }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'SwitchStatement',
              discriminant: {type: 'Identifier', name: 'x'},
              cases: [
                {
                  type: 'SwitchCase',
                  test: {type: 'Identifier', name: 'x'},
                  consequent: [
                    {
                      type: 'BreakStatement',
                      label: {type: 'Identifier', name: 'foo'},
                    },
                  ],
                },
              ],
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('break with label inside a default', {
        code: 'switch (x) { default: break foo; }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'SwitchStatement',
              discriminant: {type: 'Identifier', name: 'x'},
              cases: [
                {
                  type: 'SwitchCase',
                  test: null,
                  consequent: [
                    {
                      type: 'BreakStatement',
                      label: {type: 'Identifier', name: 'foo'},
                    },
                  ],
                },
              ],
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('break with label inside a switch nested block', {
        code: 'switch (x) { case x: if (foo) {break foo;} }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'SwitchStatement',
              discriminant: {type: 'Identifier', name: 'x'},
              cases: [
                {
                  type: 'SwitchCase',
                  test: {type: 'Identifier', name: 'x'},
                  consequent: [
                    {
                      type: 'IfStatement',
                      test: {type: 'Identifier', name: 'foo'},
                      consequent: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'BreakStatement',
                            label: {type: 'Identifier', name: 'foo'},
                          },
                        ],
                      },
                      alternate: null,
                    },
                  ],
                },
              ],
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('break with label inside a switch nested if', {
        code: 'switch (x) { case x: if (foo) break foo; }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'SwitchStatement',
              discriminant: {type: 'Identifier', name: 'x'},
              cases: [
                {
                  type: 'SwitchCase',
                  test: {type: 'Identifier', name: 'x'},
                  consequent: [
                    {
                      type: 'IfStatement',
                      test: {type: 'Identifier', name: 'foo'},
                      consequent: {
                        type: 'BreakStatement',
                        label: {type: 'Identifier', name: 'foo'},
                      },
                      alternate: null,
                    },
                  ],
                },
              ],
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('in a loop', _ => {

      test('break without label inside a for-loop', {
        code: 'for (;;) break',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: null,
              test: null,
              update: null,
              body: {type: 'BreakStatement', label: null},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('break without label inside a for-in', {
        code: 'for (x in y) break',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {type: 'Identifier', name: 'x'},
              right: {type: 'Identifier', name: 'y'},
              body: {type: 'BreakStatement', label: null},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('break without label inside a for-of', {
        code: 'for (x of y) break',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {type: 'Identifier', name: 'x'},
              right: {type: 'Identifier', name: 'y'},
              body: {type: 'BreakStatement', label: null},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('break without label inside a while', {
        code: 'while (x) break',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'WhileStatement',
              test: {type: 'Identifier', name: 'x'},
              body: {type: 'BreakStatement', label: null},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('break without label inside a do-while', {
        code: 'do break; while(foo);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'DoWhileStatement',
              body: {type: 'BreakStatement', label: null},
              test: {type: 'Identifier', name: 'foo'},
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('break with label inside a for-loop', {
        code: 'for (;;) break foo',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: null,
              test: null,
              update: null,
              body: {
                type: 'BreakStatement',
                label: {type: 'Identifier', name: 'foo'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });

      test('break with label inside a for-in', {
        code: 'for (x in y) break foo',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {type: 'Identifier', name: 'x'},
              right: {type: 'Identifier', name: 'y'},
              body: {
                type: 'BreakStatement',
                label: {type: 'Identifier', name: 'foo'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });

      test('break with label inside a for-of', {
        code: 'for (x of y) break foo',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {type: 'Identifier', name: 'x'},
              right: {type: 'Identifier', name: 'y'},
              body: {
                type: 'BreakStatement',
                label: {type: 'Identifier', name: 'foo'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });

      test('break with label inside a while', {
        code: 'while (x) break foo',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'WhileStatement',
              test: {type: 'Identifier', name: 'x'},
              body: {
                type: 'BreakStatement',
                label: {type: 'Identifier', name: 'foo'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });

      test('break with label inside a do-while', {
        code: 'do break foo; while(foo);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'DoWhileStatement',
              body: {
                type: 'BreakStatement',
                label: {type: 'Identifier', name: 'foo'},
              },
              test: {type: 'Identifier', name: 'foo'},
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    test.fail('break at eof (without label, with semi)', {
      code: 'break;',
    });

    test.fail('break at eof (without label, without semi)', {
      code: 'break',
    });

    test('break at eof (with label, with semi)', {
      code: 'break foo;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'BreakStatement',
            label: {type: 'Identifier', name: 'foo'},
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR],
    });

    test('break at eof (with label, without semi)', {
      code: 'break foo',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'BreakStatement',
            label: {type: 'Identifier', name: 'foo'},
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $ASI],
    });

    test.fail('double break', {
      code: 'break; break;',
    });

    test.fail('double break with asi', {
      code: 'break\nbreak;',
    });

    test.fail('double break with label and semi', {
      code: 'break foo;break;',
    });

    test.fail('double break with label and asi', {
      code: 'break foo\nbreak;',
    });
    
    describe('nesting', _ => {

      describe('bad', _ => {
        
        describe('global', _ => {

          test.fail('plain', {
            code: 'break',
          });

          test.fail('block', {
            code: '{ break }',
          });

          test.fail('nested', {
            code: 'if (x) break',
          });

          test('labeled', {
            code: 'break y',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'BreakStatement',
                  label: {type: 'Identifier', name: 'y'},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $ASI],
          });

          test('labeled nested', {
            code: 'if (x) break y',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'IfStatement',
                  test: {type: 'Identifier', name: 'x'},
                  consequent: {
                    type: 'BreakStatement',
                    label: {type: 'Identifier', name: 'y'},
                  },
                  alternate: null,
                },
              ],
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
          });
        });

        describe('function', _ => {

          test.fail('plain', {
            code: 'function f(){    break    }',
          });

          test.fail('block', {
            code: 'function f(){   { break }   }',
          });

          test.fail('nested', {
            code: 'function f(){    if (x) break   }',
          });

          test('labeled', {
            code: 'function f(){    break y   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'BreakStatement',
                        label: {type: 'Identifier', name: 'y'},
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $ASI, $PUNCTUATOR],
          });

          test('labeled nested', {
            code: 'function f(){    if (x) break y   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'IfStatement',
                        test: {type: 'Identifier', name: 'x'},
                        consequent: {
                          type: 'BreakStatement',
                          label: {type: 'Identifier', name: 'y'},
                        },
                        alternate: null,
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI, $PUNCTUATOR],
          });
        });

        describe('arrow', _ => {

          test.fail('expr', {
            code: '() =>     break',
          });

          test.fail('plain', {
            code: '() => {    break    }',
          });

          test.fail('block', {
            code: '() => {   { break }   }',
          });

          test.fail('nested', {
            code: '() => {    if (x) break   }',
          });

          test('labeled', {
            code: '() => {    break y   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    params: [],
                    id: null,
                    generator: false,
                    async: false,
                    expression: false,
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'BreakStatement',
                          label: {type: 'Identifier', name: 'y'},
                        },
                      ],
                    },
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $ASI, $PUNCTUATOR, $ASI],
          });

          test('labeled nested', {
            code: '() => {    if (x) break y   }',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    params: [],
                    id: null,
                    generator: false,
                    async: false,
                    expression: false,
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'IfStatement',
                          test: {type: 'Identifier', name: 'x'},
                          consequent: {
                            type: 'BreakStatement',
                            label: {type: 'Identifier', name: 'y'},
                          },
                          alternate: null,
                        },
                      ],
                    },
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI, $PUNCTUATOR, $ASI],
          });
        });
      });

      describe('switch', _ => {

        describe('global', _ => {

          test.pass('plain', {
            code: 'switch (x){ case z:    break   }',
          });

          test.pass('block', {
            code: 'switch (x){ case z:    { break }  }',
          });

          test.pass('nested', {
            code: 'switch (x){ case z:    if (x) break   }',
          });

          test.pass('labeled', {
            code: 'switch (x){ case z:    break y   }',
          });

          test.pass('labeled nested', {
            code: 'switch (x){ case z:    if (x) break y   }',
          });
        });

        describe('function', _ => {

          test.pass('plain', {
            code: 'function f(){ switch (x){ case z:       break    }}',
          });

          test.pass('block', {
            code: 'function f(){ switch (x){ case z:       { break }    }}',
          });

          test.pass('nested', {
            code: 'function f(){ switch (x){ case z:       if (x) break   }}',
          });

          test.pass('labeled', {
            code: 'function f(){ switch (x){ case z:       break y   }}',
          });

          test.pass('labeled nested', {
            code: 'function f(){ switch (x){ case z:       if (x) break y   }}',
          });
        });

        describe('arrow', _ => {

          test.pass('plain', {
            code: '() => { switch (x){ case z:       break    }}',
          });

          test.pass('nested', {
            code: '() => { switch (x){ case z:       if (x) break   }}',
          });

          test.pass('labeled', {
            code: '() => { switch (x){ case z:       break y   }}',
          });

          test.pass('labeled nested', {
            code: '() => { switch (x){ case z:       if (x) break y   }}',
          });
        });
      });

      describe('for', _ => {

        describe('global', _ => {

          test.pass('plain', {
            code: 'for (;;)    break   }',
          });

          test.pass('block', {
            code: 'for (;;)    { break }   }',
          });

          test.pass('nested', {
            code: 'for (;;)    if (x) break   }',
          });

          test.pass('labeled', {
            code: 'for (;;)    break y   }',
          });

          test.pass('labeled nested', {
            code: 'for (;;)    if (x) break y   }',
          });
        });

        describe('function', _ => {

          test.pass('plain', {
            code: 'function f(){ for (;;)       break    }}',
          });

          test.pass('block', {
            code: 'function f(){ for (;;)       { break }    }}',
          });

          test.pass('nested', {
            code: 'function f(){ for (;;)       if (x) break   }}',
          });

          test.pass('labeled', {
            code: 'function f(){ for (;;)       break y   }}',
          });

          test.pass('labeled nested', {
            code: 'function f(){ for (;;)       if (x) break y   }}',
          });
        });

        describe('arrow', _ => {

          test.pass('plain', {
            code: '() => { for (;;)       break    }}',
          });

          test.pass('block', {
            code: '() => { for (;;)       { break }    }}',
          });

          test.pass('nested', {
            code: '() => { for (;;)       if (x) break   }}',
          });

          test.pass('labeled', {
            code: '() => { for (;;)       break y   }}',
          });

          test.pass('labeled nested', {
            code: '() => { for (;;)       if (x) break y   }}',
          });
        });
      });

      describe('while', _ => {

        describe('global', _ => {

          test.pass('plain', {
            code: 'while (true)    break   }',
          });

          test.pass('block', {
            code: 'while (true)    { break }   }',
          });

          test.pass('nested', {
            code: 'while (true)    if (x) break   }',
          });

          test.pass('labeled', {
            code: 'while (true)    break y   }',
          });

          test.pass('labeled nested', {
            code: 'while (true)    if (x) break y   }',
          });
        });

        describe('function', _ => {

          test.pass('plain', {
            code: 'function f(){ while (true)       break    }}',
          });

          test.pass('block', {
            code: 'function f(){ while (true)       { break }    }}',
          });

          test.pass('nested', {
            code: 'function f(){ while (true)       if (x) break   }}',
          });

          test.pass('labeled', {
            code: 'function f(){ while (true)       break y   }}',
          });

          test.pass('labeled nested', {
            code: 'function f(){ while (true)       if (x) break y   }}',
          });
        });

        describe('arrow', _ => {

          test.pass('plain', {
            code: '() => { while (true)       break    }}',
          });

          test.pass('block', {
            code: '() => { while (true)       { break }    }}',
          });

          test.pass('nested', {
            code: '() => { while (true)       if (x) break   }}',
          });

          test.pass('labeled', {
            code: '() => { while (true)       break y   }}',
          });

          test.pass('labeled nested', {
            code: '() => { while (true)       if (x) break y   }}',
          });
        });
      });

      describe('do-while', _ => {

        describe('global', _ => {

          test.pass('plain', {
            code: 'do     break   ; while(true);',
          });

          test.pass('block', {
            code: 'do     {break}    while(true);',
          });

          test.pass('nested', {
            code: 'do     if (x) break   ; while(true);',
          });

          test.pass('labeled', {
            code: 'do     break y   ; while(true);',
          });

          test.pass('labeled nested', {
            code: 'do     if (x) break y   ; while(true);',
          });
        });

        describe('function', _ => {

          test.pass('plain', {
            code: 'function f(){ do        break    ; while(true);}',
          });

          test.pass('block', {
            code: 'function f(){ do        { break }     while(true);}',
          });

          test.pass('nested', {
            code: 'function f(){ do        if (x) break   ; while(true);}',
          });

          test.pass('labeled', {
            code: 'function f(){ do        break y   ; while(true);}',
          });

          test.pass('labeled nested', {
            code: 'function f(){ do        if (x) break y   ; while(true);}',
          });
        });

        describe('arrow', _ => {

          test.pass('plain', {
            code: '() => { do        break    ; while(true);}',
          });

          test.pass('block', {
            code: '() => { do        { break }     while(true);}',
          });

          test.pass('nested', {
            code: '() => { do        if (x) break   ; while(true);}',
          });

          test.pass('labeled', {
            code: '() => { do        break y   ; while(true);}',
          });

          test.pass('labeled nested', {
            code: '() => { do        if (x) break y   ; while(true);}',
          });
        });
      });
    });
  });

// break sans loop (with label)
