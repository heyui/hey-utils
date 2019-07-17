const utils = {
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
          if (src === copy) {
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
        this.freeze(obj[key]);
      }
    });
    return obj;
  },
  copy(data) {
    let copyOne = null;
    if (this.isObject(data)) {
      copyOne = {};
      for (const key in data) {
        copyOne[key] = this.copy(data[key]);
      }
    } else if (this.isArray(data)) {
      copyOne = [];
      for (const index of data) {
        copyOne.push(this.copy(index));
      }
    } else {
      copyOne = data;
    }
    return copyOne;
  },
  getKeyValue(obj, keypath) {
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
      return this.getKeyValue(value, array)
    }
    return value;
  },
  setKeyValue(obj, keypath, value, orignal) {
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
    if (window.localStorage && JSON && name) {
      if (typeof value == 'object') {
        value = JSON.stringify(value);
      }
      window.localStorage.setItem(name, value);
      return true;
    }
    return false;
  },
  getLocal(name, type) {
    if (window.localStorage && JSON && name) {
      const data = window.localStorage.getItem(name);
      if (type && type == 'json' && !this.isNull(data)) {
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
    return this.getLocal(name, 'json');
  },
  removeLocal(name) {
    if (window.localStorage && JSON && name) {
      window.localStorage.removeItem(name);
    }
    return null;
  },
  saveCookie(name, value, domain, path, minSec) {
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
      } else {
        exp = new Date("9998-01-01");
      }
      let cookieString = `${name}=${escape(value)}${minSec?(`;expires=${exp.toGMTString()}`) : ''};path=${path};`; 
      if(domain){
        cookieString += `domain=${domain};`;
      }
      document.cookie = cookieString;
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
  clearCookie(domain, path) {
    const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    path = path || '/';
    if (keys) {
      for (let i = keys.length; i--;) {
        let cookieString = `${keys[i]}=0;expires=${new Date(0).toUTCString()};path=${path};`;
        if(domain){
          cookieString += `domain=${domain};`;
        }
        document.cookie = cookieString;
      }
    }
  },
  removeCookie(name, domain, path) {
    const cookieEnabled = (navigator.cookieEnabled) ? true : false;
    if (name && cookieEnabled) {
      path = path || '/';
      let cookieString = `${name}=0;expires=${new Date(0).toUTCString()};path=${path};`;
      if(domain){
        cookieString += `domain=${domain};`;
      }
      document.cookie = cookieString;
      return true;
    }
    return false;
  },
  dictMapping({value, dict, connector, keyField='key', titleField='value'}) {
    if (!dict || this.isNull(value)) return '';
    if (connector) {
      value = value.split(connector);
    }
    if (!this.isNull(value) && value !== '' && dict) {
      if (!this.isArray(value)) {
        value = [value];
      }
    }
    if (value.length <= 0) {
      return '';
    }

    if (this.isArray(dict)) {
      dict = this.toObject(dict, keyField);
    }
    return value.map((ele) => {
      if (this.isObject(ele)) {
        return ele[titleField];
      }
      const d = dict[ele];
      if (this.isObject(d)) {
        return d[titleField];
      }
      return d;
    }).filter(ele => (ele && ele !== '')).join(', ');
  },
  uuid() {
    const s4 = ()=>{
      return Math.floor(( 1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  },
  padLeft(str, size) {
    var s = "00000" + str;
    return s.substr(s.length - size);
  },
  toggleValue(list, value) {
    if (!this.isArray(list)) return [value];
    let filters = list.filter(item=>item == value);
    if (filters.length > 0) {
      list.splice(list.indexOf(filters[0]), 1);
    } else {
      list.push(value);
    }
  },
  toSimpleArray(data, key) {
    let r = [];
    if (this.isObject(data)) {
      for (let d of Object.keys(data)) {
        r.push(data[d][key]);
      }
    }
    if (this.isArray(data)) {
      for (let d of data) {
        r.push(d[key]);
      }
    }
    return r;
  },
  getURLParam( name, search ) {
    return decodeURIComponent( ( new RegExp( `[?|&]${name}=` + '([^&;]+?)(&|#|;|$)' ).exec( search || location.search ) || [ true, '' ] )[ 1 ].replace( /\+/g, '%20' ) ) || null;
  },
  getAuthor() {
    const author = this.getURLParam('author', window.location.search) || this.getLocal('window_author');
    if (author) {
      this.saveLocal('window_author', author);
    }
    return author;
  },
  add(arg1, arg2) {
    let s1 = arg1.toString();
    let s2 = arg2.toString();
    let arg1Arr = s1.split(".");
    let arg2Arr = s2.split(".");
    let d1 = arg1Arr.length == 2 ? arg1Arr[1] : "";
    let d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
    let maxLen = Math.max(d1.length, d2.length);
    let m = Math.pow(10, maxLen);
    return Number(((s1 * m + s2 * m) / m).toFixed(maxLen));
  },
  sub(arg1, arg2) {
    return this.add(arg1, -arg2);
  },
  mul(arg1, arg2) {
    let m = 0;
    let s1 = arg1.toString();
    let s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) {}
    try { m += s2.split(".")[1].length } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  },
  div(arg1, arg2) {
    let t1 = 0;
    let t2 = 0;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) {}
    try { t2 = arg2.toString().split(".")[1].length } catch (e) {}
    let r1 = Number(arg1.toString().replace(".", ""));
    let r2 = Number(arg2.toString().replace(".", ""));
    return this.mul((r1 / r2) , Math.pow(10, t2 - t1));
  }
}
utils.valueForKeypath = utils.getKeyValue;
utils.setValueForKeypath = utils.setKeyValue;

export default utils;
