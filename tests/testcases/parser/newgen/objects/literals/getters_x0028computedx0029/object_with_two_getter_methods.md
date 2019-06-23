# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/objects/literals/getters_x0028computedx0029/object_with_two_getter_methods.md

> :: objects : literals : getters (computed)
>
> ::> object with two getter methods

## Input

`````js
wrap({get [foo](){}, get [bar](){}});
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 37 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 37 },
        source: ''
      },
      expression: {
        type: 'CallExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 36 },
          source: ''
        },
        callee: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 0 },
            end: { line: 1, col: 4 },
            source: ''
          },
          name: 'wrap'
        },
        arguments: [
          {
            type: 'ObjectExpression',
            loc: {
              start: { line: 1, col: 5 },
              end: { line: 1, col: 35 },
              source: ''
            },
            properties: [
              {
                type: 'Property',
                loc: {
                  start: { line: 1, col: 6 },
                  end: { line: 1, col: 19 },
                  source: ''
                },
                key: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 11 },
                    end: { line: 1, col: 14 },
                    source: ''
                  },
                  name: 'foo'
                },
                kind: 'get',
                method: false,
                computed: true,
                value: {
                  type: 'FunctionExpression',
                  loc: {
                    start: { line: 1, col: 6 },
                    end: { line: 1, col: 19 },
                    source: ''
                  },
                  generator: false,
                  async: false,
                  id: null,
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    loc: {
                      start: { line: 1, col: 17 },
                      end: { line: 1, col: 19 },
                      source: ''
                    },
                    body: []
                  }
                },
                shorthand: false
              },
              {
                type: 'Property',
                loc: {
                  start: { line: 1, col: 21 },
                  end: { line: 1, col: 34 },
                  source: ''
                },
                key: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 26 },
                    end: { line: 1, col: 29 },
                    source: ''
                  },
                  name: 'bar'
                },
                kind: 'get',
                method: false,
                computed: true,
                value: {
                  type: 'FunctionExpression',
                  loc: {
                    start: { line: 1, col: 21 },
                    end: { line: 1, col: 34 },
                    source: ''
                  },
                  generator: false,
                  async: false,
                  id: null,
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    loc: {
                      start: { line: 1, col: 32 },
                      end: { line: 1, col: 34 },
                      source: ''
                    },
                    body: []
                  }
                },
                shorthand: false
              }
            ]
          }
        ]
      }
    }
  ]
}

tokens (24x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
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