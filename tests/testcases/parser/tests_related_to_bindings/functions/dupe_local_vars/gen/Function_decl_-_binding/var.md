# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/tests_related_to_bindings/functions/dupe_local_vars/autogen.md
- Path: zeparser3/tests/testcases/parser/tests_related_to_bindings/functions/dupe_local_vars/gen/Function_decl_-_binding

> :: test: Function decl - binding
>
> :: case: var

## Input


`````js
function g(){ function f() {} var f = 1; }
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
  loc:{start:{line:1,col:0},end:{line:1,col:42},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,col:0},end:{line:1,col:42},source:''},
      generator: false,
      async: false,
      id: {
        type: 'Identifier',
        loc:{start:{line:1,col:9},end:{line:1,col:9},source:''},
        name: 'g'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:1,col:12},end:{line:1,col:42},source:''},
        body: [
          {
            type: 'FunctionDeclaration',
            loc:{start:{line:1,col:14},end:{line:1,col:30},source:''},
            generator: false,
            async: false,
            id: {
              type: 'Identifier',
              loc:{start:{line:1,col:23},end:{line:1,col:23},source:''},
              name: 'f'
            },
            params: [],
            body: {
              type: 'BlockStatement',
              loc:{start:{line:1,col:27},end:{line:1,col:30},source:''},
              body: []
            }
          },
          {
            type: 'VariableDeclaration',
            loc:{start:{line:1,col:34},end:{line:1,col:39},source:''},
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                loc:{start:{line:1,col:34},end:{line:1,col:39},source:''},
                id: {
                  type: 'Identifier',
                  loc:{start:{line:1,col:34},end:{line:1,col:34},source:''},
                  name: 'f'
                },
                init: {
                  type: 'Literal',
                  loc:{start:{line:1,col:38},end:{line:1,col:38},source:''},
                  value: 1,
                  raw: '1'
                }
              }
            ]
          }
        ]
      }
    }
  ]
}

tokens (18x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT IDENT
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT IDENT
       PUNCTUATOR NUMBER_DEC PUNCTUATOR PUNCTUATOR
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