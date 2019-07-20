# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/operator_precedent/autogen.md
- Path: zeparser3/tests/testcases/parser/operator_precedent/gen/in_array

> :: test: in array
>
> :: case: a instanceof b > c

## Input


`````js
[ a instanceof b > c ]
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
        type: 'ArrayExpression',
        loc:{start:{line:1,col:0},end:{line:1,col:22},source:''},
        elements: [
          {
            type: 'BinaryExpression',
            loc:{start:{line:1,col:0},end:{line:1,col:21},source:''},
            left: {
              type: 'BinaryExpression',
              loc:{start:{line:1,col:0},end:{line:1,col:17},source:''},
              left: {
                type: 'Identifier',
                loc:{start:{line:1,col:2},end:{line:1,col:4},source:''},
                name: 'a'
              },
              operator: 'instanceof',
              right: {
                type: 'Identifier',
                loc:{start:{line:1,col:15},end:{line:1,col:17},source:''},
                name: 'b'
              }
            },
            operator: '>',
            right: {
              type: 'Identifier',
              loc:{start:{line:1,col:19},end:{line:1,col:21},source:''},
              name: 'c'
            }
          }
        ]
      }
    }
  ]
}

tokens (9x):
       PUNCTUATOR IDENT IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR ASI
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