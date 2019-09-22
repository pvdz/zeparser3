#!/usr/bin/env bash

ACTION=''
ARG=''
MODE=''
ACORN=''
BABEL=''
EXTRA=''
ES=''

while [[ $# > 0 ]] ; do
  case "$1" in
    --help)
        echo "
ZeParser test runner help:

 Shortcuts for common test runner setups I use:

 i <code>      Run test with custom input, by default only runs sloppy script
 f <path>      Run a specific .md parser test file, by default only runs sloppy script
 F <path>      Run a specific file and consider its entire contents to be test input
 g             Regenerate _all_ auto generated files
 G             Autogenerate only files that don't already exist
 u             Run all test files and just write output
 U             Run all test files and force write output
 m             Run all tests and ask for update one-by-one
 s             Search for needles (call HIT() to place a needle and find all tests that hit them)
 t             Run test262 suite (only)
 a             Alias for ./t m --test-acorn, to verify ZeParser output against the Acorn AST
 b             Alias for ./t m --test-babel, to verify ZeParser output against the Babel AST
 fu            Test file and ask to update it if necessary
 fuzz          Run fuzzer
 --sloppy      Enable sloppy script mode, do not auto-enable other modes
 --web         Enable sloppy script with web compat / AnnexB mode, do not auto-enable other modes
 --strict      Enable strict script mode, do not auto-enable other modes
 --module      Enable module goal mode, do not auto-enable other modes
 --min         Only for f and i, for invalid input; minify the test case while keeping same error
 --min-printer Only for f and i, for inputs that cause bad printer behavior; minify the test case while keeping same error
 --no-printer  Do not run the zeprinter-step (helps with debugging in certain cases)
 --acorn       Run in Acorn compat mode
 --test-acorn  Also compare AST of test cases to Acorn output
 --babel       Run in Babel compat mode
 --test-babel  Also compare AST of test cases to Babel output
 --no-fatals   Do not abort test run for (test) any assertion errors
 6 ... 11      Parse according to the rules of this particular version of the spec
        "
      exit
      ;;

    i)
      # Custom input
      ACTION='-i'
      shift
      ARG=$1
      ;;
    f)
      # Target specific md test file
      ACTION='-f'
      shift
      ARG=$1
      ;;
    F)
      # Use (entire) contents of given file as input
      ACTION='-F'
      shift
      ARG=$1
      ;;
    g)
      # Regenerate anything from autogen files
      ACTION='-g'
      ;;
    G)
      # Regenerate only new files from autogen files
      ACTION='-G'
      ;;
    u)
      # Update all test files with their current output (fast)
      ACTION='-u'
      ;;
    U)
      # Force update all test files with their current output
      ACTION='-u --force-write'
      ;;
    m)
      # Run all files and ask for any test case that needs updating (slower)
      ACTION='-q -U'
      ;;
    s)
      # Add `HIT()` to zeparser src and this will report all inputs that trigger that call in a very concise list
      if [[ "${ACTION}" = "" ]]; then
          ACTION='-s'
      fi
      EXTRA='-s'
      ;;
    fu)
      # Update all test files with their current output (fast)
      ACTION='-U -f'
      shift
      ARG=$1
      ;;
    t)
      # Run all test262 tests
      ACTION='test262'
      ;;
    fuzz)
      # Run the fuzzer
      ACTION='fuzz'
      ;;

    a)
      # Alias for `m --test-acorn` because I'm lazy
      if [[ "${ACTION}" = "" ]]; then
          ACTION='-q -U'
      fi
      ACORN='--test-acorn'
      ;;
    b)
      # Alias for `m --test-acorn` because I'm lazy
      if [[ "${ACTION}" = "" ]]; then
          ACTION='-q -U'
      fi
      BABEL='--test-babel'
      ;;

    --sloppy)       MODE='--sloppy'       ;;
    --web)          MODE='--web'          ;;
    --strict)       MODE='--strict'       ;;
    --module)       MODE='--module'       ;;
    --acorn)        ACORN='--acorn'       ;;
    --test-acorn)   ACORN='--test-acorn'  ;;
    --babel)        BABEL='--babel'       ;;
    --test-babel)   BABEL='--test-babel'  ;;
    --min)          EXTRA='--min'         ;;
    --min-printer)  EXTRA='--min-printer' ;;
    --no-printer)   EXTRA='--no-printer'  ;;
    --no-fatals)    EXTRA='--no-fatals'   ;;

    6)  ES='--es6'  ;;
    7)  ES='--es7'  ;;
    8)  ES='--es8'  ;;
    9)  ES='--es9'  ;;
    10) ES='--es10' ;;
    11) ES='--es11' ;;

    *)
      echo "t: Unsupported action or option... \`$1\` Use --help for options"
      exit 1
      ;;
  esac
  shift
done


if [[ "${ACTION}" = "test262" ]]; then
  set -x
  node --experimental-modules tests/test262.mjs ${ACORN} ${BABEL}
  set +x
elif [[ "${ACTION}" = "fuzz" ]]; then
  set -x
  node --experimental-modules tests/fuzz/zefuzz.mjs ${EXTRA}
  set +x
else
  set -x
  node --experimental-modules --max-old-space-size=8192 tests/zeparser.spec.mjs ${ACTION} "${ARG}" ${MODE} ${ACORN} ${BABEL} ${EXTRA} ${ES}
  set +x
fi
