# ZeParser parser test case

- Path: zeparser3/tests/testcases/parser/dowhile_statement/do_if_func_while.md

> :: dowhile statement
>
> ::> do if func while
>
> By fuzzer reduced
>
> The sub-statement of `do` does not get an `ASI` unless there's a newline preceeding the `while`. However, in this case the sub-statement ends in a function declaration which does not require a semi, so it's fine.
>
> This should be legal in web compat mode (only). In other modes the func decl cannot be a child of `if`.

## Input

`````js
do if(8)function s(){}while(y)
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Function declaration is only allowed as direct child of an `if` or `else` with web compat mode enabled in sloppy mode

do if(8)function s(){}while(y)
        ^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

_Output same as sloppy mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

`````
ast: {
  type: 'Program',
  loc:{start:{line:1,col:0},end:{line:1,col:30},source:''},
  body: [
    {
      type: 'DoWhileStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:30},source:''},
      body: {
        type: 'IfStatement',
        loc:{start:{line:1,col:3},end:{line:1,col:22},source:''},
        test: {
          type: 'Literal',
          loc:{start:{line:1,col:6},end:{line:1,col:6},source:''},
          value: 8,
          raw: '8'
        },
        consequent: {
          type: 'FunctionDeclaration',
          loc:{start:{line:1,col:8},end:{line:1,col:22},source:''},
          generator: false,
          async: false,
          id: {
            type: 'Identifier',
            loc:{start:{line:1,col:17},end:{line:1,col:17},source:''},
            name: 's'
          },
          params: [],
          body: {
            type: 'BlockStatement',
            loc:{start:{line:1,col:20},end:{line:1,col:22},source:''},
            body: []
          }
        },
        alternate: null
      },
      test: {
        type: 'Identifier',
        loc:{start:{line:1,col:28},end:{line:1,col:29},source:''},
        name: 'y'
      }
    }
  ]
}

tokens (17x):
       IDENT IDENT PUNCTUATOR NUMBER_DEC PUNCTUATOR IDENT IDENT
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       IDENT PUNCTUATOR ASI
`````
