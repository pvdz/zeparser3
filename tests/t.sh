#!/usr/bin/env bash

ACTION='--help'
ARG=''
MODE=''
BABEL=''
MIN=''
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
 m             Run all tests and ask for update one-by-one
 t             Run test262 suite (only)
 b             Alias for `./t m --babel-test`, to verify ZeParser output against the Babel AST
 fuzz          Run fuzzer
 --sloppy      Enable sloppy script mode, do not auto-enable other modes
 --web         Enable sloppy script with web compat / AnnexB mode, do not auto-enable other modes
 --strict      Enable strict script mode, do not auto-enable other modes
 --module      Enable module goal mode, do not auto-enable other modes
 --min         Only for f and i, for invalid input; minify the test case while keeping same error
 --babel       Run in Babel compat mode
 --babel-test  Also compare AST of test cases to Babel output
 --min         Brute force shorten given input that causes an error while maintaining the same error message
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
    m)
      # Run all files and ask for any test case that needs updating (slower)
      ACTION='-q -U'
      ;;
    t)
      # Run all test262 tests
      ACTION='test262'
      ;;
    fuzz)
      # Run the fuzzer
      ACTION='fuzz'
      ;;

    b)
      # Alias for `m --babel-test` because I'm lazy
      ACTION='-q -U'
      BABEL='--babel-test'
      ;;

    --sloppy)       MODE='--sloppy'       ;;
    --web)          MODE='--web'          ;;
    --strict)       MODE='--strict'       ;;
    --module)       MODE='--module'       ;;
    --babel)        BABEL='--babel'       ;;
    --babel-test)   BABEL='--babel-test'  ;;
    --min)          MIN='--min'           ;;

    6)
      ES='--es6'
      ;;
    7)
      ES='--es7'
      ;;
    8)
      ES='--es8'
      ;;
    9)
      ES='--es9'
      ;;
    10)
      ES='--es10'
      ;;
    11)
      ES='--es11'
      ;;

    *)
      echo "t: Unsupported action or option... \`$1\` Use --help for options"
      exit 1
      ;;
  esac
  shift
done


if [[ "${ACTION}" = "test262" ]]; then
  set -x
  node --experimental-modules tests/test262.mjs
  set +x
elif [[ "${ACTION}" = "fuzz" ]]; then
  set -x
  node --experimental-modules tests/fuzz/zefuzz.mjs
  set +x
else
  set -x
  node --experimental-modules --max-old-space-size=8192 tests/zeparser.spec.mjs ${ACTION} "${ARG}" ${MODE} ${BABEL} ${MIN} ${ES}
  set +x
fi
