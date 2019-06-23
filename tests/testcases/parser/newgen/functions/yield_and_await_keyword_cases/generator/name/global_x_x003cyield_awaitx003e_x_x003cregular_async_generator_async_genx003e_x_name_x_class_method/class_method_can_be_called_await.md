# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/functions/yield_and_await_keyword_cases/generator/name/global_x_x003cyield_awaitx003e_x_x003cregular_async_generator_async_genx003e_x_name_x_class_method/class_method_can_be_called_await.md

> :: functions : yield and await keyword cases : generator : name : global x <yield, await> x <regular, async, generator, async gen> x name x class method
>
> ::> class method can be called await

## Input

`````js
function *as(){ class A {await() {}} }
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 38 } },
  body: [
    {
      type: 'FunctionDeclaration',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 38 },
        source: ''
      },
      generator: true,
      async: false,
      id: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 10 },
          end: { line: 1, col: 10 },
          source: ''
        },
        name: 'as'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc: {
          start: { line: 1, col: 14 },
          end: { line: 1, col: 38 },
          source: ''
        },
        body: [
          {
            type: 'ClassDeclaration',
            loc: {
              start: { line: 1, col: 16 },
              end: { line: 1, col: 37 },
              source: ''
            },
            id: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 22 },
                end: { line: 1, col: 22 },
                source: ''
              },
              name: 'A'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              loc: {
                start: { line: 1, col: 24 },
                end: { line: 1, col: 37 },
                source: ''
              },
              body: [
                {
                  type: 'MethodDefinition',
                  loc: {
                    start: { line: 1, col: 25 },
                    end: { line: 1, col: 35 },
                    source: ''
                  },
                  key: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 25 },
                      end: { line: 1, col: 30 },
                      source: ''
                    },
                    name: 'await'
                  },
                  static: false,
                  computed: false,
                  kind: 'method',
                  value: {
                    type: 'FunctionExpression',
                    loc: {
                      start: { line: 1, col: 25 },
                      end: { line: 1, col: 35 },
                      source: ''
                    },
                    generator: false,
                    async: false,
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      loc: {
                        start: { line: 1, col: 33 },
                        end: { line: 1, col: 35 },
                        source: ''
                      },
                      body: []
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
}

tokens (17x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR
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