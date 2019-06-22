# ZeParser parser test cases

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/parens/arrow/keywords_ok_in_group_not_allowed_in_arrow_header/autogen.md

> :: parens : arrow
>
> ::> keywords ok in group not allowed in arrow header

These cases are automatically extrapolated and written to their own file.
Each case is applied to each test by simply replacing `#` with the actual case.

## Input

### Cases

> `````js
> true
> `````

> `````js
> false
> `````

> `````js
> null
> `````

> `````js
> this
> `````

### Templates

#### arrow

`````js
(#) => x
`````

#### group

`````js
(#)
`````

#### assignment

`````js
(#) = x
`````
