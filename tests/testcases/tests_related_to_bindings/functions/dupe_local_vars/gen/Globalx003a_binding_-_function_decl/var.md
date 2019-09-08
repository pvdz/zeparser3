# ZeParser parser autogenerated test case

- From: tests/testcases/tests_related_to_bindings/functions/dupe_local_vars/autogen.md
- Path: tests/testcases/tests_related_to_bindings/functions/dupe_local_vars/gen/Globalx003a_binding_-_function_decl/var.md

> :: tests related to bindings : functions : dupe local vars : gen : Globalx003a binding - function decl
>
> ::> var

## Input


`````js
var f = 1; function f() {}
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
  loc:{start:{line:1,column:0},end:{line:1,column:26},source:''},
  body: [
    {
      type: 'VariableDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:10},source:''},
      kind: 'var',
      declarations: [
        {
          type: 'VariableDeclarator',
          loc:{start:{line:1,column:4},end:{line:1,column:9},source:''},
          id: {
            type: 'Identifier',
            loc:{start:{line:1,column:4},end:{line:1,column:5},source:''},
            name: 'f'
          },
          init: {
            type: 'Literal',
            loc:{start:{line:1,column:8},end:{line:1,column:9},source:''},
            value: 1,
            raw: '1'
          }
        }
      ]
    },
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,column:11},end:{line:1,column:26},source:''},
      generator: false,
      async: false,
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:20},end:{line:1,column:21},source:''},
        name: 'f'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:1,column:24},end:{line:1,column:26},source:''},
        body: []
      }
    }
  ]
}

tokens (12x):
       IDENT IDENT PUNCTUATOR NUMBER_DEC PUNCTUATOR IDENT IDENT
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

`````
throws: Parser error!
  Attempted to create a lexical binding for `f` but another binding already existed on the same level

var f = 1; function f() {}
                    ^------- error
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._