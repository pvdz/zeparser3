# ZeParser 3

A 100% spec compliant JavaScript parser written in JavaScript, parsing ES6-ES11.

REPL: https://pvdz.github.io/zeparser3/tests/web/repl.html

The parser itself is currently feature complete but not ready for production (_some unhandled edge cases left, it seems, and I still need to run a fuzzer_).

Test262 is passing and there are thousands of additional unit tests to improve coverage.

Anything <= ES11 (ES2020) stage 4 should be supported by this parser, opted in by default (but you can request to parse in a specific version >=ES6). You can also opt-in to "annex B web compat" support.

## ES modules

Note that the files use `import` and `export` declarations and `import()`, which requires node 10+ or a cutting edge browser.

At the time of writing node requires the experimental `--experimental-modules` flag (rendering the hashbang useless).

It's a burden in some ways and nice in others. A prod build would not have any modules.

## Usage

```
import ZeParser from 'src/zeparser.mjs';
const {
  ast,                 // estree compatible AST
  tokens,              // array of numbers (see ZeTokenier)
  tokenCountSolid,     // number of non-whitespace tokens
  tokenCountAny,       // number of tokens of any kind
} = ZeParser.parse(
  inputCode,           // string
  goal,                // true=module, false=script
  collectTokens,       // 0=no,1=non-whitespace,2=all
  {
    // Apply Annex B rules? (Only works in sloppy mode)
    webCompat = true,
    // Start parsing as if in strict mode? (Works with script goal)
    strictMode = false,
    // Pass on a reference that will be used as the AST root
    astRoot = null,
    // Pass on a reference to store the tokens
    tokenStorage = [],
    // Callback to receive the tokenizer instance once its created
    getTokenizer = null,
    // You use this to parse `eval` code
    allowGlobalReturn = false,
    // Target a very specific ecmascript version (like, reject async)
    targetEsVersion = lastVersion, // (currently es11)
    // Leave built up scope information in the ASTs (good luck)
    exposeScopes = false,
    // Assign each node a unique incremental id
    astUids = false,
    // When false and input is over 100 bytes, it will trunc the input
    fullErrorContext = false,
    // You can override the logging functions to catch or squash all output
    $log = console.log,
    $warn = console.warn,
    $error = console.error,
    // Value ot use for the `source` field of each `loc` object
    sourceField = '',
  }
);
```

## Testing
```
# Run entire parser test suite and update any changes inline
./tests/zeparser.spec.js -u
node --experimental-modules tests/zeparser.spec.mjs
```

See [`tests/testcases/parser/README.md`](./tests/testcases/parser/README.md) for details on test cases.

```
# Show help
./tests/zeparser.spec.js -?
node --experimental-modules tests/zeparser.spec.mjs --help

# Run all tests and stop on first failure
./tests/zeparser.spec.js -q
node --experimental-modules tests/zeparser.spec.mjs -q

# Auto update all tests with current output (inline, use git to diff)
./tests/zeparser.spec.js -u
node --experimental-modules tests/zeparser.spec.mjs -u

# Run through all tests and prompt for inline update of each test file
./tests/zeparser.spec.js -u
node --experimental-modules tests/zeparser.spec.mjs -q -U

# Test a particular input
./tests/zeparser.spec.js -i "some.input()"
node --experimental-modules tests/zeparser.spec.mjs -i "some.input()"

# Find out which tests execute a particular code branch in the parser
# Add `HIT()` to any part of the code in src
# Running the following will print all the test cases that called it
# Works together with `-i`, too
./tests/zeparser.spec.js -s
node --experimental-modules tests/zeparser.spec.mjs -s

# Run test262 tests (needs setup)
./tests/zeparser.spec.js -t
node --experimental-modules tests/zeparser.spec.mjs -t
```

You can find the REPL in [`tests/web/repl.html`](./tests/web/repl.js), github link: https://pvdz.github.io/zeparser3/tests/web/repl.html

_The REPL needs a very new browser due to es module syntax._

# Building

While the parser runs perfectly fine in dev mode it will be a bit slow. To generate a build run this in the project root:

```
mkdir build
./cli/build.js
```

(For now you'll need `node --experimental-modules cli/build.mjs`)

The [build script](cli/build.js):

- will remove non-assert dev artifacts
- can remove inline asserts (lines that start with `ASSERT`)
- can remove all the AST generation from the build (lines that start with `AST`)

You can toggle asserts and comments at the top of the build file.

The script will write two files:

```
build/build_w_ast.js
biuld/build_no_ast.js
```

When available these are picked up automatically by the test runner unless you use `-q`.

The no-AST build is almost as perfect as the regular build except for certain validation cases where it requires the AST:

- Binary op after arrow with block body (`()=>{}*x` is illegal)
- Regular expression on new line after arrow with block body (`()=>{} \n /foo/g`, prohibited by ASI rules and can't be a division)
- Update operator anything that's writable but not a valid var or member expression (`++[]`)

# Testing

Each test is individually encapsulated in an `.md` file in `tests/testcases/parser/**`. This file will contain the input code and the output as expected for sloppy mode, strict mode (script goal), module goal, and web compat mode (only works in sloppy mode, script goal).

If a run passes then the AST and types of tokens are printed in the output. Otherwise the error message and a pointer to where the error occurred are listed.

The files can be auto-updated with the `-u` or `-U` flag of the test runner. This makes it easy to update something in the parser and use SCM to confirm whether anything changed, and if so what.

There are also `autogen.md` files, which generate a bunch of combinatory tests (`-g` or `-G`), similar to the other tests.

To create a new test simply add a new file, start it with `@`, a description, a line with only `###` and the rest is considered the test case. When you run the test runner this file will automatically be converted to a proper test case.

# Perf testing

_(This is broken at the moment)_

Still setting up a more rigid way of perf testing but for now;

See [`tests/perf/parser/run.js`](tests/perf/parser/run.js) and update the location of the input file. I'm currently using [a 20mb webkit.js file](https://github.com/trevorlinton/webkit.js/blob/master/bin/webkit.bin.js) that is not part of this repo. You'll need to download it and update the link in the runner. Then you can build and run. 

```
./cli/build.js && ./tests/perf/parser/run.js
```

See above for configuring the build script. In the perf script you can adjust the call to the parser to tell it to retain tokens or not. Generating AST and retaining tokens will affect the parse times at large inputs.

# TODO

The parser itself supports ES5-ES11 but is not production ready;

- Harden the parser and find and fix more edge cases that currently pester the parser
  - Regular expression edge cases are tricky, especially web compat ones
- Setup a test running that confirms AST nodes against other engines (Babel/Flow/etc)
- Wire up the fuzzer
- Tighter integration between parser and tokenizer of pre-known tokens
  - This ties into enforcing reserved keyword checks
- Make build dir automatically
- Work on perf, the fun stuff
  - Add better benchmarking
  - Do perf traces to find hot code
  - Make sure the parser works without AST building
- Improve and visualize test coverage
- Add a way to put input test cases inline and assert they reach that point. Helps with understanding why something is doing what.
- Find out what the memory footprint is like, how much can it parse before bailing
- Improved error messages with proper token locations and good semantics etc
