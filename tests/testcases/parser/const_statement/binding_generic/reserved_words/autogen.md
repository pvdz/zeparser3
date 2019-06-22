# ZeParser parser test cases

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/const_statement/binding_generic/reserved_words/autogen.md

> :: const statement : binding generic
>
> ::> reserved words

These cases are automatically extrapolated and written to their own file.
Each case is applied to each test by simply replacing `#` with the actual case.

## Input

### Cases

> `````js
> break
> `````

> `````js
> case
> `````

> `````js
> catch
> `````

> `````js
> class
> `````

> `````js
> const
> `````

> `````js
> continue
> `````

> `````js
> debugger
> `````

> `````js
> default
> `````

> `````js
> delete
> `````

> `````js
> do
> `````

> `````js
> else
> `````

> `````js
> export
> `````

> `````js
> extends
> `````

> `````js
> finally
> `````

> `````js
> for
> `````

> `````js
> function
> `````

> `````js
> if
> `````

> `````js
> import
> `````

> `````js
> in
> `````

> `````js
> instanceof
> `````

> `````js
> new
> `````

> `````js
> return
> `````

> `````js
> super
> `````

> `````js
> switch
> `````

> `````js
> this
> `````

> `````js
> throw
> `````

> `````js
> try
> `````

> `````js
> typeof
> `````

> `````js
> var
> `````

> `````js
> void
> `````

> `````js
> while
> `````

> `````js
> with
> `````

> `````js
> null
> `````

> `````js
> true
> `````

> `````js
> false
> `````

> `````js
> enum
> `````

> `````js
> implements
> `````

> `````js
> package
> `````

> `````js
> protected
> `````

> `````js
> interface
> `````

> `````js
> private
> `````

> `````js
> public
> `````

> `````js
> let
> `````

> `````js
> static
> `````

> `````js
> async
> `````

> `````js
> await
> `````

### Templates

#### var statement

`````js
var # = x;
`````

#### for header

`````js
for (const # = x;;);
`````

#### import regular

`````js
import # as 'foo';
`````

#### import destruct

`````js
import {#} as 'foo';
`````

#### import alias destruct

`````js
import {x: #} as 'foo';
`````

#### export

export is only allowed in module code

`````js
export const # = 10;
`````

#### export

export is only allowed in module code

`````js
export var # = 10;
`````

#### function arg

`````js
function f(#) {}
`````

#### function object destructured arg

`````js
function f({#}) {}
`````

#### function object alias destructured arg

`````js
function f({abc: #}) {}
`````

#### function array destructured arg

`````js
function f([#]) {}
`````

#### catch clause

`````js
try {} catch (#) {}
`````

#### can be property

`````js
obj.#
`````
