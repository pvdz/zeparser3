# ZeParser parser test case

- Path: tests/testcases/objects/keywords_should_not_parse_as_regular_idents_in_awkward_places/x005bx005bxx005dx002elengthx005d_in_object_as_shorthand.md

> :: objects : keywords should not parse as regular idents in awkward places
>
> ::> x005bx005bxx005dx002elengthx005d in object as shorthand

## Input

`````js
({[x].length});
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  A computed property name must be followed by a colon or paren

({[x].length});
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