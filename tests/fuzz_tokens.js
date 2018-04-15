//import ZeTokenizer, {
let { default: ZeTokenizer,
  $ASI,
  $COMMENT,
  $COMMENT_SINGLE,
  $COMMENT_MULTI,
  $CRLF,
  $EOF,
  $ERROR,
  $IDENT,
  $NL,
  $NUMBER,
  $NUMBER_HEX,
  $NUMBER_DEC,
  $NUMBER_BIN,
  $NUMBER_OCT,
  $NUMBER_OLD,
  $PUNCTUATOR,
  $REGEX,
  $REGEXU,
  $SPACE,
  $STRING,
  $STRING_DOUBLE,
  $STRING_SINGLE,
  $TAB,
  $TICK_BODY,
  $TICK_HEAD,
  $TICK_PURE,
  $TICK_TAIL,
  $WHITE,

  debug_toktype,
  } = require('../src/zetokenizer'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from '../src/zetokenizer';

function anychr() {
  return String.fromCharCode(rng(0, 0xffff));
}
function ascii() {
  return String.fromCharCode(rng(30, 126));
}
function except(from, ex) {
  let c;
  do {
    c = from();
  } while (ex.indexOf(c) >= 0);
  return c;
}

let pieces = {
  comment: {
    single: {
      head: '//',
      body: [except.bind(undefined, ascii, '\n\r\u2028\u2029'), except.bind(undefined, ascii, '\n\r\u2028\u2029'), except.bind(undefined, anychr, '\n\r\u2028\u2029')],
      tail: '',
      token: $COMMENT_SINGLE,
      evallable: true,
    },
    multi: {
      head: '/*',
      body: [except.bind(undefined, ascii, '/'), except.bind(undefined, ascii, '/'), except.bind(undefined, anychr, '/'), '\n', '\r\n'],
      tail: '*/',
      token: $COMMENT_MULTI,
      evallable: true,
    },
  },
  string: {
    single: {
      head: `'`,
      body: [
        _ => except(ascii, `'\\\n\r`), _ => except(ascii, `'\\\n\r`), _ => except(ascii, `'\\\n\r`), _ => except(ascii, `'\\\n\r`),
        _ => except(anychr, `'\\\n\r\u2028\u2029`),
        [
          _ => R(_ => '\\u' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body), `\\u000A\\u000D\\u2028\\u2029`),
          _ => R(_ => '\\u{' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
          _ => R(_ => '\\u{0' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
          _ => R(_ => '\\u{00' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
          _ => R(_ => '\\u{000' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
          _ => R(_ => '\\u{0000' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
        ],
        ['\\\n', '\\\r', '\\\r\n', '\\\\u000A', '\\\\u000D', '\\\\u000D\\u000A', '\\\\u000D\\n', '\\\\u2028', '\\\\u2029', '\\t', `\\'`, '\\"', '\\`', '${', '\\\\'],
      ],
      tail: `'`,
      token: $STRING_SINGLE,
      evallable: true,
    },
    double: {
      head: `"`,
      body: [
        _ => except(ascii, `"\\\n\r`), _ => except(ascii, `"\\\n\r`), _ => except(ascii, `"\\\n\r`), _ => except(ascii, `"\\\n\r`),
        _ => except(anychr, `"\\\n\r\u2028\u2029`),
        [
          _ => R(_ => '\\u' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body), `\\u000A\\u000D\\u2028\\u2029`),
          _ => R(_ => '\\u{' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
          _ => R(_ => '\\u{0' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
          _ => R(_ => '\\u{00' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
          _ => R(_ => '\\u{000' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
          _ => R(_ => '\\u{0000' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
        ],
        ['\\\n', '\\\r', '\\\r\n', '\\\\u000A', '\\\\u000D', '\\\\u000D\\u000A', '\\\\u000D\\n', '\\\\u2028', '\\\\u2029', '\\t', `\\'`, '\\"', '\\`', '${', '\\\\'],
      ],
      tail: `"`,
      token: $STRING_DOUBLE,
      evallable: true,
    },
  },
  number: {
    dec: {
      int: {
        head: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        body: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        tail: [],
        token: $NUMBER_DEC,
        evallable: true,
      },
      dot: {
        head: '.',
        body: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        tail: [],
        token: $NUMBER_DEC,
        evallable: true,
      },
      exp: {
        head: ['0e', '1E', '5e+', '6e+', '8E-', '9E+'],
        body: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        tail: [],
        token: $NUMBER_DEC,
        evallable: true,
      },
      all: {
        head: _ => generate(pieces.number.dec.int) + '.' + generate(pieces.number.dec.int) + r(['e', 'E']) + r(['+', '-', '']) + generate(pieces.number.dec.int),
        body: [],
        tail: [],
        token: $NUMBER_DEC,
        evallable: true,
      },
    },
    hex: {
      head: ['0x', '0X'],
      body: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F'],
      tail: [],
      token: $NUMBER_HEX,
      evallable: true,
    },
    bin: {
      head: ['0b', '0B'],
      body: ['0', '1'],
      tail: [],
      token: $NUMBER_BIN,
      evallable: true,
    },
    oct: {
      head: ['0o', '0O'],
      body: ['0', '1', '2', '3', '4', '5', '6', '7'],
      tail: [],
      token: $NUMBER_OCT,
      evallable: true,
    },
  },
  template: {
    head: ['`', '}'],
    body: [
      _ => except(ascii, '`\\$'), _ => except(ascii, '`\\$'), _ => except(ascii, '`\\$'), _ => except(ascii, '`\\$'),
      _ => except(anychr, '`\\$'),
      [
        _ => '\\u' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body),
        _ => '\\u{' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}',
        _ => '\\u{0' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}',
        _ => '\\u{00' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}',
        _ => '\\u{000' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}',
        _ => '\\u{0000' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}',
      ],
      ['\\\n', '\\\r', '\\\r\n', '\\\\u000A', '\\\\u000D', '\\\\u000D\\u000A', '\\\\u000D\\n', '\\\\u2028', '\\\\u2029', '\\t', `\\'`, '\\"', '\\`', '\\\\'],
    ],
    tail: ['`', '${'],
    token: (generated) => ({
      '``': $TICK_PURE,
      '`{': $TICK_HEAD,
      '}{': $TICK_BODY,
      '}`': $TICK_TAIL,
    }[generated[0] + generated[generated.length - 1]]),
    fromTemplate: true,
    evallable: false,
  },
  ident: {
    head: [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      '$', '_',
    ],
    body: [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '$', '_', ' ',
      ['\\u0070', '\\u{71}', '\\u{072}', '\\u{0073}', '\\u{00074}', '\\u{000075}', '\\u{0000076}'],
    ],
    tail: [],
    token: $IDENT,
  },
  regex: {
    sloppy: {
      head: '/',
      body: [
        _ => except(ascii, '/\\[](){}+*?\n\r|'),
        _ => except(anychr, '/\\[](){}+*?\n\r\u2028\u2029|'),
        ['\\uD83D\\uDE07', '\\uD83D', '\\uDE07'],
        _ => '(' + r(['', '?:', '?=', '?!']) + r(pieces.regex.sloppy.body) + r(['', '?', '+', '*', '??', '+?', '*?', '{1}', '{2}?']) + ')',
        [
          _ => '[' + r(['', '^']) + except(ascii, '\n\r]\\') + except(ascii, '\n\r]\\') + ']',
          _ => '[' + r(['', '^']) + String.fromCharCode(rng(0x10, 0x2d)) + '-' + String.fromCharCode(rng(0x2d, 0x50)) + ']',
        ]
      ],
      tail: _ => '/' + r(['', 'g', 'i', 'm', 'y']),
      token: $REGEX,
      evallable: true,
      slashIsRegex: true,
    },
    strict: {
      head: '/',
      body: [
        _ => except(ascii, '/\\[](){}+*?\n\r|'),
        _ => except(anychr, '/\\[](){}+*?\n\r\u2028\u2029|'),
        ['\\uD83D\\uDE07', '\\uD83D', '\\uDE07'],
        _ => '(' + r(['', '?:', '?=', '?!']) + r(pieces.regex.sloppy.body) + r(['', '?', '+', '*', '??', '+?', '*?', '{1}', '{2}?']) + ')',
        [
          _ => '[' + r(['', '^']) + except(ascii, '\n\r]\\') + except(ascii, '\n\r]\\') + ']',
          _ => '[' + r(['', '^']) + String.fromCharCode(rng(0x10, 0x2d)) + '-' + String.fromCharCode(rng(0x2d, 0x50)) + ']',
        ]
      ],
      tail: _ => '/u' + r(['', 'g', 'i', 'm', 'y']),
      token: $REGEXU,
      evallable: true,
      slashIsRegex: true,
    },
  },
  error: {
    string: {
      single: {
        head: `'`,
        body: [
          _ => except(ascii, `'`), _ => except(ascii, `'`), _ => except(ascii, `'`),
          [
            // bad
            _ => '\\u' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body),
            _ => _ => '\\u{ffffff' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}',
            _ => R(_ => '\\u{0' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body), `\\u000A\\u000D\\u2028\\u2029`),
            // good
            _ => R(_ => '\\u' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body), `\\u000A\\u000D\\u2028\\u2029`),
            _ => R(_ => '\\u{' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
            _ => R(_ => '\\u{0' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
            _ => R(_ => '\\u{00' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
            _ => R(_ => '\\u{000' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
            _ => R(_ => '\\u{0000' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
          ],
        ],
        tail: ['', '\n', '', '\n', '', '\n', except(ascii, `'`), '\\'],
        token: $ERROR,
        evallable: true,
      },
      double: {
        head: `"`,
        body: [
          _ => except(ascii, `"`), _ => except(ascii, `"`), _ => except(ascii, `"`),
          [
            // bad
            _ => '\\u' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body),
            _ => _ => '\\u{ffffff' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}',
            _ => R(_ => '\\u{0' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body), `\\u000A\\u000D\\u2028\\u2029`),
            // good
            _ => R(_ => '\\u' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body), `\\u000A\\u000D\\u2028\\u2029`),
            _ => R(_ => '\\u{' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
            _ => R(_ => '\\u{0' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
            _ => R(_ => '\\u{00' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
            _ => R(_ => '\\u{000' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
            _ => R(_ => '\\u{0000' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}', `\\u000A\\u000D\\u2028\\u2029`),
          ],
        ],
        tail: ['', '\n', '', '\n', '', '\n', except(ascii, `"`), '\\'],
        token: $ERROR,
        evallable: true,
      },
    },
    template: {
      head: ['`', '}'],
      body: [
        _ => except(ascii, '`\\$'), _ => except(ascii, '`\\$'), _ => except(ascii, '`\\$'), _ => except(ascii, '`\\$'),
        _ => except(anychr, '`\\$'),
        [
          // bad
          _ => '\\u' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body),
          _ => _ => '\\u{ffffff' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}',
          _ => R(_ => '\\u{0' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body), `\\u000A\\u000D\\u2028\\u2029`),
          // good
          _ => '\\u' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body),
          _ => '\\u{' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}',
          _ => '\\u{0' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}',
          _ => '\\u{00' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}',
          _ => '\\u{000' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}',
          _ => '\\u{0000' + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + r(pieces.number.hex.body) + '}',
        ],
      ],
        tail: ['', '\n', '', '\n', '', '\n', except(ascii, '`'), '\\'],
      token: $ERROR,
      fromTemplate: true,
      evallable: false,
    },
    regex: {
      sloppy: {
        head: '/',
        body: [
          _ => except(ascii, '/\\*'),
          ['\\uD83D\\uDE07', '\\uD83D', '\\uDE07'],
          _ => '(' + r(['', '?:', '?=', '?!', '?']) + r(pieces.regex.sloppy.body) + r(['', '?', '+', '*', '??', '+?', '*?', '{1}', '{2}?']) + ')',
          [
            _ => '[' + r(['', '^']) + except(ascii, '\n\r]\\') + except(ascii, '\n\r]\\') + ['', ']'],
            _ => '[' + r(['', '^']) + String.fromCharCode(rng(0, 0x50)) + '-' + String.fromCharCode(rng(0, 0x50)) + ']',
          ]
        ],
        tail: ['', '\n', '', '\n', _ => '/gg' + r(['', 'g', 'i', 'm', 'y']), except(ascii, '/'), '\\'],
        token: $ERROR,
        evallable: true,
        slashIsRegex: true,
      },
      strict: {
        head: '/',
        body: [
          _ => except(ascii, '/\\*'),
          ['\\uD83D\\uDE07', '\\uD83D', '\\uDE07'],
          _ => '(' + r(['', '?:', '?=', '?!', '?']) + r(pieces.regex.sloppy.body) + r(['', '?', '+', '*', '??', '+?', '*?', '{1}', '{2}?']) + ')',
          [
            _ => '[' + r(['', '^']) + except(ascii, '\n\r]\\') + except(ascii, '\n\r]\\') + ['', ']'],
            _ => '[' + r(['', '^']) + String.fromCharCode(rng(0, 0x50)) + '-' + String.fromCharCode(rng(0, 0x50)) + ']',
          ]
        ],
        tail: ['', '\n', '', '\n', _ => '/uu' + r(['', 'g', 'i', 'm', 'y']), except(ascii, '/'), '\\'],
        token: $ERROR,
        evallable: true,
        slashIsRegex: true,
      },
    },
  },
};

function rng(max, min) {
  min |= 0;
  return min + Math.floor(Math.random() * (max - min));
}
function r(arrfunc, extra) {
  while (arrfunc instanceof Array) {
    let len = arrfunc.length;
    arrfunc = len ? arrfunc[rng(len, 0)] : '';
  }
  if (typeof arrfunc === 'function') {
    return r(arrfunc(extra));
  } else {
    if (typeof arrfunc !== 'string' && typeof arrfunc !== 'object') {
      console.log('wtf?', arrfunc)
    }
    return arrfunc || '';
  }
}

function R(arrfunc, ex) {
  let out;
  do out = arrfunc();
  while (ex.indexOf(out) >= 0);
  return out;
}

function generate(obj) {
  let head = r(obj.head);
  let s = head;
  for (let i = 0, max = rng(1, 15); i < max; ++i) {
    s += r(obj.body);
  }
  let t = r(obj.tail, head);
  return s + t;
}

module.exports = {default: generate,
  pieces,

  rng,
  r,
  R,
};
