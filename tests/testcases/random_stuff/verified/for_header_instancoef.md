# ZeParser parser test case

- Path: tests/testcases/random_stuff/verified/for_header_instancoef.md

> :: random stuff : verified
>
> ::> for header instancoef
>
> fuzzed

## Input

`````js
for ((2935) instanceof ((2e308));;) debugger
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
  loc:{start:{line:1,column:0},end:{line:1,column:44},source:''},
  body: [
    {
      type: 'ForStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:44},source:''},
      init: {
        type: 'BinaryExpression',
        loc:{start:{line:1,column:5},end:{line:1,column:32},source:''},
        left: {
          type: 'Literal',
          loc:{start:{line:1,column:6},end:{line:1,column:10},source:''},
          value: 2935,
          raw: '2935'
        },
        operator: 'instanceof',
        right: {
          type: 'Literal',
          loc:{start:{line:1,column:25},end:{line:1,column:30},source:''},
          value: Infinity,
          raw: '2e308'
        }
      },
      test: null,
      update: null,
      body: {
        type: 'DebuggerStatement',
        loc:{start:{line:1,column:36},end:{line:1,column:44},source:''}
      }
    }
  ]
}

tokens (17x):
       IDENT PUNCTUATOR PUNCTUATOR NUMBER_DEC PUNCTUATOR IDENT
       PUNCTUATOR PUNCTUATOR NUMBER_DEC PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT ASI
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