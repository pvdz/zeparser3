# ZeParser parser test case

- Path: tests/testcases/classes/piggies_in_classes/await/unwrapped/as_param_with_arg.md

> :: classes : piggies in classes : await : unwrapped
>
> ::> as param with arg

## Input

`````js
class x { foo(await y){} }
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

class x { foo(await y){} }
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

class x { foo(await y){} }
              ^------- error
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._