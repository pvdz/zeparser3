# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/let_declaration/let_as_identifier_in_sloppy_mode/let_as_var_name/in_global/var_obj_alias_destruct.md

> :: let declaration : let as identifier in sloppy mode : let as var name : in global
>
> ::> var obj alias destruct

## Input

`````js
var {foo: let} = x;
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 19 } },
  body: [
    {
      type: 'VariableDeclaration',
      loc: {
        start: { line: 1, col: 4 },
        end: { line: 1, col: 18 },
        source: ''
      },
      kind: 'var',
      declarations: [
        {
          type: 'VariableDeclarator',
          loc: {
            start: { line: 1, col: 4 },
            end: { line: 1, col: 18 },
            source: ''
          },
          id: {
            type: 'ObjectPattern',
            loc: {
              start: { line: 1, col: 4 },
              end: { line: 1, col: 15 },
              source: ''
            },
            properties: [
              {
                type: 'Property',
                loc: {
                  start: { line: 1, col: 5 },
                  end: { line: 1, col: 13 },
                  source: ''
                },
                key: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 5 },
                    end: { line: 1, col: 10 },
                    source: ''
                  },
                  name: 'foo'
                },
                kind: 'init',
                method: false,
                computed: false,
                value: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 10 },
                    end: { line: 1, col: 13 },
                    source: ''
                  },
                  name: 'let'
                },
                shorthand: false
              }
            ]
          },
          init: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 17 },
              end: { line: 1, col: 18 },
              source: ''
            },
            name: 'x'
          }
        }
      ]
    }
  ]
}

tokens (10x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       IDENT PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Can not use `let` as variable name in strict mode

var {foo: let} = x;
             ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._