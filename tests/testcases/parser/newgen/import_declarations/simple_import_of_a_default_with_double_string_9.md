# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/import_declarations/simple_import_of_a_default_with_double_string_9.md

> :: import declarations
>
> ::> simple import of a default with double string 9

## Input

`````js
import {x, z,} from "y"
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

import {x, z,} from "y"
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 23 } },
  body: [
    {
      type: 'ImportDeclaration',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 23 },
        source: ''
      },
      specifiers: [
        {
          type: 'ImportSpecifier',
          loc: {
            start: { line: 1, col: 8 },
            end: { line: 1, col: 11 },
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
        },
        {
          type: 'ImportSpecifier',
          loc: {
            start: { line: 1, col: 11 },
            end: { line: 1, col: 13 },
            source: ''
          },
          imported: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 11 },
              end: { line: 1, col: 11 },
              source: ''
            },
            name: 'z'
          },
          local: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 11 },
              end: { line: 1, col: 12 },
              source: ''
            },
            name: 'z'
          }
        }
      ],
      source: {
        type: 'Literal',
        loc: {
          start: { line: 1, col: 20 },
          end: { line: 1, col: 20 },
          source: ''
        },
        value: 'y',
        raw: '"y"'
      }
    }
  ]
}

tokens (11x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       IDENT STRING_DOUBLE ASI
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._