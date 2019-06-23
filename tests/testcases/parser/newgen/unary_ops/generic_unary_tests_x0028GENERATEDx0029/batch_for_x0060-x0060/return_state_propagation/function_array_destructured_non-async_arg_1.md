# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/unary_ops/generic_unary_tests_x0028GENERATEDx0029/batch_for_x0060-x0060/return_state_propagation/function_array_destructured_non-async_arg_1.md

> :: unary ops : generic unary tests (GENERATED) : batch for `-` : return state propagation
>
> ::> function array destructured non-async arg 1

## Input

`````js
async function f(){   function fh([- await x]) { }   }
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Next ord should be 93 (`]`) but was 120 (curc: `x`, token: `x`)

async function f(){   function fh([- await x]) { }   }
                                           ^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

`````
throws: Parser error!
  Cannot use `await` as var when goal=module but found `await` outside an async function

async function f(){   function fh([- await x]) { }   }
                                           ^------- error
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._