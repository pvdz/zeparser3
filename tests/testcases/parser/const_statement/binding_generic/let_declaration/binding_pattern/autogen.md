# ZeParser parser test cases

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/const_statement/binding_generic/let_declaration/binding_pattern/autogen.md

> :: const statement : binding generic : let declaration
>
> ::> binding pattern

These cases are automatically extrapolated and written to their own file.
Each case is applied to each test by simply replacing `#` with the actual case.

## Input

### Cases

> `````js
> var
> `````

> `````js
> let
> `````

> `````js
> const
> `````

### Templates

#### base case array

`````js
# [x] = v
`````

#### base case obj

`````js
# {x} = v
`````

#### arr with parens

`````js
# [(x)] = v
`````

#### obj with parens

`````js
# {(x)} = v
`````

#### value that is a member expression

`````js
# {a: b.c} = v
`````

#### shorthand that is a member expression

`````js
# {a.b} = v
`````

#### key that is a member expression

`````js
# {a.b: c} = v
`````

#### key that is computed

`````js
# {[a]: c} = v
`````

#### member key that is computed

`````js
# {[a.b]: c} = v
`````

#### shorthand that is computed

`````js
# {[a]} = v
`````

#### member value on key that is computed

`````js
# {[a]: b.c} = v
`````
