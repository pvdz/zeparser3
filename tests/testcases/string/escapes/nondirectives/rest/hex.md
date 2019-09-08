# ZeParser parser test case

- Path: tests/testcases/string/escapes/nondirectives/rest/hex.md

> :: string : escapes : nondirectives : rest
>
> ::> hex

## Input

`````js
debugger;
'xyz \1';
'xyz \x01';
'xyz \\1';
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
  loc:{start:{line:1,column:0},end:{line:4,column:10},source:''},
  body: [
    {
      type: 'DebuggerStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:9},source:''}
    },
    {
      type: 'ExpressionStatement',
      loc:{start:{line:2,column:0},end:{line:2,column:9},source:''},
      expression: {
        type: 'Literal',
        loc:{start:{line:2,column:0},end:{line:2,column:8},source:''},
        value: 'xyz \u0001',
        raw: "'xyz \\1'"
      }
    },
    {
      type: 'ExpressionStatement',
      loc:{start:{line:3,column:0},end:{line:3,column:11},source:''},
      expression: {
        type: 'Literal',
        loc:{start:{line:3,column:0},end:{line:3,column:10},source:''},
        value: 'xyz \u0001',
        raw: "'xyz \\x01'"
      }
    },
    {
      type: 'ExpressionStatement',
      loc:{start:{line:4,column:0},end:{line:4,column:10},source:''},
      expression: {
        type: 'Literal',
        loc:{start:{line:4,column:0},end:{line:4,column:9},source:''},
        value: 'xyz \\1',
        raw: "'xyz \\\\1'"
      }
    }
  ]
}

tokens (9x):
       IDENT PUNCTUATOR STRING_SINGLE PUNCTUATOR STRING_SINGLE
       PUNCTUATOR STRING_SINGLE PUNCTUATOR
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