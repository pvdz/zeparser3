/** @format */

import {$ASI, $IDENT, $PUNCTUATOR, $REGEX} from '../../../src/zetokenizer.mjs';
export default (describe, test) =>
  describe('try statement', _ => {
    test('empty try/catch', {
      code: 'try {} catch(e) {}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: [],
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e',
              },
              body: {
                type: 'BlockStatement',
                body: [],
              },
            },
            finalizer: null,
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
    test('empty try/finally', {
      code: 'try {} finally {}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: [],
            },
            handler: null,
            finalizer: {
              type: 'BlockStatement',
              body: [],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });
    test('empty try/catch/finally', {
      code: 'try {} catch(e) {} finally {}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: [],
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e',
              },
              body: {
                type: 'BlockStatement',
                body: [],
              },
            },
            finalizer: {
              type: 'BlockStatement',
              body: [],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });
    describe('catch arg', _ => {
      describe('present', _ => {
        test('no arg', {
          code: 'try {} catch(){}',
          throws: 'Missing catch clause',
          tokens: [],
        });
        test('plain ident', {
          code: 'try {} catch(e){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'TryStatement',
                block: {
                  type: 'BlockStatement',
                  body: [],
                },
                handler: {
                  type: 'CatchClause',
                  param: {
                    type: 'Identifier',
                    name: 'e',
                  },
                  body: {
                    type: 'BlockStatement',
                    body: [],
                  },
                },
                finalizer: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('dobule arg', {
          code: 'try {} catch(e, f){}',
          throws: 'exactly one parameter',
          tokens: [],
        });
        test('simple object destruct', {
          code: 'try {} catch({e}){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'TryStatement',
                block: {
                  type: 'BlockStatement',
                  body: [],
                },
                handler: {
                  type: 'CatchClause',
                  param: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'e',
                        },
                        kind: 'init',
                        method: false,
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'e',
                        },
                        shorthand: true,
                      },
                    ],
                  },
                  body: {
                    type: 'BlockStatement',
                    body: [],
                  },
                },
                finalizer: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('simple array destruct', {
          code: 'try {} catch([e]){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'TryStatement',
                block: {
                  type: 'BlockStatement',
                  body: [],
                },
                handler: {
                  type: 'CatchClause',
                  param: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'e',
                      },
                    ],
                  },
                  body: {
                    type: 'BlockStatement',
                    body: [],
                  },
                },
                finalizer: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('ident with trailing comma', {
          code: 'try {} catch(e,){}',
          throws: 'exactly one parameter',
          tokens: [],
        });
        test('object with trailing comma', {
          code: 'try {} catch({e},){}',
          throws: 'no trailing comma',
          tokens: [],
        });
        test.pass('object with initializer is ok', {
          code: 'try {} catch({e}=x){}',
        });
        test('object with inside default', {
          code: 'try {} catch({e=x}){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'TryStatement',
                block: {
                  type: 'BlockStatement',
                  body: [],
                },
                handler: {
                  type: 'CatchClause',
                  param: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'e',
                        },
                        kind: 'init',
                        method: false,
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'e',
                          },
                          right: {
                            type: 'Identifier',
                            name: 'x',
                          },
                        },
                        shorthand: true,
                      },
                    ],
                  },
                  body: {
                    type: 'BlockStatement',
                    body: [],
                  },
                },
                finalizer: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        test('array with trailing comma', {
          code: 'try {} catch([e],){}',
          throws: 'exactly one parameter',
        });
        test.pass('array with default', {
          code: 'try {} catch([e]=x){}',
          desc: 'catch clauses cant have a default but patterns can still have initializers',
        });
        test('array with inside default', {
          code: 'try {} catch([e=x]){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'TryStatement',
                block: {
                  type: 'BlockStatement',
                  body: [],
                },
                handler: {
                  type: 'CatchClause',
                  param: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'e',
                        },
                        right: {
                          type: 'Identifier',
                          name: 'x',
                        },
                      },
                    ],
                  },
                  body: {
                    type: 'BlockStatement',
                    body: [],
                  },
                },
                finalizer: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });
      [undefined, 9, Infinity].forEach(VER => {
        describe('optional catch binding supported from ES9 upward (version=`' + VER + '`)', _ => {
          test('try/catch no finally', {
            code: 'try {} catch {}',
            ES: VER,
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'TryStatement',
                  block: {
                    type: 'BlockStatement',
                    body: [],
                  },
                  handler: {
                    type: 'CatchClause',
                    param: null,
                    body: {
                      type: 'BlockStatement',
                      body: [],
                    },
                  },
                  finalizer: null,
                },
              ],
            },
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          });
          test('try/catch/finally', {
            code: 'try {} catch {} finally {}',
            ES: VER,
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'TryStatement',
                  block: {
                    type: 'BlockStatement',
                    body: [],
                  },
                  handler: {
                    type: 'CatchClause',
                    param: null,
                    body: {
                      type: 'BlockStatement',
                      body: [],
                    },
                  },
                  finalizer: {
                    type: 'BlockStatement',
                    body: [],
                  },
                },
              ],
            },
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          });
          test.fail('try/catch parenless ident', {
            code: 'try {} catch foo {}',
            ES: VER,
          });
          test.fail('try/catch parenless array', {
            code: 'try {} catch [] {}',
            ES: VER,
          });
          test.pass('try/catch asi ', {
            code: 'try {} catch \n {}',
            ES: VER,
          });
        });
      });
      [6, 7, 8, 9].forEach(VER => {
        describe('optional catch binding not supported in ES8 downward (version=`' + VER + '`)', _ => {
          test.pass('try/catch no finally', {
            code: 'try {} catch {}',
            ES: VER,
          });
          test.pass('try/catch/finally', {
            code: 'try {} catch {} finally {}',
            ES: VER,
          });
          test.fail('try/catch parenless ident', {
            code: 'try {} catch foo {}',
            ES: VER,
          });
          test.fail('try/catch parenless array', {
            code: 'try {} catch [] {}',
            ES: VER,
          });
          test.pass('try/catch asi ', {
            code: 'try {} catch \n {}',
            ES: VER,
          });
        });
      });
    });
    describe('regex edge case', _ => {
      describe('catch', _ => {
        test('division', {
          code: 'try {} catch (e) {}\n/foo',
          throws: 'regex',
          desc: 'try (/catch/finally) is a statement (not a value) so division is illegal',
          tokens: [],
        });
        test('sans flag', {
          code: 'try {} catch (e) {}\n/foo/',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'TryStatement',
                block: {
                  type: 'BlockStatement',
                  body: [],
                },
                handler: {
                  type: 'CatchClause',
                  param: {
                    type: 'Identifier',
                    name: 'e',
                  },
                  body: {
                    type: 'BlockStatement',
                    body: [],
                  },
                },
                finalizer: null,
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Literal',
                  value: '<TODO>',
                  raw: '/foo/',
                },
              },
            ],
          },
          desc: 'no ASI is attempted because the catch does not expect a semi so this is fine',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
        });
        test('sans flag', {
          code: 'try {} catch (e) {}\n/foo/g',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'TryStatement',
                block: {
                  type: 'BlockStatement',
                  body: [],
                },
                handler: {
                  type: 'CatchClause',
                  param: {
                    type: 'Identifier',
                    name: 'e',
                  },
                  body: {
                    type: 'BlockStatement',
                    body: [],
                  },
                },
                finalizer: null,
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Literal',
                  value: '<TODO>',
                  raw: '/foo/g',
                },
              },
            ],
          },
          desc: 'no ASI is attempted because the catch does not expect a semi so this is fine',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
        });
      });
      describe('finally', _ => {
        test('sans flag', {
          code: 'try {} finally {}\n/foo',
          throws: 'regex',
          desc: 'no ASI is attempted because the finally does not expect a semi so this is fine',
          tokens: [],
        });
        test('sans flag', {
          code: 'try {} finally {}\n/foo/',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'TryStatement',
                block: {
                  type: 'BlockStatement',
                  body: [],
                },
                handler: null,
                finalizer: {
                  type: 'BlockStatement',
                  body: [],
                },
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Literal',
                  value: '<TODO>',
                  raw: '/foo/',
                },
              },
            ],
          },
          desc: 'no ASI is attempted because the finally does not expect a semi so this is fine',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
        });
        test('sans flag', {
          code: 'try {} finally {}\n/foo/g',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'TryStatement',
                block: {
                  type: 'BlockStatement',
                  body: [],
                },
                handler: null,
                finalizer: {
                  type: 'BlockStatement',
                  body: [],
                },
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Literal',
                  value: '<TODO>',
                  raw: '/foo/g',
                },
              },
            ],
          },
          desc: 'no ASI is attempted because the finally does not expect a semi so this is fine',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
        });
      });
    });
  }); // catch clause var(s) cannot already be bound
