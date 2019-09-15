# ZeParser parser test case

- Path: tests/testcases/super_keyword/call/class_constructors/allowed_in_constructor_arg_defaults.md

> :: super keyword : call : class constructors
>
> ::> allowed in constructor arg defaults

## Input

`````js
class x extends y { constructor(x = super()) { } }
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
  loc:{start:{line:1,column:0},end:{line:1,column:50},source:''},
  body: [
    {
      type: 'ClassDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:50},source:''},
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:6},end:{line:1,column:7},source:''},
        name: 'x'
      },
      superClass: {
        type: 'Identifier',
        loc:{start:{line:1,column:16},end:{line:1,column:17},source:''},
        name: 'y'
      },
      body: {
        type: 'ClassBody',
        loc:{start:{line:1,column:18},end:{line:1,column:50},source:''},
        body: [
          {
            type: 'MethodDefinition',
            loc:{start:{line:1,column:20},end:{line:1,column:48},source:''},
            key: {
              type: 'Identifier',
              loc:{start:{line:1,column:20},end:{line:1,column:31},source:''},
              name: 'constructor'
            },
            static: false,
            computed: false,
            kind: 'constructor',
            value: {
              type: 'FunctionExpression',
              loc:{start:{line:1,column:20},end:{line:1,column:48},source:''},
              generator: false,
              async: false,
              id: null,
              params: [
                {
                  type: 'AssignmentPattern',
                  loc:{start:{line:1,column:32},end:{line:1,column:43},source:''},
                  left: {
                    type: 'Identifier',
                    loc:{start:{line:1,column:32},end:{line:1,column:33},source:''},
                    name: 'x'
                  },
                  right: {
                    type: 'CallExpression',
                    loc:{start:{line:1,column:36},end:{line:1,column:43},source:''},
                    callee: {
                      type: 'Super',
                      loc:{start:{line:1,column:36},end:{line:1,column:41},source:''}
                    },
                    arguments: []
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                loc:{start:{line:1,column:45},end:{line:1,column:48},source:''},
                body: []
              }
            }
          }
        ]
      }
    }
  ]
}

tokens (17x):
       IDENT IDENT IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR
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