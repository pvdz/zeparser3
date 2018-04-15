let {
  $ERROR,
  $IDENT,
} = require('../../../src/zetokenizer');

let identifiers = [
  [['foo', 'bar'], $IDENT],

  [['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], $IDENT],
  [['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'], $IDENT],
  ['$', $IDENT],
  ['_', $IDENT],

  [['aB','bC','cD','dE','eF','fz','gy','h0','i1','j2','k_','l$','m5','n6','o7','p8','q9','ra','sb','tc','ud','ve','wX','xY','yZ','zx'], $IDENT],
  [['AB','BC','CD','DE','EF','Fz','Gy','H0','I1','J2','K_','L$','M5','N6','O7','P8','Q9','Ra','Sb','Tc','Ud','Ve','WX','XY','YZ','Zx'], $IDENT],
  [['$a', '$b', '$c', '$d', '$e', '$f', '$g', '$h', '$i', '$j', '$k', '$l', '$m', '$n', '$o', '$p', '$q', '$r', '$s', '$t', '$u', '$v', '$w', '$x', '$y', '$z'], $IDENT],
  [['$A', '$B', '$C', '$D', '$E', '$F', '$G', '$H', '$I', '$J', '$K', '$L', '$M', '$N', '$O', '$P', '$Q', '$R', '$S', '$T', '$U', '$V', '$W', '$X', '$Y', '$Z'], $IDENT],
  [['_a', '_b', '_c', '_d', '_e', '_f', '_g', '_h', '_i', '_j', '_k', '_l', '_m', '_n', '_o', '_p', '_q', '_r', '_s', '_t', '_u', '_v', '_w', '_x', '_y', '_z'], $IDENT],
  [['_A', '_B', '_C', '_D', '_E', '_F', '_G', '_H', '_I', '_J', '_K', '_L', '_M', '_N', '_O', '_P', '_Q', '_R', '_S', '_T', '_U', '_V', '_W', '_X', '_Y', '_Z'], $IDENT],
  [['_', '__', '$', '$$', '$_', '_$'], $IDENT],

  // (TODO) unicode chars

  // unicode escape sequence crap

  // classic unicode escape
  [[`\\u0070bc`, `a\\u0071c`, `ab\\u0072`], $IDENT],
  [[`\\u007`, `\\u00`, `\\u0`, `\\u`, `\\`], $ERROR, 'idents that start with an invalid escape at eol/eof', 'suffixsp'],
  [[`\\u007Xvwxyz`, `\\u007Xvwxyz`, `\\u00Xvwxyz`, `\\u0Xvwxyz`, `\\uXvwxyz`, `\\Xvwxyz`], $ERROR, 'idents that start with invalid chars in an escape'],
  [[`abc\\u007`, `abc\\u00`, `abc\\u0`, `abc\\u`, `abc\\`], $ERROR, 'idents that have an invalid escape at eol/eof'],
  [[`abc\\u007Xvwxyz`, `abc\\u007Xvwxyz`, `abc\\u00Xvwxyz`, `abc\\u0Xvwxyz`, `abc\\uXvwxyz`, `abc\\Xvwxyz`], $ERROR, 'idents that start with invalid chars in an escape and have a tail'],
  // long unicode escape
  [[`\\u{70}bc`, `a\\u{71}c`, `ab\\u{72}`], $IDENT],
  [[`\\u{070}bc`, `a\\u{071}c`, `ab\\u{072}`], $IDENT],
  [[`\\u{0070}bc`, `a\\u{0071}c`, `ab\\u{0072}`], $IDENT],
  [[`\\u{00070}bc`, `a\\u{00071}c`, `ab\\u{00072}`], $IDENT],
  [[`\\u{000070}bc`, `a\\u{000071}c`, `ab\\u{000072}`], $IDENT],
  [[`\\u007`, `\\u00`, `\\u0`, `\\u`, `\\`], $ERROR, 'idents that start with an invalid escape at eol/eof', 'suffixsp'],
  [[`\\u007Xvwxyz`, `\\u007Xvwxyz`, `\\u00Xvwxyz`, `\\u0Xvwxyz`, `\\uXvwxyz`, `\\Xvwxyz`], $ERROR, 'idents that start with invalid chars in an escape'],
  [[`abc\\u007`, `abc\\u00`, `abc\\u0`, `abc\\u`, `abc\\`], $ERROR, 'idents that have an invalid escape at eol/eof'],
  [[`abc\\u007Xvwxyz`, `abc\\u007Xvwxyz`, `abc\\u00Xvwxyz`, `abc\\u0Xvwxyz`, `abc\\uXvwxyz`, `abc\\Xvwxyz`], $ERROR, 'idents that start with invalid chars in an escape and have a tail'],
  [[`\\u{000000000000000000070}bc`, `a\\u{0000000000000000000071}c`, `ab\\u{0000000000000000000072}`], $IDENT, 'leading zero padding'],
];

module.exports = identifiers;
