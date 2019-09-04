Error.stackTraceLimit = Infinity;
const clog = console.log;
const wlog = console.warn;
const elog = console.error;
let logs = [];
console.log = (...args) => {
  clog(...args);
  logs.push('LOG '+args.join(' '));
};
console.warn= (...args) => {
  wlog(...args);
  logs.push('WRN '+args.join(' '));
};
console.error= (...args) => {
  elog(...args);
  logs.push('ERR ' + args.join('ERR '));
};

import * as $ from '../../src/utils.mjs';
import ZeTokenizer, * as Tok from '../../src/zetokenizer.mjs';
import ZeParser, * as Par from '../../src/zeparser.mjs';

console.log('loaded...');
window.ZeTokenizer = ZeTokenizer;
window.ZeParser = ZeParser;
window.$ = $;

window.onerror = (msg, url, lineNo, columnNo, error) => {
  stderr.value = error.stack+'\n\n-------------\n\n' + stderr.value + '\n\n' + msg;
};

ta_input.value = localStorage.getItem('ZeParser3.repl.input') || ta_input.value;

if (localStorage.getItem('ZeParser3.repl.options')) {
  try {
    localStorage.getItem('ZeParser3.repl.options')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.split(' '))
      .map(([q, checked]) => console.log(q, checked) || (checked === 'true') && (document.querySelector(q).checked = true));
  } catch (e) {
    localStorage.removeItem('ZeParser3.repl.options');
  }
}


function pret(s, isjson) {
  // Note: this is prettier 0.4 or something... it's good enough for our purpose
  try {
    let r = prettier.format(isjson ? '+' + s : s, {
      tabWidth: 2,
      printWidth: 100,
      singleQuote: true,
      trailingComma: true,
      bracketSpacing: false,
      quoteProps: 'as-needed',
    });
    if (isjson) r = r.slice(1, -1);
    return r;
  } catch (e) {
    return s;
  }
}

function reflectPass() {
  reflectResult('#e6ffe6', 'initial', 'initial', 'initial');
}
function reflectFail() {
  reflectResult('#EEC7C1', 'initial', '#eee', '#555');
}
function reflectResult(inpBgColor, inpColor, otherBgColor, otherColor) {
  ta_input.style.backgroundColor = inpBgColor;
  ta_ast.style.backgroundColor = otherBgColor;
  ta_ast.style.color = otherColor;
  ta_output.style.backgroundColor = otherBgColor;
  ta_output.style.color = otherColor;
}

const update = e => {
  console.clear();
  stderr.value = '';
  reflectFail(); // should not be visible (?)

  let input = ta_input.value;

  logs = [];
  let ast = {};
  let tokens = [];

  if (input) localStorage.setItem('ZeParser3.repl.input', input);
  else localStorage.removeItem('ZeParser3.repl.input');

  // Store the settings in an easy to thaw way
  localStorage.setItem(
    'ZeParser3.repl.options',
    [
      ...document.querySelectorAll('.box.top-left input')
    ]
      .map(e => `[name="${e.name}"][value="${e.value}" ${!!e.checked}`)
      .join(',')
  );

  let out;
  let threw = 'unknown';
  let selectedMode = document.querySelector('input[name=mode]:checked').value;
  let selectedAst = document.querySelector('input[name=ast]:checked').value;
  let version = +document.querySelector('input[name=version]:checked').value;
  try {
    console.log('crunching (mode=', selectedMode, ', version=', version, '):', '\n```\n' + pret(input) + '\n```');

    let mode = selectedMode === 'module' ? Tok.GOAL_MODULE : Tok.GOAL_SCRIPT;

    out = ZeParser(input, mode, Tok.COLLECT_TOKENS_ALL, {
      strictMode: selectedMode === 'strict',
      webCompat: selectedMode === 'webcompat',
      babelCompat: selectedAst === 'babel',
      astRoot: ast,
      tokenStorage: tokens,
      // getTokenizer: tok => tokenizer = tok,
      targetEsVersion: version,
    });
    threw = false;
  } finally {
    // not try/catching here means you can properly debug it...
    if (threw) console.error('An error was thrown. Expecting window.onerror to catch it and amend the trace');
    stderr.value = logs.map(s => s + '\n').join('');

    scheduleOverall(input, selectedMode, version);
  }
  reflectPass();

  // Note: shipping a very old version of Prettier. Not very important for the purpose of printing an AST.
  window.ta_ast.value = pret(JSON.stringify(ast.root), true);
  window.ta_output.value = tokens.map(JSON.stringify).join('\n')
  console.log(['out:', out, 'ast:', ast]);
};

let overallBouncer = 0;
function scheduleOverall(input, currentMode, currentVersion) {
  clearTimeout(overallBouncer);
  overallBouncer = setTimeout(() => {
    // Update mini-menu indicators, set their class name to `mode_selector true` or `mode_selector false`
    $sloppy_mode.parentNode.className = 'mode_selector ' + silentPassFail(input, 'sloppy', currentVersion);
    $compat_mode.parentNode.className = 'mode_selector ' + silentPassFail(input, 'webcompat', currentVersion);
    $strict_mode.parentNode.className = 'mode_selector ' + silentPassFail(input, 'strict', currentVersion);
    $module_mode.parentNode.className = 'mode_selector ' + silentPassFail(input, 'module', currentVersion);

    $ver_es6.parentNode.className = 'mode_selector ' + silentPassFail(input, currentMode, 6);
    $ver_es7.parentNode.className = 'mode_selector ' + silentPassFail(input, currentMode, 7);
    $ver_es8.parentNode.className = 'mode_selector ' + silentPassFail(input, currentMode, 8);
    $ver_es9.parentNode.className = 'mode_selector ' + silentPassFail(input, currentMode, 9);
  }, 100);
}

function silentPassFail(code, mode/*:sloppy | webcompat | strict | module*/, version) {
  let threw = false;
  try {
    ZeParser(code, mode === 'module' ? Tok.GOAL_MODULE : Tok.GOAL_SCRIPT, Tok.COLLECT_TOKENS_NONE, {
      strictMode: mode === 'strict',
      webCompat: mode === 'webcompat',
      targetEsVersion: version,
      // Silence all output
      $log: () => {},
      $warn: () => {},
      $error: () => {},
    });
    threw = true;
  } catch (e) {
    // console.warn('the error was', e)
  }
  return threw;
}

[
  window.ta_input,
  ...document.querySelectorAll('.box.top-left input')
].forEach(e => e.onchange = e.onkeyup = update);


update();
