# ZeParser parser test case

- Path: tests/testcases/assigns/destruct/destruct_assign_with_default_after_comma.md

> :: assigns : destruct
>
> ::> destruct assign with default after comma

## Input

`````js
x, [foo = y, bar] = doo
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
  loc:{start:{line:1,column:0},end:{line:1,column:23},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:23},source:''},
      expression: {
        type: 'SequenceExpression',
        loc:{start:{line:1,column:0},end:{line:1,column:23},source:''},
        expressions: [
          {
            type: 'Identifier',
            loc:{start:{line:1,column:0},end:{line:1,column:1},source:''},
            name: 'x'
          },
          {
            type: 'AssignmentExpression',
            loc:{start:{line:1,column:3},end:{line:1,column:23},source:''},
            left: {
              type: 'ArrayPattern',
              loc:{start:{line:1,column:3},end:{line:1,column:17},source:''},
              elements: [
                {
                  type: 'AssignmentPattern',
                  loc:{start:{line:1,column:4},end:{line:1,column:11},source:''},
                  left: {
                    type: 'Identifier',
                    loc:{start:{line:1,column:4},end:{line:1,column:7},source:''},
                    name: 'foo'
                  },
                  right: {
                    type: 'Identifier',
                    loc:{start:{line:1,column:10},end:{line:1,column:11},source:''},
                    name: 'y'
                  }
                },
                {
                  type: 'Identifier',
                  loc:{start:{line:1,column:13},end:{line:1,column:16},source:''},
                  name: 'bar'
                }
              ]
            },
            operator: '=',
            right: {
              type: 'Identifier',
              loc:{start:{line:1,column:20},end:{line:1,column:23},source:''},
              name: 'doo'
            }
          }
        ]
      }
    }
  ]
}

tokens (13x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       IDENT PUNCTUATOR PUNCTUATOR IDENT ASI
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
((x, ([foo = y, bar,] = doo)));
````

Produces same AST