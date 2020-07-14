
// 代理数组的方法
function proxyArr() {
  const arrMethods = ['push', 'pop', 'shift', 'unshift'];
  arrMethods.forEach(method => {
    let originalMethod = Array.prototype[method];
    Array.prototype[method] = function(...args) {
      console.log(originalMethod, method)
      eval(originalMethod, ...args);
    }
  })
}


function defineReactive(data, key, value){
  // 对value继续遍历，如果是对象，则继续代理
  observer(value)
  const dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get(){
      // 这里要添加订阅者，那么订阅者是谁？
      console.log(key, 'get key')
      if(Dep.target) {
        dep.addSub(Dep.target)
      }
      return value
    },
    set(newVal){
      if(newVal === value){
        return
      }
      value = newVal;
      // 这里要通知订阅者
      dep.notify(newVal)
    }
  })
}

function observer(obj) {
  if(!obj || typeof obj !== 'object') {
    return
  }
  // 代理数组 Todo
  // if(Array.isArray(obj)){
  //   proxyArr()
  // }
  // 代理对象
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    defineReactive(obj, key, value)
  })
}

function Dep(){
  this.subs = []
}

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