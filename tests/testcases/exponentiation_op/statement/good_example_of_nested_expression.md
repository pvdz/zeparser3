# ZeParser parser test case

- Path: tests/testcases/exponentiation_op/statement/good_example_of_nested_expression.md

> :: exponentiation op : statement
>
> ::> good example of nested expression

## Input

`````js
+a * b ** c ** 3
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
  loc:{start:{line:1,column:0},end:{line:1,column:16},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:16},source:''},
      expression: {
        type: 'BinaryExpression',
        loc:{start:{line:1,column:0},end:{line:1,column:16},source:''},
        left: {
          type: 'UnaryExpression',
          loc:{start:{line:1,column:0},end:{line:1,column:2},source:''},
          operator: '+',
          prefix: true,
          argument: {
            type: 'Identifier',
            loc:{start:{line:1,column:1},end:{line:1,column:2},source:''},
            name: 'a'
          }
        },
        operator: '*',
        right: {
          type: 'BinaryExpression',
          loc:{start:{line:1,column:5},end:{line:1,column:16},source:''},
          left: {
            type: 'Identifier',
            loc:{start:{line:1,column:5},end:{line:1,column:6},source:''},
            name: 'b'
          },
          operator: '**',
          right: {
            type: 'BinaryExpression',
            loc:{start:{line:1,column:10},end:{line:1,column:16},source:''},
            left: {
              type: 'Identifier',
              loc:{start:{line:1,column:10},end:{line:1,column:11},source:''},
              name: 'c'
            },
            operator: '**',
            right: {
              type: 'Literal',
              loc:{start:{line:1,column:15},end:{line:1,column:16},source:''},
              value: 3,
              raw: '3'
            }
          }
        }
      }
    }
  ]
}

tokens (10x):
       PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       NUMBER_DEC ASI
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