# ZeParser parser test cases

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/const_statement/binding_generic/let_declaration/binding_generic/rest/invalid_obj_rest/autogen.md

> :: const statement : binding generic : let declaration : binding generic : rest
>
> ::> invalid obj rest

These cases are automatically extrapolated and written to their own file.
Each case is applied to each test by simply replacing `#` with the actual case.

## Input

### Cases

> `````js
> let {...obj1,} = foo
> `````

> `````js
> let {...obj1,a} = foo
> `````

> `````js
> let {...obj1,...obj2} = foo
> `````

> `````js
> let {...(obj)} = foo
> `````

> `````js
> let {...(a,b)} = foo
> `````

> `````js
> let {...{a,b}} = foo
> `````

> `````js
> let {...[a,b]} = foo
> `````

### Templates

#### case

`````js
#
`````
