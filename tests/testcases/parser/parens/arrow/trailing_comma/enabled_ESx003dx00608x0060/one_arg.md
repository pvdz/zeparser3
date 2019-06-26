# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/parens/arrow/trailing_comma/enabled_ESx003dx00608x0060/one_arg.md

> :: parens : arrow : trailing comma : enabled, ES=`8`
>
> ::> one arg

## Input

- `es = 8`

`````js
(a,) => {}
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
  loc:{start:{line:1,col:0},end:{line:1,col:10},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:10},source:''},
      expression: {
        type: 'ArrowFunctionExpression',
        loc:{start:{line:1,col:0},end:{line:1,col:10},source:''},
        params: [
          {
            type: 'Identifier',
            loc:{start:{line:1,col:1},end:{line:1,col:2},source:''},
            name: 'a'
          }
        ],
        id: null,
        generator: false,
        async: false,
        expression: false,
        body: {
          type: 'BlockStatement',
          loc:{start:{line:1,col:8},end:{line:1,col:10},source:''},
          body: []
        }
      }
    }
  ]
}

tokens (9x):
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR ASI
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