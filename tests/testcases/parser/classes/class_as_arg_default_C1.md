# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/classes/class_as_arg_default_C1.md

> :: classes
>
> ::> class as arg default C1

## Input

`````js
f = ([xCls2 = class { name() {} }]) => {}
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 41 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 41 },
        source: ''
      },
      expression: {
        type: 'AssignmentExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 41 },
          source: ''
        },
        left: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 0 },
            end: { line: 1, col: 2 },
            source: ''
          },
          name: 'f'
        },
        operator: '=',
        right: {
          type: 'ArrowFunctionExpression',
          loc: {
            start: { line: 1, col: 4 },
            end: { line: 1, col: 41 },
            source: ''
          },
          params: [
            {
              type: 'ArrayPattern',
              loc: {
                start: { line: 1, col: 5 },
                end: { line: 1, col: 34 },
                source: ''
              },
              elements: [
                {
                  type: 'AssignmentPattern',
                  loc: {
                    start: { line: 1, col: 5 },
                    end: { line: 1, col: 33 },
                    source: ''
                  },
                  left: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 6 },
                      end: { line: 1, col: 12 },
                      source: ''
                    },
                    name: 'xCls2'
                  },
                  right: {
                    type: 'ClassExpression',
                    loc: {
                      start: { line: 1, col: 14 },
                      end: { line: 1, col: 33 },
                      source: ''
                    },
                    id: null,
                    superClass: null,
                    body: {
                      type: 'ClassBody',
                      loc: {
                        start: { line: 1, col: 20 },
                        end: { line: 1, col: 33 },
                        source: ''
                      },
                      body: [
                        {
                          type: 'MethodDefinition',
                          loc: {
                            start: { line: 1, col: 22 },
                            end: { line: 1, col: 32 },
                            source: ''
                          },
                          key: {
                            type: 'Identifier',
                            loc: {
                              start: { line: 1, col: 22 },
                              end: { line: 1, col: 26 },
                              source: ''
                            },
                            name: 'name'
                          },
                          static: false,
                          computed: false,
                          kind: 'method',
                          value: {
                            type: 'FunctionExpression',
                            loc: {
                              start: { line: 1, col: 22 },
                              end: { line: 1, col: 32 },
                              source: ''
                            },
                            generator: false,
                            async: false,
                            id: null,
                            params: [],
                            body: {
                              type: 'BlockStatement',
                              loc: {
                                start: { line: 1, col: 29 },
                                end: { line: 1, col: 32 },
                                source: ''
                              },
                              body: []
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          ],
          id: null,
          generator: false,
          async: false,
          expression: false,
          body: {
            type: 'BlockStatement',
            loc: {
              start: { line: 1, col: 39 },
              end: { line: 1, col: 41 },
              source: ''
            },
            body: []
          }
        }
      }
    }
  ]
}

tokens (21x):
       IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR ASI
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