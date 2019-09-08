# ZeParser parser test case

- Path: tests/testcases/var_statement/binding_generic/as_a_statement/destructuring/array/two_vars_without_and_with_initializer_1.md

> :: var statement : binding generic : as a statement : destructuring : array
>
> ::> two vars without and with initializer 1

## Input

`````js
var [foo, bar=b] = arr;
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
      type: 'VariableDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:23},source:''},
      kind: 'var',
      declarations: [
        {
          type: 'VariableDeclarator',
          loc:{start:{line:1,column:4},end:{line:1,column:22},source:''},
          id: {
            type: 'ArrayPattern',
            loc:{start:{line:1,column:4},end:{line:1,column:16},source:''},
            elements: [
              {
                type: 'Identifier',
                loc:{start:{line:1,column:5},end:{line:1,column:8},source:''},
                name: 'foo'
              },
              {
                type: 'AssignmentPattern',
                loc:{start:{line:1,column:10},end:{line:1,column:15},source:''},
                left: {
                  type: 'Identifier',
                  loc:{start:{line:1,column:10},end:{line:1,column:13},source:''},
                  name: 'bar'
                },
                right: {
                  type: 'Identifier',
                  loc:{start:{line:1,column:14},end:{line:1,column:15},source:''},
                  name: 'b'
                }
              }
            ]
          },
          init: {
            type: 'Identifier',
            loc:{start:{line:1,column:19},end:{line:1,column:22},source:''},
            name: 'arr'
          }
        }
      ]
    }
  ]
}

tokens (12x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
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