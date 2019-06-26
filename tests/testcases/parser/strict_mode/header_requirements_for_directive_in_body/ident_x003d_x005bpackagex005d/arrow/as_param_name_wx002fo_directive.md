# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bpackagex005d/arrow/as_param_name_wx002fo_directive.md

> :: strict mode : header requirements for directive in body : ident = [package] : arrow
>
> ::> as param name w/o directive

## Input

`````js
(package) => {}
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
  loc:{start:{line:1,col:0},end:{line:1,col:15},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:15},source:''},
      expression: {
        type: 'ArrowFunctionExpression',
        loc:{start:{line:1,col:0},end:{line:1,col:15},source:''},
        params: [
          {
            type: 'Identifier',
            loc:{start:{line:1,col:1},end:{line:1,col:8},source:''},
            name: 'package'
          }
        ],
        id: null,
        generator: false,
        async: false,
        expression: false,
        body: {
          type: 'BlockStatement',
          loc:{start:{line:1,col:13},end:{line:1,col:15},source:''},
          body: []
        }
      }
    }
  ]
}

tokens (8x):
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
       ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Illegal keyword encountered; is not a value [package]

(package) => {}
        ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._