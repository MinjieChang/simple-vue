function observer(data, vm) {

  this.data = data
  this.vm = vm

  this.walk(this.data)
  
}

observer.prototype = {
  walk(obj) {
    if(!obj || typeof obj !== 'object') {
      return
    }
    // 代理对象
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      this.defineReactive(obj, key, value)
    })
  },
  defineReactive(data, key, value) {
    this.walk(value)
    const dep = new Dep()
    let self = this

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get(){
        // 这里要添加订阅者，那么订阅者是谁？
        if(Dep.target) {
          dep.addSub(Dep.target)
        }
        // 判断数组的情况
        if(Array.isArray(value) && Dep.target) {
          self.proxyArr(key, dep)
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
  },
  proxyArr(key, dep){
    //原生Array的原型
    const arrayProto = Array.prototype;
    const arrayMethods = Object.create(arrayProto);

    const proxyMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

    const self = this

    proxyMethods.forEach(method => {

      const original = arrayMethods[method]//缓存元素数组原型

      const decoratedMethod = function() {
        let i = arguments.length
        const args = new Array(i)
        while (i--) {
          args[i] = arguments[i]
        }
        //原始方法求值
        const result = original.apply(self.vm[key], args)
        dep.notify()
        return result
      }

      this.def(arrayProto, method, decoratedMethod)
    })
  },
  def(obj, key, val, enumerable = true) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  },
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