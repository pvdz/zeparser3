# ZeParser parser autogenerated test case

- From: tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/autogen.md
- Path: tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Generator_func_expression/var.md

> :: tests related to bindings : functions : rebinding func name : gen : Generator func expression
>
> ::> var

## Input


`````js
x = function *f(){ var f = 1 }
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
  loc:{start:{line:1,column:0},end:{line:1,column:30},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:30},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,column:0},end:{line:1,column:30},source:''},
        left: {
          type: 'Identifier',
          loc:{start:{line:1,column:0},end:{line:1,column:1},source:''},
          name: 'x'
        },
        operator: '=',
        right: {
          type: 'FunctionExpression',
          loc:{start:{line:1,column:4},end:{line:1,column:30},source:''},
          generator: true,
          async: false,
          id: {
            type: 'Identifier',
            loc:{start:{line:1,column:14},end:{line:1,column:15},source:''},
            name: 'f'
          },
          params: [],
          body: {
            type: 'BlockStatement',
            loc:{start:{line:1,column:17},end:{line:1,column:30},source:''},
            body: [
              {
                type: 'VariableDeclaration',
                loc:{start:{line:1,column:19},end:{line:1,column:28},source:''},
                kind: 'var',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    loc:{start:{line:1,column:23},end:{line:1,column:28},source:''},
                    id: {
                      type: 'Identifier',
                      loc:{start:{line:1,column:23},end:{line:1,column:24},source:''},
                      name: 'f'
                    },
                    init: {
                      type: 'Literal',
                      loc:{start:{line:1,column:27},end:{line:1,column:28},source:''},
                      value: 1,
                      raw: '1'
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    }
  ]
}

tokens (16x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR IDENT IDENT PUNCTUATOR NUMBER_DEC ASI PUNCTUATOR ASI
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