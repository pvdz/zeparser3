# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/objects/literals/identifier_method/special_keys_with_identx003ddebugger/as_method_in_obj.md

> :: objects : literals : identifier method : special keys with ident=debugger
>
> ::> as method in obj

## Input

`````js
({debugger(){}});
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
  loc:{start:{line:1,col:0},end:{line:1,col:17},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:17},source:''},
      expression: {
        type: 'ObjectExpression',
        loc:{start:{line:1,col:1},end:{line:1,col:15},source:''},
        properties: [
          {
            type: 'Property',
            loc:{start:{line:1,col:2},end:{line:1,col:14},source:''},
            key: {
              type: 'Identifier',
              loc:{start:{line:1,col:2},end:{line:1,col:10},source:''},
              name: 'debugger'
            },
            kind: 'init',
            method: true,
            computed: false,
            value: {
              type: 'FunctionExpression',
              loc:{start:{line:1,col:2},end:{line:1,col:14},source:''},
              generator: false,
              async: false,
              id: null,
              params: [],
              body: {
                type: 'BlockStatement',
                loc:{start:{line:1,col:12},end:{line:1,col:14},source:''},
                body: []
              }
            },
            shorthand: false
          }
        ]
      }
    }
  ]
}

tokens (11x):
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
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