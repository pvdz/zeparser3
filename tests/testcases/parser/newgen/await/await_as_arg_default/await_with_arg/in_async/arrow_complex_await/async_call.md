# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/await/await_as_arg_default/await_with_arg/in_async/arrow_complex_await/async_call.md

> :: await : await as arg default : await with arg : in async : arrow, complex await
>
> ::> async call

## Input

`````js
async function a(){     async (foo = [{m: 5 + t(await bar)}]);     }
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
ast: {
  type: 'Program',
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 68 } },
  body: [
    {
      type: 'FunctionDeclaration',
      loc: {
        start: { line: 1, col: 6 },
        end: { line: 1, col: 68 },
        source: ''
      },
      generator: false,
      async: true,
      id: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 15 },
          end: { line: 1, col: 15 },
          source: ''
        },
        name: 'a'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc: {
          start: { line: 1, col: 18 },
          end: { line: 1, col: 68 },
          source: ''
        },
        body: [
          {
            type: 'ExpressionStatement',
            loc: {
              start: { line: 1, col: 24 },
              end: { line: 1, col: 67 },
              source: ''
            },
            expression: {
              type: 'CallExpression',
              loc: {
                start: { line: 1, col: 24 },
                end: { line: 1, col: 61 },
                source: ''
              },
              callee: {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 24 },
                  end: { line: 1, col: 61 },
                  source: ''
                },
                name: 'async'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  loc: {
                    start: { line: 1, col: 31 },
                    end: { line: 1, col: 60 },
                    source: ''
                  },
                  left: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 31 },
                      end: { line: 1, col: 35 },
                      source: ''
                    },
                    name: 'foo'
                  },
                  operator: '=',
                  right: {
                    type: 'ArrayExpression',
                    loc: {
                      start: { line: 1, col: 37 },
                      end: { line: 1, col: 60 },
                      source: ''
                    },
                    elements: [
                      {
                        type: 'ObjectExpression',
                        loc: {
                          start: { line: 1, col: 38 },
                          end: { line: 1, col: 59 },
                          source: ''
                        },
                        properties: [
                          {
                            type: 'Property',
                            loc: {
                              start: { line: 1, col: 39 },
                              end: { line: 1, col: 58 },
                              source: ''
                            },
                            key: {
                              type: 'Identifier',
                              loc: {
                                start: { line: 1, col: 39 },
                                end: { line: 1, col: 42 },
                                source: ''
                              },
                              name: 'm'
                            },
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {
                              type: 'BinaryExpression',
                              loc: {
                                start: { line: 1, col: 42 },
                                end: { line: 1, col: 58 },
                                source: ''
                              },
                              left: {
                                type: 'Literal',
                                loc: {
                                  start: { line: 1, col: 42 },
                                  end: { line: 1, col: 42 },
                                  source: ''
                                },
                                value: 5,
                                raw: '5'
                              },
                              operator: '+',
                              right: {
                                type: 'CallExpression',
                                loc: {
                                  start: { line: 1, col: 46 },
                                  end: { line: 1, col: 58 },
                                  source: ''
                                },
                                callee: {
                                  type: 'Identifier',
                                  loc: {
                                    start: { line: 1, col: 46 },
                                    end: { line: 1, col: 47 },
                                    source: ''
                                  },
                                  name: 't'
                                },
                                arguments: [
                                  {
                                    type: 'AwaitExpression',
                                    loc: {
                                      start: { line: 1, col: 48 },
                                      end: { line: 1, col: 57 },
                                      source: ''
                                    },
                                    argument: {
                                      type: 'Identifier',
                                      loc: {
                                        start: { line: 1, col: 54 },
                                        end: { line: 1, col: 57 },
                                        source: ''
                                      },
                                      name: 'bar'
                                    }
                                  }
                                ]
                              }
                            },
                            shorthand: false
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
}

tokens (27x):
       IDENT IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR NUMBER_DEC PUNCTUATOR IDENT PUNCTUATOR IDENT IDENT
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

_Output same as sloppy mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._