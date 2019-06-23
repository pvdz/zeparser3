# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/objects/destructuring/destruct_assignment_when_value_is_property_of_number.md

> :: objects : destructuring
>
> ::> destruct assignment when value is property of number

## Input

`````js
({"foo": 15..foo}=y)
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 20 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 20 },
        source: ''
      },
      expression: {
        type: 'AssignmentExpression',
        loc: {
          start: { line: 1, col: 1 },
          end: { line: 1, col: 19 },
          source: ''
        },
        left: {
          type: 'ObjectPattern',
          loc: {
            start: { line: 1, col: 1 },
            end: { line: 1, col: 17 },
            source: ''
          },
          properties: [
            {
              type: 'Property',
              loc: {
                start: { line: 1, col: 2 },
                end: { line: 1, col: 16 },
                source: ''
              },
              key: {
                type: 'Literal',
                loc: {
                  start: { line: 1, col: 2 },
                  end: { line: 1, col: 9 },
                  source: ''
                },
                value: 'foo',
                raw: '"foo"'
              },
              kind: 'init',
              method: false,
              computed: false,
              value: {
                type: 'MemberExpression',
                loc: {
                  start: { line: 1, col: 9 },
                  end: { line: 1, col: 16 },
                  source: ''
                },
                object: {
                  type: 'Literal',
                  loc: {
                    start: { line: 1, col: 9 },
                    end: { line: 1, col: 9 },
                    source: ''
                  },
                  value: 15,
                  raw: '15.'
                },
                property: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 13 },
                    end: { line: 1, col: 13 },
                    source: ''
                  },
                  name: 'foo'
                },
                computed: false
              },
              shorthand: false
            }
          ]
        },
        operator: '=',
        right: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 18 },
            end: { line: 1, col: 19 },
            source: ''
          },
          name: 'y'
        }
      }
    }
  ]
}

tokens (13x):
       PUNCTUATOR PUNCTUATOR STRING_DOUBLE PUNCTUATOR NUMBER_DEC
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR ASI
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