//import ZeTokenizer, {
let {
  $CRLF,
  $NL,
  $SPACE,
  $TAB,
  $WHITE,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let whitespaces = [
  [' ', $SPACE],
  ['\t', $TAB],
  ['\xA0', $WHITE, 'non breaking space'],
  ['\uFEFF', $WHITE, 'BOM is a space'],
  ['\r', $NL],
  ['\n', $NL],
  ['\r\n', $CRLF, 'considered one for line reporting'],
  ['\u2028', $NL, 'line separator is a newline'],
  ['\u2029', $NL, 'paragraph separator is a newline'],
];

//export default whitespaces;
module.exports = whitespaces;
