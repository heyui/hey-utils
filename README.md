# hey-utils

## 判断类型

### isObject  
### isArray  
### isDate  
### isNumber  
### isString  
### isBoolean  
### isFunction  
### isNull  
### isPlainObject  


## 数值计算
替换js数学计算中产生的错误，比如：0.09999999 + 0.00000001

### add(arg1, arg2)
加法

### sub(arg1, arg2)
减法

### mul(arg1, arg2)
乘法

### div(arg1, arg2)
除法

## 对象复制，合并，赋值

### extend  
用一个或多个其他对象来扩展一个对象，返回被扩展的对象。  
如果第一个参数设置为true，则返回一个深层次的副本，递归地复制找到的任何对象。  
否则的话，副本会与原对象共享结构。 未定义的属性将不会被复制，然而从对象的原型继承的属性将会被复制。  

```js

utils.extend({},{a:1},{b:2});
//结果
{
  a:1,
  b:2
}
```

### freeze
深度冻结对象
Object.freeze的深度实现
例：<code>utils.freeze({a:1});</code>

### copy
深度拷贝对象  
Object.assign的深度实现
例：<code>utils.copy({a:1});</code>

### getKeyValue
获取深度path的对象值
```js
  utils.getKeyValue({id:{v:'a'},b:2},"id.v");
  //'a'
  utils.getKeyValue({id:{v:['a','b']},b:2},"id.v[1]");
  //'b'
```

### setKeyValue
对深度path的对象赋值
```js
  utils.setKeyValue({id:{v:1},b:2}, 'id.v', 2);
  //{id:{v:2},b:2}
  utils.setKeyValue({id:{v:['a','b']},b:2}, "id.v[1]", 'c');
  //{id:{v:['a','c']},b:2}
```

## toArray, toObject

### toArray
将object转换成array.   
<code>toArray(object,keyName,valueName)</code>   
例：  
```js
  utils.toArray({a:1,b:1},'key','value');

  //结果
  [{
    key:'a',
    value:1
  },{
    key:'b',
    value:1
  }]


  utils.toArray({a:{b:2,d:4},b:{c:2,e:5}},'id');

  //结果
  [{
    id:'a',
    b:2,
    d:4
  },{
    id:'b',
    c:2,
    e:5
  }]

```

### toObject
将array转换成object.  
例：  
```js
  utils.toObject(['a','b','c']);

  //结果
  {
    a:'a',
    b:'b',
    c:'c'
  }

  utils.toObject([{id:'a',b:2},{id:'b',b:2}],'id');

  //结果
  {
    a:{
      id:'a',
      b:2
    },
    b:{
      id:'b',
      b:2
    }
  }


  utils.toObject([{id:'a',b:2},{id:'b',b:2}],'id',true);

  //结果
  {
    a:{
      id:'a',
      b:2,
      count:0
    },
    b:{
      id:'b',
      b:2,
      count:1
    }
  }
```

### saveLocal(name, value)
保存本地localStorage

### getLocal(name,type)
获取本地localStorage，如果type=='json'，这转换出json对象。

### getLocal2Json(name)
获取本地localStorage，并转换出json对象。

### removeLocal(name)
删除本地localStorage。

### saveCookie(name, value, domain, path, minSec)
保存本地cookie，path默认为/，minSec默认无限

### getCookie(name)
保存获取cookie

### clearCookie(domain, path)
清除所有cookie

### removeCookie(name, domain, path)
删除cookie

### toSimpleArray(data, key)
获取对应的key数组

### toggleValue(list, value)
如果数组存在这个值，则删除，如果没有，则添加

### padLeft(str, size)
左边填充0

### removeCookie(name, path)
删除cookie，path默认为/

### dictMapping({value, dict, connector, keyField='key', titleField='value'})

```js
let a = [{ title: '选择0', key: 0 }, { title: '选择1', key: 'a1', other: '其他值' }, { title: '选择2', key: 'a2' }, { title: '选择3', key: 'a3' }];

utils.dictMapping({value: 'a1', dict: a, titleField: 'title'})
//'选择1'
utils.dictMapping({value: ['a1', 'a2'], dict: a, titleField: 'title'})
//'选择1, 选择2'
utils.dictMapping({value: 'a1|a2', dict: a, titleField: 'title', connector: '|'})
//'选择1, 选择2'
```

## uuid()
生成唯一值

## getURLParam(path, search)
获取url参数，例：aa.com?a=1  
```js
utils.getURLParam('a', window.location.search)  //1
```

## getAuthor
获取author, 配合umock系统