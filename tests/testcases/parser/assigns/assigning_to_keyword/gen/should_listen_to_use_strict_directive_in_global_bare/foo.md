# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/assigns/assigning_to_keyword/autogen.md
- Path: zeparser3/tests/testcases/parser/assigns/assigning_to_keyword/gen/should_listen_to_use_strict_directive_in_global_bare

> :: test: should listen to use strict directive in global bare
> :: case: foo

## Input


`````js
"use strict"; foo = x;
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 22 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 14 },
        source: ''
      },
      expression: {
        type: 'Literal',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 0 },
          source: ''
        },
        value: 'use strict',
        raw: '"use strict"'
      },
      directive: 'use strict'
    },
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 14 },
        end: { line: 1, col: 22 },
        source: ''
      },
      expression: {
        type: 'AssignmentExpression',
        loc: {
          start: { line: 1, col: 14 },
          end: { line: 1, col: 21 },
          source: ''
        },
        left: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 14 },
            end: { line: 1, col: 18 },
            source: ''
          },
          name: 'foo'
        },
        operator: '=',
        right: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 20 },
            end: { line: 1, col: 21 },
            source: ''
          },
          name: 'x'
        }
      }
    }
  ]
}

tokens (7x):
       STRING_DOUBLE PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
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