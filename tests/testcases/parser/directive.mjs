import {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $STRING_DOUBLE, $STRING_SINGLE, $TICK_HEAD, $TICK_TAIL} from '../../../src/zetokenizer';

export default (describe, test) =>
  describe('directive prologues', _ => {

    describe('default expression statement behavior', _ => {

      describe('global', _ => {
        test('single directive single string', {
          code: "'foo';",
          ast: {
            type: 'Program',
            body: [{
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: "'foo'"},
              directive: 'foo',
            }],
          },
          tokens: [$STRING_SINGLE, $PUNCTUATOR],
        });

        test('single directive double string', {
          code: '"foo";',
          ast: {
            type: 'Program',
            body: [{
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
              directive: 'foo',
            }],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR],
        });

        test('single directive without semi, eof', {
          code: '"foo"',
          ast: {
            type: 'Program',
            body: [{
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
              directive: 'foo',
            }],
          },
          tokens: [$STRING_DOUBLE, $ASI],
        });

        test('single directive without semi, asi', {
          code: '"foo"\nx',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                directive: 'foo',
              },
              {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'x'},
              },
            ],
          },
          tokens: [$STRING_DOUBLE, $ASI, $IDENT, $ASI],
        });

        test('multi directive on same line', {
          code: '"foo";"bar";',
          ast: {
            type: 'Program',
            body: [{
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
              directive: 'foo',
            }, {
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
              directive: 'bar',
            }],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR],
        });

        test('multi directive on same line sans semi', {
          code: '"foo" "bar"',
          throws: true,
        });

        test('multi directive on own line', {
          code: '"foo";\n"bar";',
          ast: {
            type: 'Program',
            body: [{
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
              directive: 'foo',
            }, {
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
              directive: 'bar',
            }],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR],
        });

        test('multi directive on own line', {
          code: "'foo';\n'bar';",
          ast: {
            type: 'Program',
            body: [{
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: "'foo'"},
              directive: 'foo',
            }, {
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: "'bar'"},
              directive: 'bar',
            }],
          },
          tokens: [$STRING_SINGLE, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR],
        });

        test('multi directive mixed quotes single first', {
          code: '\'foo\';\n"bar";',
          ast: {
            type: 'Program',
            body: [{
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: "'foo'"},
              directive: 'foo',
            }, {
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
              directive: 'bar',
            }],
          },
          tokens: [$STRING_SINGLE, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR],
        });

        test('multi directive mixed quotes single last', {
          code: '"foo";\n\'bar\';',
          ast: {
            type: 'Program',
            body: [{
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
              directive: 'foo',
            }, {
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: "'bar'"},
              directive: 'bar',
            }],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR],
        });

        test('multi directive with single comment', {
          code: '"foo"\n// stuff here\n"bar";',
          ast: {
            type: 'Program',
            body: [{
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
              directive: 'foo',
            }, {
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
              directive: 'bar',
            }],
          },
          tokens: [$STRING_DOUBLE, $ASI, $STRING_DOUBLE, $PUNCTUATOR],
        });

        test('multi directive with multi comment sans asi', {
          code: '"foo";/*abc\nxyz*/"bar";',
          ast: {
            type: 'Program',
            body: [{
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
              directive: 'foo',
            }, {
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
              directive: 'bar',
            }],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR],
        });

        test('multi directive with multi comment causing asi', {
          code: '"foo"/*abc\nxyz*/"bar";',
          ast: {
            type: 'Program',
            body: [{
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
              directive: 'foo',
            }, {
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
              directive: 'bar',
            }],
          },
          tokens: [$STRING_DOUBLE, $ASI, $STRING_DOUBLE, $PUNCTUATOR],
        });

        test('not a directive if a binary op follows it', {
          code: '"ignore me" + x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  left: {type: 'Literal', value: '<TODO>', raw: '"ignore me"'},
                  operator: '+',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('should not over-aggressively apply ASI', {
          code: '"ignore me"\n+ x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  left: {type: 'Literal', value: '<TODO>', raw: '"ignore me"'},
                  operator: '+',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('should expect a div', {
          code: '"ignore me"\n/x/g',
          desc: 'div on statement start is never a regex so this is the division (string/x)/g',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {type: 'Literal', value: '<TODO>', raw: '"ignore me"'},
                    operator: '/',
                    right: {type: 'Identifier', name: 'x'},
                  },
                  operator: '/',
                  right: {type: 'Identifier', name: 'g'},
                },
              },
            ],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI], // NOT regex!
        });

        test('postfix ++ on string is still and always an error', {
          code: '"ignore me"++',
          throws: true,
        });

        test('apply ++ asi properly and add a directive', {
          code: '"ignore me"\n++x',
          desc: 'the ++ is a restricted production and so the string is a directive',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {type: 'Literal', value: '<TODO>', raw: '"ignore me"'},
                directive: 'ignore me',
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$STRING_DOUBLE, $ASI, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('assignment to string is still and always an error', {
          code: '"ignore me" = x',
          throws: true,
        });

        test('end of body can be valid asi', {
          code: 'function f(){ "use strict" }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                    directive: 'use strict',
                  }],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $ASI, $PUNCTUATOR],
        });
      });

      describe('regular function', _ => {
        test('single directive single string', {
          code: "function f(){\n'foo';\n}",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: "'foo'"},
                    directive: 'foo',
                  }],
                },
              },
            ],
          },
          tokens: true,
        });

        test('single directive double string', {
          code: 'function f(){\n"foo";\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                    directive: 'foo',
                  }],
                },
              },
            ],
          },
          tokens: true,
        });

        test('single directive without semi, eof', {
          code: 'function f(){\n"foo"\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                    directive: 'foo',
                  }],
                },
              },
            ],
          },
          tokens: true,
        });

        test('single directive without semi, asi', {
          code: 'function f(){\n"foo"\nx\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                      directive: 'foo',
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: true,
        });

        test('multi directive on same line', {
          code: 'function f(){\n"foo";"bar";\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                    directive: 'foo',
                  }, {
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
                    directive: 'bar',
                  }],
                },
              },
            ],
          },
          tokens: true,
        });

        test('multi directive on same line sans semi', {
          code: 'function f(){\n"foo" "bar"',
          throws: true,
        });

        test('multi directive on own line', {
          code: 'function f(){\n"foo";\n"bar";\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                    directive: 'foo',
                  }, {
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
                    directive: 'bar',
                  }],
                },
              },
            ],
          },
          tokens: true,
        });

        test('multi directive on own line', {
          code: "function f(){\n'foo';\n'bar';\n}",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: "'foo'"},
                    directive: 'foo',
                  }, {
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: "'bar'"},
                    directive: 'bar',
                  }],
                },
              },
            ],
          },
          tokens: true,
        });

        test('multi directive mixed quotes single first', {
          code: 'function f(){\n\'foo\';\n"bar";\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: "'foo'"},
                    directive: 'foo',
                  }, {
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
                    directive: 'bar',
                  }],
                },
              },
            ],
          },
          tokens: true,
        });

        test('multi directive mixed quotes single last', {
          code: 'function f(){\n"foo";\n\'bar\';\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                    directive: 'foo',
                  }, {
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: "'bar'"},
                    directive: 'bar',
                  }],
                },
              },
            ],
          },
          tokens: true,
        });

        test('multi directive with single comment', {
          code: 'function f(){\n"foo"\n// stuff here\n"bar";\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                    directive: 'foo',
                  }, {
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
                    directive: 'bar',
                  }],
                },
              },
            ],
          },
          tokens: true,
        });

        test('multi directive with multi comment sans asi', {
          code: 'function f(){\n"foo";/*abc\nxyz*/"bar";\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                    directive: 'foo',
                  }, {
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
                    directive: 'bar',
                  }],
                },
              },
            ],
          },
          tokens: true,
        });

        test('multi directive with multi comment causing asi', {
          code: 'function f(){\n"foo"/*abc\nxyz*/"bar";\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                    directive: 'foo',
                  }, {
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
                    directive: 'bar',
                  }],
                },
              },
            ],
          },
          tokens: true,
        });
      });

      describe('function variations', _ => {
        // check other function variations once, to confirm the Delaration shows up at all
        // since they all use the same body parsing logic we dont need to repeat all tests in perpetuity

        test('check node with paren-less arrow', {
          code: 'x => { "use strict"; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'x'}],
                  id: null,
                  generator: false,
                  async: false,
                  expression: false,
                  body: {
                    type: 'BlockStatement',
                    body: [{
                      type: 'ExpressionStatement',
                      expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                      directive: 'use strict',
                    }],
                  },
                },
              },
            ],
          },
          tokens: true,
        });

        test('check node with parened arrow', {
          code: '() => { "use strict"; }',
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
                    body: [{
                      type: 'ExpressionStatement',
                      expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                      directive: 'use strict',
                    }],
                  },
                },
              },
            ],
          },
          tokens: true,
        });

        test('check node with async arrow', {
          code: 'async x => { "use strict"; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'x'}],
                  id: null,
                  generator: false,
                  async: true,
                  expression: false,
                  body: {
                    type: 'BlockStatement',
                    body: [{
                      type: 'ExpressionStatement',
                      expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                      directive: 'use strict',
                    }],
                  },
                },
              },
            ],
          },
          tokens: true,
        });

        test('check node with asyc function', {
          code: 'async function f() { "use strict"; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: true,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                    directive: 'use strict',
                  }],
                },
              },
            ],
          },
          tokens: true,
        });

        test('check node with generator function', {
          code: 'function* f() { "use strict"; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: true,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '"use strict"'},
                    directive: 'use strict',
                  }],
                },
              },
            ],
          },
          tokens: true,
        });
      });
    });

    describe('into Directive node', _ => {

      describe('global', _ => {
        test('single directive single string', {
          code: "'foo';",
          ast: {
            type: 'Program',
            body: [{type: 'Directive', directive: 'foo'}],
          },
          tokens: [$STRING_SINGLE, $PUNCTUATOR],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('single directive double string', {
          code: '"foo";',
          ast: {
            type: 'Program',
            body: [{type: 'Directive', directive: 'foo'}],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('single directive without semi, eof', {
          code: '"foo"',
          ast: {
            type: 'Program',
            body: [{type: 'Directive', directive: 'foo'}],
          },
          tokens: [$STRING_DOUBLE, $ASI],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('single directive without semi, asi', {
          code: '"foo"\nx',
          ast: {
            type: 'Program',
            body: [
              {type: 'Directive', directive: 'foo'},
              {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'x'},
              },
            ],
          },
          tokens: [$STRING_DOUBLE, $ASI, $IDENT, $ASI],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive on same line', {
          code: '"foo";"bar";',
          ast: {
            type: 'Program',
            body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive on same line sans semi', {
          code: '"foo" "bar"',
          throws: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive on own line', {
          code: '"foo";\n"bar";',
          ast: {
            type: 'Program',
            body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive on own line', {
          code: "'foo';\n'bar';",
          ast: {
            type: 'Program',
            body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
          },
          tokens: [$STRING_SINGLE, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive mixed quotes single first', {
          code: '\'foo\';\n"bar";',
          ast: {
            type: 'Program',
            body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
          },
          tokens: [$STRING_SINGLE, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive mixed quotes single last', {
          code: '"foo";\n\'bar\';',
          ast: {
            type: 'Program',
            body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive with single comment', {
          code: '"foo"\n// stuff here\n"bar";',
          ast: {
            type: 'Program',
            body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
          },
          tokens: [$STRING_DOUBLE, $ASI, $STRING_DOUBLE, $PUNCTUATOR],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive with multi comment sans asi', {
          code: '"foo";/*abc\nxyz*/"bar";',
          ast: {
            type: 'Program',
            body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive with multi comment causing asi', {
          code: '"foo"/*abc\nxyz*/"bar";',
          ast: {
            type: 'Program',
            body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
          },
          tokens: [$STRING_DOUBLE, $ASI, $STRING_DOUBLE, $PUNCTUATOR],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('not a directive if a binary op follows it', {
          code: '"ignore me" + x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  left: {type: 'Literal', value: '<TODO>', raw: '"ignore me"'},
                  operator: '+',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR, $IDENT, $ASI],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('should not over-aggressively apply ASI', {
          code: '"ignore me"\n+ x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  left: {type: 'Literal', value: '<TODO>', raw: '"ignore me"'},
                  operator: '+',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR, $IDENT, $ASI],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('should expect a div', {
          code: '"ignore me"\n/x/g',
          desc: 'div on statement start is never a regex so this is the division (string/x)/g',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {type: 'Literal', value: '<TODO>', raw: '"ignore me"'},
                    operator: '/',
                    right: {type: 'Identifier', name: 'x'},
                  },
                  operator: '/',
                  right: {type: 'Identifier', name: 'g'},
                },
              },
            ],
          },
          tokens: [$STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI], // NOT regex!
          OPTIONS: {AST_directiveNodes: true},
        });

        test('postfix ++ on string is still and always an error', {
          code: '"ignore me"++',
          throws: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('apply ++ asi properly and add a directive', {
          code: '"ignore me"\n++x',
          desc: 'the ++ is a restricted production and so the string is a directive',
          ast: {
            type: 'Program',
            body: [
              {type: 'Directive', directive: 'ignore me'},
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$STRING_DOUBLE, $ASI, $PUNCTUATOR, $IDENT, $ASI],
          OPTIONS: {AST_directiveNodes: true},
        });

        test('assignment to string is still and always an error', {
          code: '"ignore me" = x',
          throws: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('end of body can be valid asi', {
          code: 'function f(){ "use strict" }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'use strict'}],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $ASI, $PUNCTUATOR],
          OPTIONS: {AST_directiveNodes: true},
        });
      });

      describe('regular function', _ => {
        test('single directive single string', {
          code: "function f(){\n'foo';\n}",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'foo'}],
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('single directive double string', {
          code: 'function f(){\n"foo";\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'foo'}],
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('single directive without semi, eof', {
          code: 'function f(){\n"foo"\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'foo'}],
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('single directive without semi, asi', {
          code: 'function f(){\n"foo"\nx\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {type: 'Directive', directive: 'foo'},
                    {
                      type: 'ExpressionStatement',
                      expression: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive on same line', {
          code: 'function f(){\n"foo";"bar";\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive on same line sans semi', {
          code: 'function f(){\n"foo" "bar"',
          throws: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive on own line', {
          code: 'function f(){\n"foo";\n"bar";\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive on own line', {
          code: "function f(){\n'foo';\n'bar';\n}",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive mixed quotes single first', {
          code: 'function f(){\n\'foo\';\n"bar";\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive mixed quotes single last', {
          code: 'function f(){\n"foo";\n\'bar\';\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive with single comment', {
          code: 'function f(){\n"foo"\n// stuff here\n"bar";\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive with multi comment sans asi', {
          code: 'function f(){\n"foo";/*abc\nxyz*/"bar";\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('multi directive with multi comment causing asi', {
          code: 'function f(){\n"foo"/*abc\nxyz*/"bar";\n}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'foo'}, {type: 'Directive', directive: 'bar'}],
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });
      });

      describe('function variations', _ => {
        // check other function variations once, to confirm the Delaration shows up at all
        // since they all use the same body parsing logic we dont need to repeat all tests in perpetuity

        test('check node with paren-less arrow', {
          code: 'x => { "use strict"; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'x'}],
                  id: null,
                  generator: false,
                  async: false,
                  expression: false,
                  body: {
                    type: 'BlockStatement',
                    body: [{type: 'Directive', directive: 'use strict'}],
                  },
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('check node with parened arrow', {
          code: '() => { "use strict"; }',
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
                    body: [{type: 'Directive', directive: 'use strict'}],
                  },
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('check node with async arrow', {
          code: 'async x => { "use strict"; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'x'}],
                  id: null,
                  generator: false,
                  async: true,
                  expression: false,
                  body: {
                    type: 'BlockStatement',
                    body: [{type: 'Directive', directive: 'use strict'}],
                  },
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('check node with asyc function', {
          code: 'async function f() { "use strict"; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: true,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'use strict'}],
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });

        test('check node with generator function', {
          code: 'function* f() { "use strict"; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: true,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [{type: 'Directive', directive: 'use strict'}],
                },
              },
            ],
          },
          tokens: true,
          OPTIONS: {AST_directiveNodes: true},
        });
      });
    });
  });
