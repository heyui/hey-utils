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
          _this.freeze(obj[key]);
        }
      });
      return obj;
    },
    copy: function copy(data) {
      var copyOne = null;
      if (this.isObject(data)) {
        copyOne = {};
        for (var key in data) {
          copyOne[key] = this.copy(data[key]);
        }
      } else if (this.isArray(data)) {
        copyOne = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var index = _step.value;

            copyOne.push(this.copy(index));
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
    getKeyValue: function getKeyValue(obj, keypath) {
      if (!this.isObject(obj)) {
        return null;
      }
      var array = null;
      if (this.isArray(keypath)) {
        array = keypath;
      } else if (this.isString(keypath)) {
        array = keypath.split('.');
      }
      if (array == null || array.length == 0) {
        return null;
      }
      var value = null;
      var key = array.shift();
      var keyTest = key.match(new RegExp("^(\\w+)\\[(\\d+)\\]$"));
      if (keyTest) {
        key = keyTest[1];
        var index = keyTest[2];
        value = obj[key];
        if (this.isArray(value) && value.length > index) {
          value = value[index];
        }
      } else {
        value = obj[key];
      }

      if (array.length > 0) {
        return this.getKeyValue(value, array);
      }
      return value;
    },
    setKeyValue: function setKeyValue(obj, keypath, value, orignal) {
      if (!this.isObject(obj)) {
        return false;
      }
      var array = null;
      if (this.isArray(keypath)) {
        array = keypath;
      } else if (this.isString(keypath)) {
        array = keypath.split('.');
        orignal = obj;
      }
      if (array == null || array.length == 0) {
        return false;
      }
      var children = null;
      var index = 0;
      var key = array.shift();
      var keyTest = key.match(new RegExp("^(\\w+)\\[(\\d+)\\]$"));
      if (keyTest) {
        key = keyTest[1];
        index = keyTest[2];
        children = obj[key];
        if (this.isArray(children) && children.length > index) {
          if (array.length > 0) {
            return this.setKeyValue(children[index], array, value, orignal);
          }
          children[index] = value;
        }
      } else {
        if (array.length > 0) {
          return this.setKeyValue(obj[key], array, value, orignal);
        }
        obj[key] = value;
      }
      return orignal;
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
        if (keyName) n[keyName] = i;
        listO.push(n);
      }
      return listO;
    },
    toObject: function toObject(list) {
      var idName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'id';
      var hasNum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var listO = {};
      for (var i = 0; i < list.length; i++) {
        var n = list[i];
        if (this.isObject(n)) {
          if (idName == 'count') {
            listO[i] = n;
          } else {
            listO[n[idName]] = n;
            if (hasNum) {
              listO[n[idName]].count = i;
            }
          }
        } else {
          listO[n] = n;
        }
      }
      return listO;
    },
    saveLocal: function saveLocal(name, value) {
      if (window.localStorage && JSON && name && value) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
          value = JSON.stringify(value);
        }
        window.localStorage[name] = value;
        return true;
      }
      return false;
    },
    getLocal: function getLocal(name, type) {
      if (window.localStorage && JSON && name) {
        var data = window.localStorage[name];
        if (type && type == 'json' && data !== undefined) {
          try {
            return JSON.parse(data);
          } catch (e) {
            console.error('取数转换json错误' + e);
            return '';
          }
        } else {
          return data;
        }
      }
      return null;
    },
    getLocal2Json: function getLocal2Json(name) {
      if (window.localStorage && JSON && name) {
        var data = window.localStorage[name];
        if (!this.isNull(data)) {
          try {
            return JSON.parse(data);
          } catch (e) {
            console.error('取数转换json错误' + e);
            return '';
          }
        } else {
          return data;
        }
      }
      return null;
    },
    removeLocal: function removeLocal(name) {
      if (window.localStorage && JSON && name) {
        window.localStorage[name] = null;
      }
      return null;
    },
    saveCookie: function saveCookie(name, value, minSec, path) {
      var cookieEnabled = navigator.cookieEnabled ? true : false;
      if (name && cookieEnabled) {
        path = path || '/';
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
          value = JSON.stringify(value);
        }
        var exp = undefined;
        if (minSec) {
          exp = new Date(); // new Date("December 31, 9998");
          exp.setTime(exp.getTime() + minSec * 1000);
        }

        document.cookie = name + '=' + escape(value) + (minSec ? ';expires=' + exp.toGMTString() : '') + ';path=' + path;
        return true;
      }
      return false;
    },
    getCookie: function getCookie(name) {
      var cookieEnabled = navigator.cookieEnabled ? true : false;
      if (name && cookieEnabled) {
        var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
        if (arr !== null) {
          return unescape(arr[2]);
        }
      }
      return null;
    },
    clearCookie: function clearCookie() {
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        for (var i = keys.length; i--;) {
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
        }
      }
    },
    removeCookie: function removeCookie(name, path) {
      var cookieEnabled = navigator.cookieEnabled ? true : false;
      if (name && cookieEnabled) {
        var exp = new Date();
        path = path || '/';
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval !== null) document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=' + path;
        return true;
      }
      return false;
    },
    uuid: function uuid() {
      var s4 = function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      };
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
  };
  heyUtils.valueForKeypath = heyUtils.getKeyValue;
  heyUtils.setValueForKeypath = heyUtils.setKeyValue;
  return heyUtils;
});