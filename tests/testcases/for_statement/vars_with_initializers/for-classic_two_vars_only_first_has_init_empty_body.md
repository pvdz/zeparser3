# ZeParser parser test case

- Path: tests/testcases/for_statement/vars_with_initializers/for-classic_two_vars_only_first_has_init_empty_body.md

> :: for statement : vars with initializers
>
> ::> for-classic two vars only first has init empty body

## Input

`````js
for (var a=1, b;;);
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
  loc:{start:{line:1,column:0},end:{line:1,column:19},source:''},
  body: [
    {
      type: 'ForStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:19},source:''},
      init: {
        type: 'VariableDeclaration',
        loc:{start:{line:1,column:5},end:{line:1,column:15},source:''},
        kind: 'var',
        declarations: [
          {
            type: 'VariableDeclarator',
            loc:{start:{line:1,column:9},end:{line:1,column:12},source:''},
            id: {
              type: 'Identifier',
              loc:{start:{line:1,column:9},end:{line:1,column:10},source:''},
              name: 'a'
            },
            init: {
              type: 'Literal',
              loc:{start:{line:1,column:11},end:{line:1,column:12},source:''},
              value: 1,
              raw: '1'
            }
          },
          {
            type: 'VariableDeclarator',
            loc:{start:{line:1,column:14},end:{line:1,column:15},source:''},
            id: {
              type: 'Identifier',
              loc:{start:{line:1,column:14},end:{line:1,column:15},source:''},
              name: 'b'
            },
            init: null
          }
        ]
      },
      test: null,
      update: null,
      body: {
        type: 'EmptyStatement',
        loc:{start:{line:1,column:18},end:{line:1,column:19},source:''}
      }
    }
  ]
}

tokens (13x):
       IDENT PUNCTUATOR IDENT IDENT PUNCTUATOR NUMBER_DEC PUNCTUATOR
       IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
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