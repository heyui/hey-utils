'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.heyUtils = factory();
})((typeof window === 'undefined' ? 'undefined' : _typeof(window)) == 'object' ? window : (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' ? global : undefined, function () {
  "use strict";

  var heyUtils = {
    isObject: function isObject(input) {
      return Object.prototype.toString.call(input) === '[object Object]';
    },
    isArray: function isArray(input) {
      return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    },
    isDate: function isDate(input) {
      return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    },
    isNumber: function isNumber(input) {
      return input instanceof Number || Object.prototype.toString.call(input) === '[object Number]';
    },
    isString: function isString(input) {
      return input instanceof String || Object.prototype.toString.call(input) === '[object String]';
    },
    isBoolean: function isBoolean(input) {
      return typeof input == 'boolean';
    },
    isFunction: function isFunction(input) {
      return typeof input == 'function';
    },
    isNull: function isNull(input) {
      return input === undefined || input === null;
    },
    isPlainObject: function isPlainObject(obj) {
      if (obj && Object.prototype.toString.call(obj) === "[object Object]" && obj.constructor === Object && !hasOwnProperty.call(obj, "constructor")) {
        var key;
        for (key in obj) {}
        return key === undefined || hasOwnProperty.call(obj, key);
      }
      return false;
    },
    extend: function extend() {
      var options,
          name,
          src,
          copy,
          copyIsArray,
          clone,
          target = arguments[0] || {},
          i = 1,
          length = arguments.length,
          deep = false;
      if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
      }
      if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== "object" && !this.isFunction(target)) {
        target = {};
      }
      if (length === i) {
        target = this;
        --i;
      }
      for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
          for (name in options) {
            src = target[name];
            copy = options[name];
            if (target === copy) {
              continue;
            }
            if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)))) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && this.isArray(src) ? src : [];
              } else {
                clone = src && this.isPlainObject(src) ? src : {};
              }
              target[name] = this.extend(deep, clone, copy);
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }
      return target;
    },
    freeze: function freeze(obj) {
      var _this = this;

      var that = this;
      Object.freeze(obj);
      Object.keys(obj).forEach(function (key, value) {
        if (that.isObject(obj[key])) {
          _this.deepFreeze(obj[key]);
        }
      });
      return obj;
    },
    copy: function copy(data) {
      var copyOne = null;
      if (this.isObject(data)) {
        copyOne = {};
        for (var _key in data) {
          copyOne[_key] = this.deepCopy(data[_key]);
        }
      } else if (this.isArray(data)) {
        copyOne = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var index = _step.value;

            copyOne.push(this.deepCopy(index));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else {
        copyOne = data;
      }
      return copyOne;
    },
    valueForKeypath: function valueForKeypath(obj, keypath) {
      var array = null;
      if (this.isArray(keypath)) {
        array = keypath;
      } else if (this.isString(keypath)) {
        array = keypath.split('.');
      }
      if (array === null) {
        return null;
      }
      if (array.length > 1) {
        var first = array.shift();

        if (!obj[first] || _typeof(obj[first]) !== 'object') {
          return null;
        }
        return this.valueForKeypath(obj[first], array);
      }
      return obj[array[0]];
    },
    setValueForKeypath: function setValueForKeypath(obj, keypath, value) {
      var array = null;
      if (this.isArray(keypath)) {
        array = keypath;
      } else if (this.isString(keypath)) {
        array = keypath.split('.');
      }
      if (array === null) {
        return false;
      }
      if (array.length > 1) {
        var first = array.shift();

        if (!obj[first] || _typeof(obj[first]) !== 'object') {
          obj[first] = {};
        }
        this.setValueForKeypath(obj[first], array, value);
        return false;
      }
      obj[array[0]] = value;
      return true;
    },
    toArray: function toArray(object, keyName, arg3) {
      var titleName = '';
      if (!this.isObject(object)) {
        return [];
      }
      if (this.isString(arg3)) {
        titleName = arg3;
      }
      var listO = [];
      for (var i in object) {
        var value = object[i];
        var n = {};
        if (this.isObject(value)) {
          n = value;
        } else {
          n[titleName] = value;
        }
        if (keyName) n[keyName] = key;
        list.push(n);
      }
      return listO;
    },
    toObject: function toObject(list) {
      var idName = arguments.length <= 1 || arguments[1] === undefined ? 'id' : arguments[1];
      var hasNum = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      var listO = {};
      for (var i = 0; i < list.length; i++) {
        var n = list[i];
        if (idName == 'count') {
          listO[i] = n;
        } else {
          listO[n[idName]] = n;
          if (hasNum) {
            listO[n[idName]].count = i;
          }
        }
      }
      return listO;
    }
  };
  return heyUtils;
});