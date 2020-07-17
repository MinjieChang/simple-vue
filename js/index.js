function MyVue(option){

  const { data, el, methods } = option

  this.data = data
  this.methods = methods
  // 代理data的属性到this
  // this.xxx = this.data.xxx
  this.proxyData()

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