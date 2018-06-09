//import {
let {USE_SLOPPY_MODE, USE_STRICT_MODE} = require('../../utils');
//} from '../../utils';

//import ZeTokenizer, {
let {$ERROR, $NUMBER_HEX, $NUMBER_DEC, $NUMBER_BIN, $NUMBER_OCT, $NUMBER_OLD} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let numbers = [
  // "The SourceCharacter immediately following a NumericLiteral must not be an IdentifierStart or DecimalDigit."

  [['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], $NUMBER_DEC],
  [['10', '21', '32', '43', '54', '65', '76', '87', '98', '19'], $NUMBER_DEC],
  [['123', '456', '7890'], $NUMBER_DEC],
  ['1234567890', $NUMBER_DEC],

  [['.0', '.1', '.2', '.3', '.4', '.5', '.6', '.7', '.8', '.9'], $NUMBER_DEC],
  [['.10', '.21', '.32', '.43', '.54', '.65', '.76', '.87', '.98', '.19'], $NUMBER_DEC],
  [['.123', '.456', '.7890'], $NUMBER_DEC],
  ['.1234567890', $NUMBER_DEC],
  ['.0000', $NUMBER_DEC],

  [['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.'], $NUMBER_DEC],
  [['10.', '21.', '32.', '43.', '54.', '65.', '76.', '87.', '98.', '19.'], $NUMBER_DEC],
  [['123.', '456.', '7890.'], $NUMBER_DEC],
  ['1234567890.', $NUMBER_DEC],

  [['1.2', '2.3', '3.4', '4.5', '5.6', '6.7', '7.8', '8.9', '9.10'], $NUMBER_DEC],
  [['10.23', '21.45', '32.56', '43.78', '54.98', '65.91', '76.05', '87.04', '98.54', '19.37'], $NUMBER_DEC],
  [['123.012', '456.345', '7890.6789'], $NUMBER_DEC],
  ['1234567890.0987654321', $NUMBER_DEC],

  // with exponent

  [['0e1', '1e2', '2e3', '3e4', '4e5', '5e6', '6e7', '7e8', '8e9', '9e0'], $NUMBER_DEC],
  [['10e10', '21e21', '32e32', '43e43', '54e54', '65e65', '76e79', '87e87', '98e98', '19e19'], $NUMBER_DEC],
  [['123e123', '456e456', '7890e789'], $NUMBER_DEC],
  ['1234567890e1234567890', $NUMBER_DEC],

  [['.0E10', '.1E23', '.2E0', '.3E4', '.4E78', '.5E00', '.6E75', '.7E54', '.8E77', '.9E14'], $NUMBER_DEC],
  [['.10E1', '.21E2', '.32E3', '.43E4', '.54E5', '.65E6', '.76E7', '.87E8', '.98E9', '.19E0'], $NUMBER_DEC],

  [['0e-100', '1e-100'], $NUMBER_DEC],
  [['0E-100', '1E-100'], $NUMBER_DEC],
  [['0.e-100', '1.e-100'], $NUMBER_DEC],
  [['0.E-100', '1.E-100'], $NUMBER_DEC],
  [['0.1e-100', '1.1e-100'], $NUMBER_DEC],
  [['0.1E-100', '1.1E-100'], $NUMBER_DEC],
  [['.0e-100', '.1e-100'], $NUMBER_DEC],
  [['.0E-100', '.1E-100'], $NUMBER_DEC],

  [['0e+100', '1e+100'], $NUMBER_DEC],
  [['0E+100', '1E+100'], $NUMBER_DEC],
  [['0.e+100', '1.e+100'], $NUMBER_DEC],
  [['0.E+100', '1.E+100'], $NUMBER_DEC],
  [['0.1e+100', '1.1e+100'], $NUMBER_DEC],
  [['0.1E+100', '1.1E+100'], $NUMBER_DEC],
  [['.0e+100', '.1e+100'], $NUMBER_DEC],
  [['.0E+100', '.1E+100'], $NUMBER_DEC],

  // next: hex, new octal, new bin

  [['0x1234567890abcdefABCEF', '0X1234567890abcdefABCEF'], $NUMBER_HEX],
  [['0x0', '0x1', '0x2', '0x3', '0x4', '0x5', '0x6', '0x7', '0x8', '0x9', '0xa', '0xA', '0xb', '0xB', '0xc', '0xC', '0xd', '0xD', '0xe', '0xE', '0xf', '0xF'], $NUMBER_HEX],
  [
    [
      '0x01',
      '0x12',
      '0x23',
      '0x34',
      '0x45',
      '0x56',
      '0x67',
      '0x78',
      '0x89',
      '0x9a',
      '0xab',
      '0xAc',
      '0xbd',
      '0xBe',
      '0xcf',
      '0xC0',
      '0xd1',
      '0xD2',
      '0xe3',
      '0xE4',
      '0xf5',
      '0xF6',
    ],
    $NUMBER_HEX,
  ],
  [['0o12345670', '0O12345670'], $NUMBER_OCT],
  [['0o0', '0o1', '0o2', '0o3', '0o4', '0o5', '0o6', '0o7'], $NUMBER_OCT],
  [['0o01', '0o12', '0o23', '0o34', '0o45', '0o56', '0o67', '0o70'], $NUMBER_OCT],
  [['0b10', '0B10'], $NUMBER_BIN],
  [['0b0', '0b1', '0b00', '0b11', '0b01', '0b10'], $NUMBER_BIN],

  // legacy octal tests

  ['0123', $NUMBER_OLD, USE_SLOPPY_MODE, 'legacy octal representation, only okay in sloppy mode'],
  ['0123', $ERROR, USE_STRICT_MODE, 'legacy octal is error in strict mode'],

  [['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'], $NUMBER_OLD, USE_SLOPPY_MODE, 'legacy decimal starting with zero, only okay without strict mode'],
  [['000', '010', '021', '032', '043', '054', '065', '076', '087', '098'], $NUMBER_OLD, USE_SLOPPY_MODE, 'legacy decimal starting with zero, only okay without strict mode'],
  [['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'], $ERROR, USE_STRICT_MODE, 'legacy decimal starting with zero is error in strict mode'],
  [['000', '010', '021', '032', '043', '054', '065', '076', '087', '098'], $ERROR, USE_STRICT_MODE, 'legacy decimal starting with zero is error in strict mode'],
];

//export default numbers;
module.exports = numbers;
