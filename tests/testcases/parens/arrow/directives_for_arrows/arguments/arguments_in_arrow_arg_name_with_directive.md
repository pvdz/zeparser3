# ZeParser parser test case

- Path: tests/testcases/parens/arrow/directives_for_arrows/arguments/arguments_in_arrow_arg_name_with_directive.md

> :: parens : arrow : directives for arrows : arguments
>
> ::> arguments in arrow arg name with directive

## Input


`````js
(arguments) => {"use strict";}
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Can only declare use strict if func params are "simple"

(arguments) => {"use strict";}
                             ^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  The left hand side of the arrow is not destructible so arrow is illegal

(arguments) => {"use strict";}
            ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._