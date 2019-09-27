import {COLLECT_TOKENS_SOLID, GOAL_MODULE, GOAL_SCRIPT} from "../src/zetokenizer.mjs";

function testZeParser(zeparser, code, testVariant, enableAnnexb) {
  return zeparser(
    code,
    testVariant === 'module' ? GOAL_MODULE : GOAL_SCRIPT,
    COLLECT_TOKENS_SOLID,
    {
      strictMode: testVariant === 'strict',
      webCompat: enableAnnexb || testVariant === 'web',
      // targetEsVersion: tob.inputOptions.es,
      babelCompat: false,
      acornCompat: false,

      $log: () => {},
      $warn: () => {},
      $error: () => {},
    },
  );
}

export {
  testZeParser,
};
