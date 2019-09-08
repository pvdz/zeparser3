# ZeParser parser test case

- Path: tests/testcases/group_or_arrow/arrow/MUST_DESTRUCT_cases/array_without_nesting/assignment_to_a_property_on_something_that_MUST_be_a_pattern.md

> :: group or arrow : arrow : MUST DESTRUCT cases : array without nesting
>
> ::> assignment to a property on something that MUST be a pattern
>
> I believe the fail cases fail because https://tc39.github.io/ecma262/#prod-DestructuringAssignmentTarget
>
> (The object is treated as an expression, not a pattern, and so the {a=b} is an error as per CoverInitializedName in https://tc39.github.io/ecma262/#sec-object-initializer-static-semantics-early-errors )

## Input

`````js
[{x = y}].z = obj
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Found a struct that must be destructured but was not

[{x = y}].z = obj
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