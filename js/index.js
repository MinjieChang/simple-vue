function MyVue(option){

  const { data, el, methods, computed } = option

  this.data = data
  this.methods = methods
  this.computed = computed
  // 代理data的属性到this
  // this.xxx = this.data.xxx
  this.proxyData()
  
  // 代理计算属性
  this.proxyComputed()

  // 对象数据劫持
  observer(data, this)

  // 模版编译，初始化数据，建立watcher
  new compiler(el, this)

}

MyVue.prototype.proxyData = function() {
  Object.keys(this.data).forEach(key => {
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get(){
        return this.data[key]
      },
      set(val){
        this.data[key] = val
      }
    })
  })
}

/**
 * 代理计算属性 
 * computed: {
      getAge() {
        return this.a + this.g
      }
    },
 * 为什么 this.a 或者 this.b 改变后，getAge 的值会自动改变呢？
 * 当模版解析过程解析到 {{getAge}}，此时会创建一个watcher，并把Dep.target指向此watcher，监听 getAge 属性
 * 执行getAge的getter方法，走到 this.a 和 this.g
 * 此时会分别走到了 a 属性和 g属性的 gettter 方法，关键点来了，而此时的 Dep.target 还没有释放
 * 意味着在取 a 和 g 的getter的时候，会把监听 getAge 的 watcher添加到他们的依赖中
 * 意味着，当a和g被修改时(调用setter方法)，他们自己的watcher 及 getAge 的watcher都会被通知到！
 */
MyVue.prototype.proxyComputed = function() {
  Object.keys(this.computed).forEach(key => {
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get(){
        return this.computed[key].call(this)
      },
    })
  })
}