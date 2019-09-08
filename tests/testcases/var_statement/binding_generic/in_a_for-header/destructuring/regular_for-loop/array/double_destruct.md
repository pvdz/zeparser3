# ZeParser parser test case

- Path: tests/testcases/var_statement/binding_generic/in_a_for-header/destructuring/regular_for-loop/array/double_destruct.md

> :: var statement : binding generic : in a for-header : destructuring : regular for-loop : array
>
> ::> double destruct

## Input

`````js
for (var [foo] = arr, [bar] = arr2;;);
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
  loc:{start:{line:1,column:0},end:{line:1,column:38},source:''},
  body: [
    {
      type: 'ForStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:38},source:''},
      init: {
        type: 'VariableDeclaration',
        loc:{start:{line:1,column:5},end:{line:1,column:34},source:''},
        kind: 'var',
        declarations: [
          {
            type: 'VariableDeclarator',
            loc:{start:{line:1,column:9},end:{line:1,column:20},source:''},
            id: {
              type: 'ArrayPattern',
              loc:{start:{line:1,column:9},end:{line:1,column:14},source:''},
              elements: [
                {
                  type: 'Identifier',
                  loc:{start:{line:1,column:10},end:{line:1,column:13},source:''},
                  name: 'foo'
                }
              ]
            },
            init: {
              type: 'Identifier',
              loc:{start:{line:1,column:17},end:{line:1,column:20},source:''},
              name: 'arr'
            }
          },
          {
            type: 'VariableDeclarator',
            loc:{start:{line:1,column:22},end:{line:1,column:34},source:''},
            id: {
              type: 'ArrayPattern',
              loc:{start:{line:1,column:22},end:{line:1,column:27},source:''},
              elements: [
                {
                  type: 'Identifier',
                  loc:{start:{line:1,column:23},end:{line:1,column:26},source:''},
                  name: 'bar'
                }
              ]
            },
            init: {
              type: 'Identifier',
              loc:{start:{line:1,column:30},end:{line:1,column:34},source:''},
              name: 'arr2'
            }
          }
        ]
      },
      test: null,
      update: null,
      body: {
        type: 'EmptyStatement',
        loc:{start:{line:1,column:37},end:{line:1,column:38},source:''}
      }
    }
  ]
}

tokens (19x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
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