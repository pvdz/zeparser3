# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/tests_related_to_bindings/functions/rebinding_func_name/autogen.md
- Path: zeparser3/tests/testcases/parser/tests_related_to_bindings/functions/rebinding_func_name/gen/Plain_method

> :: test: Plain method
>
> :: case: var

## Input


`````js
x = {f(){ var f = 1 }}
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
  loc:{start:{line:1,col:0},end:{line:1,col:22},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:22},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,col:0},end:{line:1,col:22},source:''},
        left: {
          type: 'Identifier',
          loc:{start:{line:1,col:0},end:{line:1,col:2},source:''},
          name: 'x'
        },
        operator: '=',
        right: {
          type: 'ObjectExpression',
          loc:{start:{line:1,col:4},end:{line:1,col:22},source:''},
          properties: [
            {
              type: 'Property',
              loc:{start:{line:1,col:5},end:{line:1,col:21},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:1,col:5},end:{line:1,col:6},source:''},
                name: 'f'
              },
              kind: 'init',
              method: true,
              computed: false,
              value: {
                type: 'FunctionExpression',
                loc:{start:{line:1,col:5},end:{line:1,col:21},source:''},
                generator: false,
                async: false,
                id: null,
                params: [],
                body: {
                  type: 'BlockStatement',
                  loc:{start:{line:1,col:8},end:{line:1,col:21},source:''},
                  body: [
                    {
                      type: 'VariableDeclaration',
                      loc:{start:{line:1,col:14},end:{line:1,col:20},source:''},
                      kind: 'var',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          loc:{start:{line:1,col:14},end:{line:1,col:20},source:''},
                          id: {
                            type: 'Identifier',
                            loc:{start:{line:1,col:14},end:{line:1,col:14},source:''},
                            name: 'f'
                          },
                          init: {
                            type: 'Literal',
                            loc:{start:{line:1,col:18},end:{line:1,col:18},source:''},
                            value: 1,
                            raw: '1'
                          }
                        }
                      ]
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

tokens (16x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR IDENT IDENT PUNCTUATOR NUMBER_DEC ASI PUNCTUATOR
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