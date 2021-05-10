# vue 简易版模拟

## 功能介绍

模拟实现vue的数据绑定、dom解析等基本功能

### observer

#### 1. 监听data对象

值改变模版自动更新

#### 2. 监听data对象深度属性

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

#### 1. 解析文本

- {{xxx}}

#### 2. 解析自定义指令

- v-bind
- v-model
- v-for

[在线演示](https://minjiechang.github.io/simple-vue/)

#### 3. 效果图

![image](https://pic.ioiox.com/images/2020/08/27/2c56e24390bfc7306be82f84a6d26285.gif)

## 启动

index.html 在浏览器中打开，或启动一个本地服务
