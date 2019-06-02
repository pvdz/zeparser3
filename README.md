# ZeParser 3

A 100% spec compliant JavaScript parser written in JavaScript, parsing ES6-ES9.

REPL: https://pvdz.github.io/zeparser3/tests/web/repl.html

The parser itself is currently feature complete but not ready for production (_some unhandled edge cases left, it seems, and I still need to run a fuzzer_).

Test262 is passing and there are thousands of additional unit tests to improve coverage.

Anything <= ES9 (ES2018) stage 4 should be supported by this parser, opted in by default (but you can request to parse in a specific version >=ES6). You can also opt-in to "annex B web compat" support.

## ES modules

Note that the files use `import` and `export` declarations and `import()`, which requires node 10+ or a cutting edge browser.

At the time of writing node requires the experimental `--experimental-modules` flag (rendering the hashbang useless).

It's a burden in some ways and nice in others. A prod build would not have any modules.

## Usage

```
# Tokenizer tests (broken at the moment):
./tests/zetokenizer.spec.mjs

# Tokenizer fuzz testing (broken atm)
./tests/fuzz_tokens.mjs

# Parser tests (this is the main test runner)
./tests/zeparser.spec.js
node --experimental-modules tests/zeparser.spec.mjs

# Show help
./tests/zeparser.spec.js -?
node --experimental-modules tests/zeparser.spec.mjs --help

# Run all tests and do NOT stop on failures
./tests/zeparser.spec.js -F
node --experimental-modules tests/zeparser.spec.mjs -F

# Test a particular input
./tests/zeparser.spec.js -i "some.input()"
node --experimental-modules tests/zeparser.spec.mjs -i "some.input()"

# Find out which tests execute a particular code branch in the parser
# Add `HIT()` to any branch you want to know about and this option
# will print all the test cases that called it. 
./tests/zeparser.spec.js -s
node --experimental-modules tests/zeparser.spec.mjs -s

# Do not run tests on builds (cuts down runtime to 1/3rd)
./tests/zeparser.spec.js -q
node --experimental-modules tests/zeparser.spec.mjs -q

# Run test262 tests (needs setup)
./tests/zeparser.spec.js -t
node --experimental-modules tests/zeparser.spec.mjs -t

# Generated combinator non-crash tests (broken)
./tests/generated.js
```

The REPL needs a very new browser due to es module syntax. You can find the REPL in [`tests/web/repl.html`](./tests/web/repl.js), github link: https://pvdz.github.io/zeparser3/tests/web/repl.html

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

# Perf testing

_(This is broken at the moment)_

Still setting up a more rigid way of perf testing but for now;

See [`tests/perf/parser/run.js`](tests/perf/parser/run.js) and update the location of the input file. I'm currently using [a 20mb webkit.js file](https://github.com/trevorlinton/webkit.js/blob/master/bin/webkit.bin.js) that is not part of this repo. You'll need to download it and update the link in the runner. Then you can build and run. 

```
./cli/build.js && ./tests/perf/parser/run.js
```

See above for configuring the build script. In the perf script you can adjust the call to the parser to tell it to retain tokens or not. Generating AST and retaining tokens will affect the parse times at large inputs.

# TODO

The parser itself supports ES5-ES9 but is not production ready;

- Harden the parser and find and fix more edge cases that currently pester the parser
- Add location to AST nodes
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
- Automatic test case updating (inline)
- Improved error messages with proper token locations and good semantics etc
