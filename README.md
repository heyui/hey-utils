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


## 对象复制，合并，赋值

### extend  
用一个或多个其他对象来扩展一个对象，返回被扩展的对象。  
如果第一个参数设置为true，则返回一个深层次的副本，递归地复制找到的任何对象。  
否则的话，副本会与原对象共享结构。 未定义的属性将不会被复制，然而从对象的原型继承的属性将会被复制。  

```js

Utils.extend({},{a:1},{b:2});
//结果
{
  a:1,
  b:2
}
```

### freeze
深度冻结对象
Object.freeze的深度实现
例：<code>Utils.freeze({a:1});</code>

### copy
深度拷贝对象  
Object.assign的深度实现
例：<code>Utils.copy({a:1});</code>

### valueForKeypath
获取深度path的对象值
例：<code>Utils.valueForKeypath(obj,'a.b.c.d');</code>

### setValueForKeypath
对深度path的对象赋值
例：<code>Utils.setValueForKeypath(obj,'a.b.c.d',1);</code>


## toArray, toObject

### toArray
将object转换成array.   
<code>toArray(object,keyName,valueName)</code>   
例：  
```js
  Utils.toArray({a:1,b:1},'key','value');

  //结果
  [{
    key:'a',
    value:1
  },{
    key:'b',
    value:1
  }]


  Utils.toArray({a:{b:2,d:4},b:{c:2,e:5}},'id');

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
  Utils.toObject([{id:'a',b:2},{id:'b',b:2}],'id');

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


  Utils.toObject([{id:'a',b:2},{id:'b',b:2}],'id',true);

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


