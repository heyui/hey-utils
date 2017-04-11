(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
      typeof define === 'function' && define.amd ? define(factory) :
      global.heyUtils = factory();
  }((typeof window == 'object' ? window : typeof global == 'object' ? global : this), function () {
      "use strict";
      const heyUtils = {
          isObject: function (input) {
            return Object.prototype.toString.call(input) === '[object Object]';
          },
          isArray: function (input) {
            return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
          },
          isDate: function (input) {
            return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
          },
          isNumber: function (input) {
            return input instanceof Number || Object.prototype.toString.call(input) === '[object Number]';
          },
          isString: function (input) {
            return input instanceof String || Object.prototype.toString.call(input) === '[object String]';
          },
          isBoolean: function (input) {
            return typeof input == 'boolean';
          },
          isFunction: function (input) {
            return typeof input == 'function';
          },
          isNull: function (input) {
            return input === undefined || input === null;
          },
          isPlainObject: function (obj) {
            if (obj && Object.prototype.toString.call(obj) === "[object Object]" && obj.constructor === Object && !hasOwnProperty.call(obj, "constructor")) {
              var key;
              for (key in obj) {}
              return key === undefined || hasOwnProperty.call(obj, key);
            }
            return false;
          },
          extend: function () {
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
            if (!this.isObject(obj)) {
              return null;
            }
            let array = null;
            if (this.isArray(keypath)) {
              array = keypath;
            } else if (this.isString(keypath)) {
              array = keypath.split('.');
            }
            if (array == null || array.length == 0) {
              return null;
            }
            let value = null;
            let key = array.shift();
            const keyTest = key.match(new RegExp("^(\\w+)\\[(\\d+)\\]$"));
            if (keyTest) {
              key = keyTest[1];
              let index = keyTest[2];
              value = obj[key];
              if (this.isArray(value) && value.length > index) {
                value = value[index];
              }
            } else {
              value = obj[key];
            }

            if (array.length > 0) {
              return this.valueForKeypath(value, array)
            }
            return value;
          },
          setValueForKeypath(obj, keypath, value, orignal) {
            if (!this.isObject(obj)) {
              return false;
            }
            let array = null;
            if (this.isArray(keypath)) {
              array = keypath;
            } else if (this.isString(keypath)) {
              array = keypath.split('.');
              orignal = obj;
            }
            if (array == null || array.length == 0) {
              return false;
            }
            let children = null;
            let index = 0;
            let key = array.shift();
            const keyTest = key.match(new RegExp("^(\\w+)\\[(\\d+)\\]$"));
            if (keyTest) {
              key = keyTest[1];
              index = keyTest[2];
              children = obj[key];
              if (this.isArray(children) && children.length > index) {
                if (array.length > 0) {
                  return this.setValueForKeypath(children[index], array, value, orignal);
                }
                children[index] = value;
              }
            } else {
              if (array.length > 0) {
                return this.setValueForKeypath(obj[key], array, value, orignal);
              }
              obj[key] = value;
            }
            return orignal;
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
              if (keyName) n[keyName] = i;
              listO.push(n);
            }
            return listO;
          },
          toObject(list, idName = 'id', hasNum = false) {
            const listO = {};
            for (var i = 0; i < list.length; i++) {
              const n = list[i];
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
          saveLocal(name, value) {
            if (window.localStorage && JSON && name && value) {
              if (typeof value == 'object') {
                value = JSON.stringify(value);
              }
              window.localStorage[name] = value;
              return true;
            }
            return false;
          },
          getLocal(name, type) {
            if (window.localStorage && JSON && name) {
              const data = window.localStorage[name];
              if (type && type == 'json' && data !== undefined) {
                try {
                  return JSON.parse(data);
                } catch (e) {
                  console.error(`取数转换json错误${e}`);
                  return '';
                }
              } else {
                return data;
              }
            }
            return null;
          },
          getLocal2Json(name) {
            if (window.localStorage && JSON && name) {
              const data = window.localStorage[name];
              if (!this.isNull(data)) {
                try {
                  return JSON.parse(data);
                } catch (e) {
                  console.error(`取数转换json错误${e}`);
                  return '';
                }
              } else {
                return data;
              }
            }
            return null;
          },
          removeLocal(name) {
            if (window.localStorage && JSON && name) {
              window.localStorage[name] = null;
            }
            return null;
          },
          saveCookie(name, value, minSec, path) {
            const cookieEnabled = (navigator.cookieEnabled) ? true : false;
            if (name && cookieEnabled) {
              path = path || '/';
              if (typeof value == 'object') {
                value = JSON.stringify(value);
              }
              let exp;
              if (minSec) {
                exp = new Date(); // new Date("December 31, 9998");
                exp.setTime(exp.getTime() + minSec * 1000);
              }

              document.cookie = `${name}=${escape(value)}${minSec?(`;expires=${exp.toGMTString()}`) : ''};path=${path}`;
        return true;
      }
      return false;
    },
    getCookie(name) {
      const cookieEnabled = (navigator.cookieEnabled) ? true : false;
      if (name && cookieEnabled) {
        const arr = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)(;|$)`));
        if (arr !== null) {
          return unescape(arr[2]);
        }
      }
      return null;
    },
    clearCookie() {
      const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        for (let i = keys.length; i--;) {
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
      }
    },
    removeCookie(name, path) {
      const cookieEnabled = (navigator.cookieEnabled) ? true : false;
      if (name && cookieEnabled) {
        const exp = new Date();
        path = path || '/';
        exp.setTime(exp.getTime() - 1);
        const cval = this.getCookie(name);
        if (cval !== null) document.cookie = `${name}=${cval};expires=${exp.toGMTString()};path=${path}`;
        return true;
      }
      return false;
    },
    uuid() {
      const s4 = ()=>{
        return Math.floor( ( 1 + Math.random ) * 0x10000 ).toString( 16 ).substring( 1 );
      };
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
  }
  return heyUtils;
}));
