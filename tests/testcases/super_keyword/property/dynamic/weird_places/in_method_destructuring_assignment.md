# ZeParser parser test case

- Path: tests/testcases/super_keyword/property/dynamic/weird_places/in_method_destructuring_assignment.md

> :: super keyword : property : dynamic : weird places
>
> ::> in method destructuring assignment
## PASS

## Input

`````js
x = { foo(){ [a = super[foo]] = c; }}
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
  loc:{start:{line:1,column:0},end:{line:1,column:37},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:37},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,column:0},end:{line:1,column:37},source:''},
        left: {
          type: 'Identifier',
          loc:{start:{line:1,column:0},end:{line:1,column:1},source:''},
          name: 'x'
        },
        operator: '=',
        right: {
          type: 'ObjectExpression',
          loc:{start:{line:1,column:4},end:{line:1,column:37},source:''},
          properties: [
            {
              type: 'Property',
              loc:{start:{line:1,column:6},end:{line:1,column:36},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:1,column:6},end:{line:1,column:9},source:''},
                name: 'foo'
              },
              kind: 'init',
              method: true,
              computed: false,
              value: {
                type: 'FunctionExpression',
                loc:{start:{line:1,column:6},end:{line:1,column:36},source:''},
                generator: false,
                async: false,
                id: null,
                params: [],
                body: {
                  type: 'BlockStatement',
                  loc:{start:{line:1,column:11},end:{line:1,column:36},source:''},
                  body: [
                    {
                      type: 'ExpressionStatement',
                      loc:{start:{line:1,column:13},end:{line:1,column:34},source:''},
                      expression: {
                        type: 'AssignmentExpression',
                        loc:{start:{line:1,column:13},end:{line:1,column:33},source:''},
                        left: {
                          type: 'ArrayPattern',
                          loc:{start:{line:1,column:13},end:{line:1,column:29},source:''},
                          elements: [
                            {
                              type: 'AssignmentPattern',
                              loc:{start:{line:1,column:14},end:{line:1,column:28},source:''},
                              left: {
                                type: 'Identifier',
                                loc:{start:{line:1,column:14},end:{line:1,column:15},source:''},
                                name: 'a'
                              },
                              right: {
                                type: 'MemberExpression',
                                loc:{start:{line:1,column:18},end:{line:1,column:28},source:''},
                                object: {
                                  type: 'Super',
                                  loc:{start:{line:1,column:18},end:{line:1,column:23},source:''}
                                },
                                property: {
                                  type: 'Identifier',
                                  loc:{start:{line:1,column:24},end:{line:1,column:27},source:''},
                                  name: 'foo'
                                },
                                computed: true
                              }
                            }
                          ]
                        },
                        operator: '=',
                        right: {
                          type: 'Identifier',
                          loc:{start:{line:1,column:32},end:{line:1,column:33},source:''},
                          name: 'c'
                        }
                      }
                    }
                  ]
                }
              },
              shorthand: false
            }
          ]
        }
      }
    }
  ]
}

tokens (22x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
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

## AST Printer

Printer output different from input [sloppy]:

````js
((x = {foo(){(([a = super[foo],] = c));}}));
````

Produces same AST