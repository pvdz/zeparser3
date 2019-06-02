/** @format */
import {$ASI, $IDENT, $PUNCTUATOR} from '../../../src/zetokenizer.mjs';
export default (describe, test) =>
  describe('break statement', _ => {
    describe('in a switch', _ => {
      test('break without label inside a case', {
        code: 'switch (x) { case x: break; }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'SwitchStatement',
              discriminant: {
                type: 'Identifier',
                name: 'x',
              },
              cases: [
                {
                  type: 'SwitchCase',
                  test: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  consequent: [
                    {
                      type: 'BreakStatement',
                      label: null,
                    },
                  ],
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
              discriminant: {
                type: 'Identifier',
                name: 'x',
              },
              cases: [
                {
                  type: 'SwitchCase',
                  test: null,
                  consequent: [
                    {
                      type: 'BreakStatement',
                      label: null,
                    },
                  ],
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
              discriminant: {
                type: 'Identifier',
                name: 'x',
              },
              cases: [
                {
                  type: 'SwitchCase',
                  test: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  consequent: [
                    {
                      type: 'IfStatement',
                      test: {
                        type: 'Identifier',
                        name: 'foo',
                      },
                      consequent: {
                        type: 'BreakStatement',
                        label: null,
                      },
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
              discriminant: {
                type: 'Identifier',
                name: 'x',
              },
              cases: [
                {
                  type: 'SwitchCase',
                  test: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  consequent: [
                    {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'BreakStatement',
                          label: null,
                        },
                      ],
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
        code: 'foo: switch (x) { case x: break foo; }',
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
                type: 'SwitchStatement',
                discriminant: {
                  type: 'Identifier',
                  name: 'x',
                },
                cases: [
                  {
                    type: 'SwitchCase',
                    test: {
                      type: 'Identifier',
                      name: 'x',
                    },
                    consequent: [
                      {
                        type: 'BreakStatement',
                        label: {
                          type: 'Identifier',
                          name: 'foo',
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('break with label inside a default', {
        code: 'foo: switch (x) { default: break foo; }',
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
                type: 'SwitchStatement',
                discriminant: {
                  type: 'Identifier',
                  name: 'x',
                },
                cases: [
                  {
                    type: 'SwitchCase',
                    test: null,
                    consequent: [
                      {
                        type: 'BreakStatement',
                        label: {
                          type: 'Identifier',
                          name: 'foo',
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('break with label inside a switch nested block', {
        code: 'foo: switch (x) { case x: if (foo) {break foo;} }',
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
                type: 'SwitchStatement',
                discriminant: {
                  type: 'Identifier',
                  name: 'x',
                },
                cases: [
                  {
                    type: 'SwitchCase',
                    test: {
                      type: 'Identifier',
                      name: 'x',
                    },
                    consequent: [
                      {
                        type: 'IfStatement',
                        test: {
                          type: 'Identifier',
                          name: 'foo',
                        },
                        consequent: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'BreakStatement',
                              label: {
                                type: 'Identifier',
                                name: 'foo',
                              },
                            },
                          ],
                        },
                        alternate: null,
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('break with label inside a switch nested if', {
        code: 'foo: switch (x) { case x: if (foo) break foo; }',
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
                type: 'SwitchStatement',
                discriminant: {
                  type: 'Identifier',
                  name: 'x',
                },
                cases: [
                  {
                    type: 'SwitchCase',
                    test: {
                      type: 'Identifier',
                      name: 'x',
                    },
                    consequent: [
                      {
                        type: 'IfStatement',
                        test: {
                          type: 'Identifier',
                          name: 'foo',
                        },
                        consequent: {
                          type: 'BreakStatement',
                          label: {
                            type: 'Identifier',
                            name: 'foo',
                          },
                        },
                        alternate: null,
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
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
              body: {
                type: 'BreakStatement',
                label: null,
              },
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
              left: {
                type: 'Identifier',
                name: 'x',
              },
              right: {
                type: 'Identifier',
                name: 'y',
              },
              body: {
                type: 'BreakStatement',
                label: null,
              },
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
              left: {
                type: 'Identifier',
                name: 'x',
              },
              right: {
                type: 'Identifier',
                name: 'y',
              },
              await: false,
              body: {
                type: 'BreakStatement',
                label: null,
              },
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
              test: {
                type: 'Identifier',
                name: 'x',
              },
              body: {
                type: 'BreakStatement',
                label: null,
              },
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
              body: {
                type: 'BreakStatement',
                label: null,
              },
              test: {
                type: 'Identifier',
                name: 'foo',
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
      test('break with label inside a for-loop', {
        code: 'foo: for (;;) break foo',
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
                type: 'ForStatement',
                init: null,
                test: null,
                update: null,
                body: {
                  type: 'BreakStatement',
                  label: {
                    type: 'Identifier',
                    name: 'foo',
                  },
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });
      test('break with label inside a for-in', {
        code: 'foo: for (x in y) break foo',
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
                type: 'ForInStatement',
                left: {
                  type: 'Identifier',
                  name: 'x',
                },
                right: {
                  type: 'Identifier',
                  name: 'y',
                },
                body: {
                  type: 'BreakStatement',
                  label: {
                    type: 'Identifier',
                    name: 'foo',
                  },
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });
      test('break with label inside a for-of', {
        code: 'foo: for (x of y) break foo',
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
                type: 'ForOfStatement',
                left: {
                  type: 'Identifier',
                  name: 'x',
                },
                right: {
                  type: 'Identifier',
                  name: 'y',
                },
                await: false,
                body: {
                  type: 'BreakStatement',
                  label: {
                    type: 'Identifier',
                    name: 'foo',
                  },
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });
      test('break with label inside a while', {
        code: 'foo: while (x) break foo',
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
                type: 'WhileStatement',
                test: {
                  type: 'Identifier',
                  name: 'x',
                },
                body: {
                  type: 'BreakStatement',
                  label: {
                    type: 'Identifier',
                    name: 'foo',
                  },
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });
      test('break with label inside a do-while', {
        code: 'foo: do break foo; while(foo);',
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
                type: 'DoWhileStatement',
                body: {
                  type: 'BreakStatement',
                  label: {
                    type: 'Identifier',
                    name: 'foo',
                  },
                },
                test: {
                  type: 'Identifier',
                  name: 'foo',
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
    });
    test.fail('break at eof (without label, with semi)', {
      code: 'break;',
    });
    test.fail('break at eof (without label, without semi)', {
      code: 'break',
    });
    test('break at eof (with label, with semi)', {
      code: 'foo: break foo;',
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
              type: 'BreakStatement',
              label: {
                type: 'Identifier',
                name: 'foo',
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR],
    });
    test('break at eof (with label, without semi)', {
      code: 'foo: break foo',
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
              type: 'BreakStatement',
              label: {
                type: 'Identifier',
                name: 'foo',
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
    });
    test.fail('double break', {
      code: 'break; break;',
    });
    test.fail('double break with asi', {
      code: 'break\nbreak;',
    });
    test.fail('double break with label and semi', {
      code: 'foo: break foo;break;',
    });
    test.fail('double break with label and asi', {
      code: 'foo: break foo\nbreak;',
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
          test.fail('labeled', {
            code: 'function f(){    break y   }',
          });
          test.fail('labeled nested', {
            code: 'function f(){    if (x) break y   }',
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
          test.fail('labeled', {
            code: '() => {    break y   }',
          });
          test.fail('labeled nested', {
            code: '() => {    if (x) break y   }',
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
          test.fail('labeled', {
            code: 'switch (x){ case z:    break y   }',
          });
          test.fail('labeled nested', {
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
          test.fail('labeled', {
            code: 'function f(){ switch (x){ case z:       break y   }}',
          });
          test.fail('labeled nested', {
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
          test.fail('labeled', {
            code: '() => { switch (x){ case z:       break y   }}',
          });
          test.fail('labeled nested', {
            code: '() => { switch (x){ case z:       if (x) break y   }}',
          });
        });
      });
      describe('for', _ => {
        describe('global', _ => {
          test.pass('plain', {
            code: 'for (;;)    break',
          });
          test.pass('block', {
            code: 'for (;;)    { break }',
          });
          test.pass('nested', {
            code: 'for (;;)    if (x) break',
          });
          test.fail('labeled', {
            code: 'for (;;)    break y',
          });
          test.fail('labeled nested', {
            code: 'for (;;)    if (x) break y',
          });
        });
        describe('function', _ => {
          test.pass('plain', {
            code: 'function f(){ for (;;)       break    }',
          });
          test.pass('block', {
            code: 'function f(){ for (;;)       { break }    }',
          });
          test.pass('nested', {
            code: 'function f(){ for (;;)       if (x) break   }',
          });
          test.fail('labeled', {
            code: 'function f(){ for (;;)       break y   }',
          });
          test.fail('labeled nested', {
            code: 'function f(){ for (;;)       if (x) break y   }',
          });
        });
        describe('arrow', _ => {
          test.pass('plain', {
            code: '() => { for (;;)       break    }',
          });
          test.pass('block', {
            code: '() => { for (;;)       { break }    }',
          });
          test.pass('nested', {
            code: '() => { for (;;)       if (x) break   }',
          });
          test.fail('labeled', {
            code: '() => { for (;;)       break y   }',
          });
          test.fail('labeled nested', {
            code: '() => { for (;;)       if (x) break y   }',
          });
        });
      });
      describe('while', _ => {
        describe('global', _ => {
          test.pass('plain', {
            code: 'while (true)    break',
          });
          test.pass('block', {
            code: 'while (true)    { break }',
          });
          test.pass('nested', {
            code: 'while (true)    if (x) break',
          });
          test.fail('labeled', {
            code: 'while (true)    break y',
          });
          test.fail('labeled nested', {
            code: 'while (true)    if (x) break y',
          });
        });
        describe('function', _ => {
          test.pass('plain', {
            code: 'function f(){ while (true)       break    }',
          });
          test.pass('block', {
            code: 'function f(){ while (true)       { break }    }',
          });
          test.pass('nested', {
            code: 'function f(){ while (true)       if (x) break   }',
          });
          test.fail('labeled', {
            code: 'function f(){ while (true)       break y   }',
          });
          test.fail('labeled nested', {
            code: 'function f(){ while (true)       if (x) break y   }',
          });
        });
        describe('arrow', _ => {
          test.pass('plain', {
            code: '() => { while (true)       break    }',
          });
          test.pass('block', {
            code: '() => { while (true)       { break }    }',
          });
          test.pass('nested', {
            code: '() => { while (true)       if (x) break   }',
          });
          test.fail('labeled', {
            code: '() => { while (true)       break y   }',
          });
          test.fail('labeled nested', {
            code: '() => { while (true)       if (x) break y   }',
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
          test.fail('labeled', {
            code: 'do     break y   ; while(true);',
          });
          test.fail('labeled nested', {
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
          test.fail('labeled', {
            code: 'function f(){ do        break y   ; while(true);}',
          });
          test.fail('labeled nested', {
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
          test.fail('labeled', {
            code: '() => { do        break y   ; while(true);}',
          });
          test.fail('labeled nested', {
            code: '() => { do        if (x) break y   ; while(true);}',
          });
        });
      });
    });
    describe('labels', _ => {
      test.pass('break to label in while', {
        code: 'foo: while(true)break foo;',
      });
      test.pass('break to label in do', {
        code: 'foo: do break foo; while(true)',
      });
      test.pass('break to label in for-loop', {
        code: 'foo: for (;;) break foo;',
      });
      test.pass('break to label in for-in', {
        code: 'foo: for (x in y) break foo;',
      });
      test.pass('break to label in for-of', {
        code: 'foo: for (x of y) break foo;',
      });
      test.pass('break to label in for-await', {
        code: 'async function f(){ foo: for await (x of y) break foo; }',
      });
      test.pass('break to label in nested if', {
        code: 'foo: while (true) if (x) break foo;',
      });
      test.pass('break to label in nested else', {
        code: 'foo: while (true) if (x); else break foo;',
      });
      test.pass('break to label in nested if block', {
        code: 'foo: while (true) if (x) { break foo; }',
      });
      test.pass('break to label in nested block', {
        code: 'foo: while (true) { break foo; }',
      });
      test.pass('break to label in nested block-if', {
        code: 'foo: while (true) { if (x) break foo; }',
      });
      test.pass('break to label in nested while', {
        code: 'foo: while (true) while (x) break foo;',
      });
      test.pass('break to nested inner label', {
        code: 'bar: foo: while (true) break foo;',
      });
      test.pass('break to nested outer label', {
        code: 'foo: bar: while (true) break foo;',
      });
      test.pass('break to nested middle label', {
        code: 'ding: foo: bar: while (true) break foo;',
      });
      test('break with non-existing label', {
        code: 'break x;',
        throws: 'not defined',
      });
      test('break with label not defined in current statement sub-tree', {
        code: 'x: foo; break x;',
        throws: 'not defined',
      });
    });
  });
