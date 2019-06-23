# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/import_declarations/simple_import_of_a_default_with_double_string_5.md

> :: import declarations
>
> ::> simple import of a default with double string 5

## Input

`````js
import {x,} from "y"
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  The `import` keyword can only be used with the module goal

import {x,} from "y"
^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

`````
ast: {
  type: 'Program',
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 20 } },
  body: [
    {
      type: 'ImportDeclaration',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 20 },
        source: ''
      },
      specifiers: [
        {
          type: 'ImportSpecifier',
          loc: {
            start: { line: 1, col: 8 },
            end: { line: 1, col: 10 },
            source: ''
          },
          imported: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 8 },
              end: { line: 1, col: 8 },
              source: ''
            },
            name: 'x'
          },
          local: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 8 },
              end: { line: 1, col: 9 },
              source: ''
            },
            name: 'x'
          }
        }
      ],
      source: {
        type: 'Literal',
        loc: {
          start: { line: 1, col: 17 },
          end: { line: 1, col: 17 },
          source: ''
        },
        value: 'y',
        raw: '"y"'
      }
    }
  ]
}

tokens (9x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT
       STRING_DOUBLE ASI
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._