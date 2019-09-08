# ZeParser parser test case

- Path: tests/testcases/unary_ops/generic_unary_tests_x0028GENERATEDx0029/batch_for_x0060typeofx0060/return_state_propagation/await_as_arg_in_async_func_arg_default_with_strict_mode_is_always_illegal.md

> :: unary ops : generic unary tests x0028GENERATEDx0029 : batch for x0060typeofx0060 : return state propagation
>
> ::> await as arg in async func arg default with strict mode is always illegal
>
> notorious case; this test ensures the "parsed await" flags properly propagate back down

## Input

`````js
async function f(){   async function g(x = typeof await x) { "use strict"; }  }
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Await is illegal as default arg value

async function f(){   async function g(x = typeof await x) { "use strict"; }  }
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

_Output same as sloppy mode._