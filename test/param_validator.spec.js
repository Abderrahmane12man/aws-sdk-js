// Generated by CoffeeScript 1.12.3
(function() {
  var AWS, Buffer, helpers;

  helpers = require('./helpers');

  AWS = helpers.AWS;

  describe('AWS.ParamValidator', function() {
    var expectError, expectValid, input, members, ref, validate;
    ref = [{}, {}], members = ref[0], input = ref[1];
    validate = function(params, strict) {
      var r;
      r = input;
      if (r && !r.xml && !r.payload) {
        r = AWS.Model.Shape.create(input, {
          api: {}
        });
      }
      return new AWS.ParamValidator(strict).validate(r, params);
    };
    expectValid = function(params, strict) {
      return expect(validate(params, strict)).to.equal(true);
    };
    expectError = function(message, params, strict) {
      var ref1;
      if (params === void 0) {
        ref1 = [void 0, message], message = ref1[0], params = ref1[1];
      }
      return expect(function() {
        return validate(params, strict);
      }).to['throw'](message);
    };
    describe('empty input', function() {
      beforeEach(function() {
        return input = {
          type: 'structure'
        };
      });
      it('accepts an empty hash when the input are an empty hash', function() {
        return expectValid({});
      });
      return it('does not accept params in the given hash', function() {
        return expectError({
          foo: 'bar'
        });
      });
    });
    describe('param keys', function() {
      beforeEach(function() {
        return input = {
          members: {
            foo: {},
            bar: {
              type: 'string'
            }
          }
        };
      });
      it('accepts string keys', function() {
        expectValid({
          foo: 'foo'
        });
        return expectValid({
          bar: 'bar'
        });
      });
      return it('rejects keys that do not match case', function() {
        expectError({
          Bar: 'bar'
        });
        return expectError({
          Foo: 'foo'
        });
      });
    });
    describe('unexpected params', function() {
      beforeEach(function() {
        return input = {
          members: {
            string1: {},
            string2: {},
            hash: {
              type: 'structure',
              members: {
                good: {}
              }
            }
          }
        };
      });
      it('throws an ArgumentError for un-described params', function() {
        return expectError({
          string3: 'xyz'
        });
      });
      it('accepts null and undefined values for params not described in the input', function() {
        return expectValid({
          string3: null,
          string4: undefined
        });
      });
      return it('rejects nested params that are not described in the input', function() {
        expectValid({
          hash: {
            good: 'abc'
          }
        });
        return expectError({
          hash: {
            bad: 'abc'
          }
        });
      });
    });
    describe('uri params', function() {
      beforeEach(function() {
        input = {
          required: ['id'],
          members: {
            id: {
              type: 'string',
              location: 'uri'
            }
          }
        };
      });

      it('throws an error if a uri parameter is empty', function() {
        expectError({
          id: ''
        });
      });

      it('does not throw an error if a uri parameter is populated', function() {
        expectValid({
          id: 'foo'
        });
      });
    });
    describe('required params', function() {
      beforeEach(function() {
        return input = {
          required: ['req'],
          members: {
            req: {
              type: 'string'
            },
            opt: {
              type: 'structure',
              required: ['req'],
              members: {
                req: {
                  type: 'string'
                }
              }
            }
          }
        };
      });
      it('throws an error if a top-level required param is omitted', function() {
        return expectError({});
      });
      it('throws an error if a top-level required param is null', function() {
        return expectError({
          req: null
        });
      });
      it('optional params can be omitted, even if they have required params', function() {
        return expectValid({
          req: 'abc'
        });
      });
      it('requires nested required params when the parent is present', function() {
        return expectError({
          req: 'abc',
          opt: {}
        });
      });
      it('accepts nested required params', function() {
        return expectValid({
          req: 'abc',
          opt: {
            req: 'xyz'
          }
        });
      });
      it('accepts empty strings in required params', function() {
        return expectValid({
          req: ''
        });
      });
      it('accepts 0 in required params', function() {
        input.members.req.type = 'integer';
        return expectValid({
          req: 0
        });
      });
      return it('accepts false in required params', function() {
        input.members.req.type = 'boolean';
        return expectValid({
          req: false
        });
      });
    });
    describe('structure', function() {
      beforeEach(function() {
        return input = {
          members: {
            hash1: {
              type: 'structure',
              members: {
                param1: {},
                param2: {},
                hash2: {
                  type: 'structure',
                  required: ['param4'],
                  members: {
                    param3: {
                      type: 'boolean'
                    },
                    param4: {
                      type: 'integer'
                    }
                  }
                },
                hash3: {
                  type: 'structure',
                  document: true
                }
              }
            }
          }
        };
      });
      it('accepts hashes', function() {
        return expectValid({
          hash1: {}
        });
      });
      it('accepts hashes with params', function() {
        return expectValid({
          hash1: {
            param1: 'a',
            param2: 'b'
          }
        });
      });
      it('throws an error for non hashes', function() {
        return expectError({
          hash1: 'oops'
        });
      });
      it('throws an error for unknown hash members', function() {
        return expectError({
          hash1: {
            param3: 'c'
          }
        });
      });
      it('allows nesting structures', function() {
        return expectValid({
          hash1: {
            hash2: {
              param3: true,
              param4: 123
            }
          }
        });
      });
      it('rejects unknown members', function() {
        return expectError({
          hash1: {
            oops: 'abc'
          }
        });
      });
      it('accepts document type members', function () {
        return expectValid({
          hash1: {
            hash3: {foo: 'foo', bar: ['bar']}
          }
        });
      });
      return it('does not check inherited properties on parameters', function() {
        var cls, obj;
        cls = function() {
          return this;
        };
        cls.prototype.otherKey = 'value';
        obj = new cls;
        obj.hash1 = {};
        return expectValid(obj);
      });
    });
    describe('list', function() {
      beforeEach(function() {
        members = {};
        return input = {
          members: {
            array: {
              type: 'list',
              member: members
            }
          }
        };
      });
      it('accepts an array for list params', function() {
        return expectValid({
          array: []
        });
      });
      it('throws an error if list params are not arrays', function() {
        return expectError({
          array: {}
        });
      });
      return it('supports nested structures', function() {
        members.type = 'structure';
        members.members = {
          name: {}
        };
        expectValid({
          array: [
            {
              name: 'abc'
            }, {
              name: 'mno'
            }, {
              name: 'xyz'
            }
          ]
        });
        return expectError({
          array: [
            {
              badKey: 'abc'
            }
          ]
        });
      });
    });
    describe('map', function() {
      beforeEach(function() {
        members = {};
        return input = {
          members: {
            hash: {
              type: 'map',
              value: members
            }
          }
        };
      });
      it('accepts maps', function() {
        return expectValid({
          hash: {}
        });
      });
      it('accepts null', function() {
        return expectValid({
          hash: null
        });
      });
      it('rejects non-maps', function() {
        return expectError({
          hash: 'oops'
        });
      });
      it('accepts user-supplied maps keys', function() {
        return expectValid({
          hash: {
            a: '1',
            b: '2',
            c: '3'
          }
        });
      });
      return it('supports nested params', function() {
        members.type = 'structure';
        members.members = {
          param1: {
            type: 'list',
            member: {
              type: 'string'
            }
          },
          param2: {
            type: 'integer'
          },
          param3: {
            type: 'structure',
            members: {
              param4: {}
            }
          }
        };
        expectValid({
          hash: {
            foo: {
              param1: ['a', 'b', 'c']
            },
            bar: {
              param2: 123
            },
            yuck: {
              param3: {
                param4: 'xyz'
              }
            }
          }
        });
        return expectError({
          hash: {
            foo: {
              param4: 'abc'
            }
          }
        });
      });
    });
    describe('boolean', function() {
      beforeEach(function() {
        return input = {
          members: {
            param: {
              type: 'boolean'
            }
          }
        };
      });
      it('accepts true', function() {
        return expectValid({
          param: true
        });
      });
      it('accpets false', function() {
        return expectValid({
          param: false
        });
      });
      it('accepts null', function() {
        return expectValid({
          param: null
        });
      });
      return it('rejects other values', function() {
        return expectError({
          param: 'true'
        });
      });
    });
    describe('timestamp', function() {
      beforeEach(function() {
        return input = {
          members: {
            param: {
              type: 'timestamp'
            }
          }
        };
      });
      it('accepts Date objects', function() {
        return expectValid({
          param: new Date()
        });
      });
      it('accepts strings formatted like datetimes', function() {
        expectValid({
          param: '2012-01-02T10:11:12Z'
        });
        return expectValid({
          param: '2012-01-02T10:11:12.0001Z'
        });
      });
      it('accepts UNIX timestamps as number values', function() {
        return expectValid({
          param: 12345
        });
      });
      it('accepts null', function() {
        return expectValid({
          param: null
        });
      });
      return it('rejects other param values', function() {
        return expectError({
          param: 'abc'
        });
      });
    });
    describe('string', function() {
      beforeEach(function() {
        return input = {
          members: {
            param: {
              type: 'string'
            }
          }
        };
      });
      it('accepts strings', function() {
        return expectValid({
          param: 'abc'
        });
      });
      it('accepts empty string', function() {
        return expectValid({
          param: ''
        });
      });
      it('accepts null', function() {
        return expectValid({
          param: null
        });
      });
      it('rejects other objects', function() {
        expectError({
          param: 123
        });
        expectError({
          param: {}
        });
        return expectError({
          param: []
        });
      });
      return it('accepts anything JSON-encodable if the member is a JSONValue', function() {
        input = {
          members: {
            param: {
              type: 'string',
              jsonvalue: true
            }
          }
        };
        expectValid({
          param: '{"foo":"bar"}'
        });
        expectValid({
          param: 123
        });
        expectValid({
          param: {}
        });
        expectValid({
          param: []
        });
        expectValid({
          param: true
        });
        return expectValid({
          param: null
        });
      });
    });
    describe('float', function() {
      beforeEach(function() {
        return input = {
          members: {
            param: {
              type: 'float'
            }
          }
        };
      });
      it('accepts floats', function() {
        return expectValid({
          param: 1.23
        });
      });
      it('accepts integers', function() {
        return expectValid({
          param: 123
        });
      });
      it('accepts floats formatted as strings', function() {
        return expectValid({
          param: '1.23'
        });
      });
      it('accepts null', function() {
        return expectValid({
          param: null
        });
      });
      return it('rejects other objects', function() {
        return expectError({
          param: 'NOTFLOAT'
        });
      });
    });
    describe('integer', function() {
      beforeEach(function() {
        return input = {
          members: {
            param: {
              type: 'integer'
            }
          }
        };
      });
      it('accepts integers', function() {
        return expectValid({
          param: 123
        });
      });
      it('accepts integers formatted as strings', function() {
        return expectValid({
          param: '123'
        });
      });
      it('accepts null', function() {
        return expectValid({
          param: null
        });
      });
      return it('rejects other objects', function() {
        return expectError({
          param: 'NOTINT'
        });
      });
    });
    describe('base64', function() {
      beforeEach(function() {
        return input = {
          members: {
            param: {
              type: 'base64'
            }
          }
        };
      });
      it('accepts strings', function() {
        return expectValid({
          param: 'abc'
        });
      });
      it('accepts Buffers', function() {
        return expectValid({
          param: AWS.util.buffer.alloc(100)
        });
      });
      it('accepts typed arrays', function() {
        expectValid({
          param: new Uint8Array(1, 2, 3)
        });
        return expectValid({
          param: new Uint32Array(1, 2, 3)
        });
      });
      it('accepts null', function() {
        return expectValid({
          param: null
        });
      });
      it('rejects other objects', function() {
        return expectError({
          param: {}
        });
      });
      if (AWS.util.isBrowser()) {
        it('accepts Blob objects', function() {
          var blob;
          try {
            blob = new Blob;
          } catch (error) {}
          if (blob) {
            return expectValid({
              param: blob
            });
          }
        });
        it('accepts ArrayBuffer objects', function() {
          return expectValid({
            param: new ArrayBuffer
          });
        });
        return it('accepts DataView objects', function() {
          return expectValid({
            param: new DataView(new ArrayBuffer)
          });
        });
      }
    });
    describe('binary', function() {
      beforeEach(function() {
        return input = {
          members: {
            param: {
              type: 'binary'
            }
          }
        };
      });
      it('accepts strings', function() {
        return expectValid({
          param: 'abc'
        });
      });
      it('accepts Buffers', function() {
        return expectValid({
          param: AWS.util.buffer.alloc(100)
        });
      });
      it('accepts Streams', function() {
        var Stream;
        Stream = require('stream').Stream;
        return expectValid({
          param: new Stream()
        });
      });
      it('accepts null', function() {
        return expectValid({
          param: null
        });
      });
      return it('rejects other objects', function() {
        return expectError({
          param: {}
        });
      });
    });
    describe('payloads', function() {
      return it('validates from payload key if input include an xml element', function() {
        input = {
          type: 'structure',
          required: ['body'],
          payload: 'body',
          members: {
            notbody: {
              type: 'string'
            },
            body: {
              type: 'structure',
              members: {
                enabled: {
                  type: 'boolean'
                }
              }
            }
          }
        };
        return expectValid({
          body: {
            enabled: true
          },
          notbody: 'true'
        });
      });
    });
    describe('error messages', function() {
      beforeEach(function() {
        return input = {
          members: {
            config: {
              type: 'structure',
              members: {
                settings: {
                  type: 'structure',
                  members: {
                    enabled: {
                      type: 'boolean'
                    }
                  }
                }
              }
            }
          }
        };
      });
      it('throws helpful messages for unknown params', function() {
        var msg;
        msg = 'Unexpected key \'fake\' found in params';
        return expectError(msg, {
          fake: 'value'
        });
      });
      it('throws helpful messages for nested unknown params', function() {
        var msg;
        msg = 'Unexpected key \'fake\' found in params.config.settings';
        return expectError(msg, {
          config: {
            settings: {
              fake: 'value'
            }
          }
        });
      });
      it('throws helpful messages for missing required params', function() {
        var msg;
        msg = 'Missing required key \'needed\' in params.config.settings';
        input.members.config.members.settings.required = ['needed'];
        return expectError(msg, {
          config: {
            settings: {}
          }
        });
      });
      it('throws helpul messages for invalid structures', function() {
        var msg;
        msg = 'Expected params.config.settings to be a structure';
        return expectError(msg, {
          config: {
            settings: 'abc'
          }
        });
      });
      it('throws helpul messages for invalid lists', function() {
        var msg;
        msg = 'Expected params.config.settings.tags to be an Array';
        input.members.config.members.settings.members.tags = {
          type: 'list',
          member: {}
        };
        return expectError(msg, {
          config: {
            settings: {
              tags: 123
            }
          }
        });
      });
      it('throws helpful messages for invalid list members', function() {
        var msg;
        msg = 'Expected params.config.items[1].value to be a number';
        input.members.config.members.items = {
          type: 'list',
          member: {
            type: 'structure',
            members: {
              value: {
                type: 'integer'
              }
            }
          }
        };
        return expectError(msg, {
          config: {
            items: [
              {
                value: 123
              }, {
                value: 'abc'
              }, {
                value: 321
              }
            ]
          }
        });
      });
      it('throws helpful messages for invalid maps', function() {
        var msg;
        msg = 'Expected params.config.settings.tags to be a map';
        input.members.config.members.settings.members.tags = {
          type: 'map',
          key: {},
          value: {}
        };
        return expectError(msg, {
          config: {
            settings: {
              tags: '123'
            }
          }
        });
      });
      it('throws helpful messages for invalid map members', function() {
        var msg;
        msg = 'Expected params.config.counts[\'red\'] to be a number';
        input.members.config.members.counts = {
          type: 'map',
          value: {
            type: 'integer'
          }
        };
        return expectError(msg, {
          config: {
            counts: {
              red: true
            }
          }
        });
      });
      it('throws helpful messages for invalid strings', function() {
        var msg;
        msg = 'Expected params.config.settings.name to be a string';
        input.members.config.members.settings.members.name = {
          type: 'string'
        };
        return expectError(msg, {
          config: {
            settings: {
              name: 123
            }
          }
        });
      });
      it('throws helpful messages for invalid integers', function() {
        var msg;
        msg = 'Expected params.config.settings.count to be a number';
        input.members.config.members.settings.members.count = {
          type: 'integer'
        };
        return expectError(msg, {
          config: {
            settings: {
              count: 'invalid-integer'
            }
          }
        });
      });
      it('throws helpful messages for invalid timestamps', function() {
        var msg;
        msg = 'Expected params.config.settings.when to be a ' + 'Date object, ISO-8601 string, or a UNIX timestamp';
        input.members.config.members.settings.members.when = {
          type: 'timestamp'
        };
        return expectError(msg, {
          config: {
            settings: {
              when: 'invalid-date'
            }
          }
        });
      });
      it('throws helpful messages for invalid booleans', function() {
        var msg;
        msg = 'Expected params.config.settings.enabled to be a boolean';
        return expectError(msg, {
          config: {
            settings: {
              enabled: 'invalid-boolean'
            }
          }
        });
      });
      it('throws helpful messages for invalid floats', function() {
        var msg;
        msg = 'Expected params.config.settings.value to be a number';
        input.members.config.members.settings.members.value = {
          type: 'float'
        };
        return expectError(msg, {
          config: {
            settings: {
              value: 'invalid-float'
            }
          }
        });
      });
      it('throws helpful messages for invalid base64 params', function() {
        var msg;
        msg = 'Expected params.config.settings.data to be a ' + 'string, Buffer, Stream, Blob, or typed array object';
        input.members.config.members.settings.members.data = {
          type: 'base64'
        };
        return expectError(msg, {
          config: {
            settings: {
              data: 123
            }
          }
        });
      });
      return it('throws helpful messages for invalid binary params', function() {
        var msg;
        msg = 'Expected params.config.settings.data to be a ' + 'string, Buffer, Stream, Blob, or typed array object';
        input.members.config.members.settings.members.data = {
          type: 'binary'
        };
        return expectError(msg, {
          config: {
            settings: {
              data: 123
            }
          }
        });
      });
    });
    describe('multiple errors', function() {
      return it('groups multiple errors together', function() {
        var msg;
        input = {
          type: 'structure',
          required: ['param2'],
          members: {
            param1: {
              type: 'boolean'
            },
            param2: {
              type: 'integer'
            }
          }
        };
        msg = 'There were 2 validation errors:\n' + '* MissingRequiredParameter: Missing required key \'param2\' in params\n' + '* InvalidParameterType: Expected params.param1 to be a boolean';
        return expectError(msg, {
          param1: 'notboolean'
        });
      });
    });
    describe('strict range validation', function() {
      beforeEach(function() {
        return input = {
          members: {
            number: {
              type: 'float',
              min: 2,
              max: 10
            },
            str: {
              type: 'string',
              min: 3,
              max: 6
            },
            list: {
              type: 'list',
              min: 2,
              max: 4,
              member: {
                type: 'string'
              }
            },
            map: {
              type: 'map',
              min: 2,
              max: 3,
              value: {
                type: 'string'
              },
              key: {
                type: 'string',
                min: 2,
                max: 4
              }
            }
          }
        };
      });
      it('ignores max violations when max is disabled', function() {
        return expectValid({
          number: 1000
        }, {
          max: false
        });
      });
      it('ignores min violations when min is disabled', function() {
        return expectValid({
          number: 1
        }, {
          min: false
        });
      });
      it('accepts numbers at maximum', function() {
        return expectValid({
          number: 10
        }, {
          max: true
        });
      });
      it('rejects numbers above maximum', function() {
        return expectError('Expected numeric value <= 10, but found 11 for ' + 'params.number', {
          number: 11
        }, {
          max: true
        });
      });
      it('accepts numbers at minimum', function() {
        return expectValid({
          number: 2
        }, {
          min: true
        });
      });
      it('accepts numbers above minimum', function() {
        return expectValid({
          number: 3
        }, {
          min: true
        });
      });
      it('rejects numbers below minimum', function() {
        return expectError('Expected numeric value >= 2, but found 1 for params.number', {
          number: 1
        }, {
          min: true
        });
      });
      it('accepts strings at minimum', function() {
        return expectValid({
          str: '123'
        }, {
          min: true
        });
      });
      it('accepts strings above minimum', function() {
        return expectValid({
          str: '12345'
        }, {
          min: true
        });
      });
      it('rejects strings below minimum', function() {
        return expectError('Expected string length >= 3, but found 2 for params.str', {
          str: '12'
        }, {
          min: true
        });
      });
      it('accepts strings at maximum', function() {
        return expectValid({
          str: '123456'
        }, {
          max: true
        });
      });
      it('rejects strings above maximum', function() {
        return expectError('Expected string length <= 6, but found 9 for params.str', {
          str: '123456789'
        }, {
          max: true
        });
      });
      it('accepts lists at minimum', function() {
        return expectValid({
          list: ['a', 'b']
        }, {
          min: true
        });
      });
      it('accepts lists above minimum', function() {
        return expectValid({
          list: ['a', 'b', 'c']
        }, {
          min: true
        });
      });
      it('accepts lists at maximum', function() {
        return expectValid({
          list: ['a', 'b', 'c', 'd']
        }, {
          max: true
        });
      });
      it('rejects lists below minimum', function() {
        expectError('Expected list member count >= 2, but found 1 ' + 'for params.list', {
          list: ['a']
        }, {
          min: true
        });
        return expectError('Expected list member count >= 2, but found 0 for ' + 'params.list', {
          list: []
        }, {
          min: true
        });
      });
      it('rejects lists above maximum', function() {
        return expectError('Expected list member count <= 4, but found 5 ' + 'for params.list', {
          list: ['a', 'b', 'c', 'd', 'e']
        }, {
          max: true
        });
      });
      it('accepts maps at minimum', function() {
        return expectValid({
          map: {
            ab: '1',
            cd: '2'
          }
        }, {
          min: true
        });
      });
      it('accepts maps at maximum', function() {
        return expectValid({
          map: {
            ab: '1',
            cd: '2',
            de: '3'
          }
        }, {
          max: true
        });
      });
      it('rejects maps below minimum', function() {
        return expectError('Expected map member count >= 2, but found 1 ' + 'for params.map', {
          map: {
            ab: '1'
          }
        }, {
          min: true
        });
      });
      it('rejects maps above maximum member count', function() {
        return expectError('Expected map member count <= 3, but found 4 for params.map', {
          map: {
            ab: '1',
            cd: '2',
            de: '3',
            ef: '4'
          }
        }, {
          max: true
        });
      });
      return it('rejects maps where key is out of range', function() {
        return expectError('Expected string length <= 4, but found 5 for params.map', {
          map: {
            abcde: '1',
            fg: '2'
          }
        }, {
          max: true
        });
      });
    });
    describe('strict enum validation', function() {
      beforeEach(function() {
        return input = {
          members: {
            str: {
              type: 'string',
              'enum': ['Hemingway', 'Faulkner', 'Twain', 'Poe']
            },
            map: {
              type: 'map',
              value: {
                type: 'string'
              },
              key: {
                type: 'string',
                'enum': ['old', 'man', 'sea']
              }
            }
          }
        };
      });
      it('ignores enum violations when strict is disabled', function() {
        return expectValid({
          str: 'Dickens'
        }, {
          'enum': false
        });
      });
      it('accepts strings matching first enum value', function() {
        return expectValid({
          str: 'Hemingway'
        }, {
          'enum': true
        });
      });
      it('accepts strings matching last enum value', function() {
        return expectValid({
          str: 'Poe'
        }, {
          'enum': true
        });
      });
      it('rejects strings not in enum list', function() {
        return expectError('Found string value of Shakespeare, but expected ' + 'Hemingway|Faulkner|Twain|Poe for params.str', {
          str: 'Shakespeare'
        }, {
          'enum': true
        });
      });
      it('rejects strings not exactly in enum list', function() {
        return expectError('Found string value of twain, but expected ' + 'Hemingway|Faulkner|Twain|Poe for params.str', {
          str: 'twain'
        }, {
          'enum': true
        });
      });
      it('accepts map keys found in enum trait', function() {
        return expectValid({
          map: {
            old: 'abc'
          }
        }, {
          'enum': true
        });
      });
      return it('rejects map keys not found in enum trait', function() {
        return expectError('Found string value of the, but expected old|man|sea ' + 'for params.map[key=\'the\']', {
          map: {
            the: 'abc'
          }
        }, {
          'enum': true
        });
      });
    });
    return describe('strict pattern validation', function() {
      beforeEach(function() {
        return input = {
          members: {
            str: {
              type: 'string',
              pattern: '^[0-9a-f]{8,63}$'
            }
          }
        };
      });
      it('ignores pattern violations when strict is disabled', function() {
        return expectValid({
          str: 'foobazbar'
        }, {
          pattern: false
        });
      });
      it('accepts strings matching pattern', function() {
        return expectValid({
          str: '1234aaee'
        }, {
          pattern: true
        });
      });
      return it('rejects strings that do not match pattern', function() {
        return expectError('Provided value "foobazbar" does not match ' + 'regex pattern /^[0-9a-f]{8,63}$/ for params.str', {
          str: 'foobazbar'
        }, {
          pattern: true
        });
      });
    });
  });

}).call(this);
