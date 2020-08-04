# vue 简易版

## 功能介绍

### observer

> 监听data对象

值改变模版自动更新

> 监听data对象深度属性

```js
{
  a: {
    b: 1
  }   
}
```

> 监听数组变异方法， 如push、pop等
```js
{
  c: [1, 2, ,3] 
}
```

### compiler

> 解析文本

- {{xxx}}

> 解析自定义指令

- v-bind
- v-model
- v-for

[在线演示](https://minjiechang.github.io/my-vue/)

> 效果图

![](http://qd13dqh4u.bkt.clouddn.com/myvue.gif)

## 启动

index.html 在浏览器中打开，或启动一个本地服务