# ZeParser parser test case

- Path: tests/testcases/async_keyword/async_with_newline_breaking_an_expression_mid-air.md

> :: async keyword
>
> ::> async with newline breaking an expression mid-air
>
> note that `+d` after the func decl is valid because the + is also a prefix operator

## Input

`````js
let f = a + b + async
function g(){} + d
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
  loc:{start:{line:1,column:0},end:{line:2,column:18},source:''},
  body: [
    {
      type: 'VariableDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:21},source:''},
      kind: 'let',
      declarations: [
        {
          type: 'VariableDeclarator',
          loc:{start:{line:1,column:4},end:{line:1,column:21},source:''},
          id: {
            type: 'Identifier',
            loc:{start:{line:1,column:4},end:{line:1,column:5},source:''},
            name: 'f'
          },
          init: {
            type: 'BinaryExpression',
            loc:{start:{line:1,column:8},end:{line:1,column:21},source:''},
            left: {
              type: 'BinaryExpression',
              loc:{start:{line:1,column:8},end:{line:1,column:13},source:''},
              left: {
                type: 'Identifier',
                loc:{start:{line:1,column:8},end:{line:1,column:9},source:''},
                name: 'a'
              },
              operator: '+',
              right: {
                type: 'Identifier',
                loc:{start:{line:1,column:12},end:{line:1,column:13},source:''},
                name: 'b'
              }
            },
            operator: '+',
            right: {
              type: 'Identifier',
              loc:{start:{line:1,column:16},end:{line:1,column:21},source:''},
              name: 'async'
            }
          }
        }
      ]
    },
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:2,column:0},end:{line:2,column:14},source:''},
      generator: false,
      async: false,
      id: {
        type: 'Identifier',
        loc:{start:{line:2,column:9},end:{line:2,column:10},source:''},
        name: 'g'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:2,column:12},end:{line:2,column:14},source:''},
        body: []
      }
    },
    {
      type: 'ExpressionStatement',
      loc:{start:{line:2,column:15},end:{line:2,column:18},source:''},
      expression: {
        type: 'UnaryExpression',
        loc:{start:{line:2,column:15},end:{line:2,column:18},source:''},
        operator: '+',
        prefix: true,
        argument: {
          type: 'Identifier',
          loc:{start:{line:2,column:17},end:{line:2,column:18},source:''},
          name: 'd'
        }
      }
    }
  ]
}

tokens (19x):
       IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT
       ASI IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR IDENT ASI
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