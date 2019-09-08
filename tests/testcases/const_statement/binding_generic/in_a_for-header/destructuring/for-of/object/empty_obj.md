# ZeParser parser test case

- Path: tests/testcases/const_statement/binding_generic/in_a_for-header/destructuring/for-of/object/empty_obj.md

> :: const statement : binding generic : in a for-header : destructuring : for-of : object
>
> ::> empty obj

## Input

`````js
for (const {} of obj);
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
  loc:{start:{line:1,column:0},end:{line:1,column:22},source:''},
  body: [
    {
      type: 'ForOfStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:22},source:''},
      left: {
        type: 'VariableDeclaration',
        loc:{start:{line:1,column:5},end:{line:1,column:13},source:''},
        kind: 'const',
        declarations: [
          {
            type: 'VariableDeclarator',
            loc:{start:{line:1,column:11},end:{line:1,column:13},source:''},
            id: {
              type: 'ObjectPattern',
              loc:{start:{line:1,column:11},end:{line:1,column:13},source:''},
              properties: []
            },
            init: null
          }
        ]
      },
      right: {
        type: 'Identifier',
        loc:{start:{line:1,column:17},end:{line:1,column:20},source:''},
        name: 'obj'
      },
      await: false,
      body: {
        type: 'EmptyStatement',
        loc:{start:{line:1,column:21},end:{line:1,column:22},source:''}
      }
    }
  ]
}

tokens (10x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT IDENT
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