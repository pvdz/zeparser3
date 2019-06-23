# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/classes/piggies_in_classes/await/wrapped_in_async_func/as_param_with_arg.md

> :: classes : piggies in classes : await : wrapped in async func
>
> ::> as param with arg

## Input

`````js
async function f() {   class x { foo(await y){} }   }
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Next ord should be 41 (`)`) but was 121 (curc: `y`, token: `y`)

async function f() {   class x { foo(await y){} }   }
                                           ^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

`````
throws: Parser error!
  Cannot use this name (await) as a variable name because: Await is illegal outside of async body with module goal

async function f() {   class x { foo(await y){} }   }
                                     ^------- error
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._