# ZeParser parser test case

- Path: tests/testcases/tests_related_to_bindings/functions/dupe_args_definitions/simple_args/without_explicit_directive/b_a_b_a.md

> :: tests related to bindings : functions : dupe args definitions : simple args : without explicit directive
>
> ::> b a b a
> 
> https://tc39.github.io/ecma262/#sec-function-definitions-static-semantics-early-errors
> > It is a Syntax Error if (IsSimpleParameterList of FormalParameterList is false or strict mode is true) and BoundNames of FormalParameterList contains any duplicate elements.
> 
> dupe bindings are okay in simple args in sloppy script

## Input

`````js
function f(b, a, b, a) {}
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
  loc:{start:{line:1,column:0},end:{line:1,column:25},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:25},source:''},
      generator: false,
      async: false,
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:9},end:{line:1,column:10},source:''},
        name: 'f'
      },
      params: [
        {
          type: 'Identifier',
          loc:{start:{line:1,column:11},end:{line:1,column:12},source:''},
          name: 'b'
        },
        {
          type: 'Identifier',
          loc:{start:{line:1,column:14},end:{line:1,column:15},source:''},
          name: 'a'
        },
        {
          type: 'Identifier',
          loc:{start:{line:1,column:17},end:{line:1,column:18},source:''},
          name: 'b'
        },
        {
          type: 'Identifier',
          loc:{start:{line:1,column:20},end:{line:1,column:21},source:''},
          name: 'a'
        }
      ],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:1,column:23},end:{line:1,column:25},source:''},
        body: []
      }
    }
  ]
}

tokens (14x):
       IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Function had duplicate params

function f(b, a, b, a) {}
                        ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._