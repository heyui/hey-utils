(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.heyUtils = factory();
}((typeof window == 'object' ? window : typeof global == 'object' ? global : this), function() {
  "use strict";
  const heyUtils = {
    isObject: function(input) {
      return Object.prototype.toString.call(input) === '[object Object]';
    },
    isArray: function(input) {
      return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    },
    isDate: function(input) {
      return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    },
    isNumber: function(input) {
      return input instanceof Number || Object.prototype.toString.call(input) === '[object Number]';
    },
    isString: function(input) {
      return input instanceof String || Object.prototype.toString.call(input) === '[object String]';
    },
    isBoolean: function(input) {
      return typeof input == 'boolean';
    },
    isFunction: function(input) {
      return typeof input == 'function';
    },
    isNull: function(input) {
      return input === undefined || input === null;
    },
    isPlainObject: function(obj) {
      if (obj && Object.prototype.toString.call(obj) === "[object Object]" && obj.constructor === Object && !hasOwnProperty.call(obj, "constructor")) {
        var key;
        for (key in obj) {}
        return key === undefined || hasOwnProperty.call(obj, key);
      }
      return false;
    },
    extend: function() {
      var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
      if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
      }
      if (typeof target !== "object" && !this.isFunction(target)) {
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
    freeze(obj) {
      const that = this;
      Object.freeze(obj);
      Object.keys(obj).forEach((key, value) => {
        if (that.isObject(obj[key])) {
          this.deepFreeze(obj[key]);
        }
      });
      return obj;
    },
    copy(data) {
      let copyOne = null;
      if (this.isObject(data)) {
        copyOne = {};
        for (const key in data) {
          copyOne[key] = this.deepCopy(data[key]);
        }
      } else if (this.isArray(data)) {
        copyOne = [];
        for (const index of data) {
          copyOne.push(this.deepCopy(index));
        }
      } else {
        copyOne = data;
      }
      return copyOne;
    },
    valueForKeypath(obj, keypath) {
      let array = null;
      if (this.isArray(keypath)) {
        array = keypath;
      } else if (this.isString(keypath)) {
        array = keypath.split('.');
      }
      if (array === null) {
        return null;
      }
      if (array.length > 1) {
        const first = array.shift();

        if (!obj[first] || typeof obj[first] !== 'object') {
          return null;
        }
        return this.valueForKeypath(obj[first], array)
      }
      return obj[array[0]];
    },
    setValueForKeypath(obj, keypath, value) {
      let array = null;
      if (this.isArray(keypath)) {
        array = keypath;
      } else if (this.isString(keypath)) {
        array = keypath.split('.');
      }
      if (array === null) {
        return false;
      }
      if (array.length > 1) {
        const first = array.shift();

        if (!obj[first] || typeof obj[first] !== 'object') {
          obj[first] = {};
        }
        this.setValueForKeypath(obj[first], array, value);
        return false;
      }
      obj[array[0]] = value;
      return true;
    },
    toArray(object, keyName, arg3) {
      let titleName = '';
      if (!this.isObject(object)) {
        return [];
      }
      if (this.isString(arg3)) {
        titleName = arg3;
      }
      let listO = [];
      for (let i in object) {
        let value = object[i];
        let n = {};
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
    toObject(list, idName = 'id', hasNum = false) {
      const listO = {};
      for (var i = 0; i < list.length; i++) {
        const n = list[i];
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
    },
  }
  return heyUtils;
}));
