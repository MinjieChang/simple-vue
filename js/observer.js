
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

function getArrayMethods() {
  //原生Array的原型
  const arrayProto = Array.prototype;
  const arrayMethods = Object.create(arrayProto);
  
  // 修改数组原型
  const proxyMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

  proxyMethods.forEach( method => {

    //缓存元素数组原型
    const original = arrayMethods[method]
    
    def(arrayProto, method, function() {

      let i = arguments.length
      const ob = this.__ob__
      const args = new Array(i)
      while (i--) {
        args[i] = arguments[i]
      }

      let insert = []
      switch (method) {
        case 'push':
        case 'unshift':
          insert = args
          break;
        case 'splice':
          insert = args.slice(2)
          break;
        default:
          break;
      }
      // 再次监听数组中新添加的元素
      if(insert.length && ob) {
        ob.observeArray(args)
      }
      //原始方法求值
      const result = original.apply(this, args)
      if(ob && ob.dep){
        ob.dep.notify()
      }
      return result
    })
  })
}

function proxyArr(arr){
  const arrayMethods = getArrayMethods()
  arr.__proto__ = arrayMethods
}

function dependArray(array){
  for (let i = 0; i < array.length; i++) {
    const ele = array[i];
    // 当数组的元素添加了监听者(__ob__)，需要给这个元素绑定观察者(Dep.target)
    // 这里有个缺陷是，数组中的基本数据类型没有绑定监听者，所以当元素变化是不会通知观察者的
    // {a: [1, 2, {b: 3}]}
    // 当 1 和 2 发生变动后，不会通知监听者，当 b 改变后，会通知
    if(ele && ele.__ob__ && ele.__ob__.dep){
      ele.__ob__.dep.addSub(Dep.target)
    }
    if(Array.isArray(ele)){
      dependArray(ele)
    }
  }
}

function observer(value, vm) {
  if (!value || typeof value !== 'object') {
      return;
  }
  return new Observer(value, vm);
};

function Observer(data, vm) {

  this.data = data
  this.vm = vm
  this.dep = new Dep()
  // 给每个类型为对象的子属性 添加 __ob__ 属性
  // {a: {b: 1}}
  // 就是给 a 属性添加 __ob__ 属性，此属性不可被枚举，如果可枚举将再次遍历this，造成死循环
  def(data, '__ob__', this)

  if(Array.isArray(data)){
    proxyArr(data)
    this.observeArray(data)
  } else {
    this.walk(data)
  }
}

Observer.prototype = {
  walk(obj) {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      this.defineReactive(obj, key, value)
    })
  },
  defineReactive(data, key, value) {
    // 对于子对象 再次监听 此时会返回一个新的 obs实例， 否则 childObj 为空
    // {a: {b: 1}}
    let childObj = observer(value, this.vm)

    const dep = new Dep()

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get(){
        // 这里要添加订阅者，那么订阅者是谁？
        if(Dep.target) {
          dep.addSub(Dep.target)
          if(childObj) {
            // 目的是，当子属性发生变更时，需要通知它的父级
            // 比如 {a: {b: 1}} 当 a.b = 3 发生变更后
            // 实际是修改的是 b， 但是此时也要通知 a的监听者
            childObj.dep.addSub(Dep.target)
            if(Array.isArray(value)) {
              // debugger
              // 值为数组的情况，给其中每个元素绑定监听事件
              dependArray(value)
            }
          }
        }
        return value
      },
      set(newVal){
        if(newVal === value){
          return
        }
        value = newVal;
        // 再次监听新添加的属性
        // data.a = {a: {b: 1}}
        childObj = observer(value, this.vm)
        // 通知订阅者
        dep.notify(newVal)
      }
    })
  },
  observeArray(data = []) {
    data.forEach(ele => {
      observer(ele, this.vm)
    })
  }
}

function Dep(){
  this.subs = []
}

Dep.target = null

Dep.prototype = {
  addSub(watcher) {
    this.subs.push(watcher)
  },
  notify(value){
    this.subs.forEach(watcher => {
      if(watcher){
        watcher.update(value)
      }
    })
  }
}