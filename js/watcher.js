function watcher(vm, exp, cb){
  this.vm = vm
  this.exp = exp
  this.cb = cb
  this.value = this.init()
}

watcher.prototype = {
  init(){
    // 缓存自己，把这个watcher添加进监听者花名册中
    Dep.target = this

    // 强制执行 data的getter 函数，从而通过Dep把这个watcher添加进监听者花名册中
    // 也就是 dep.subs 中
    let value = getDataVal(this.vm, this.exp)

    // 监听者被添加后释放自己，避免被重复缓存
    Dep.target = null

    return value
  },
  update(value) {
    let oldVal = this.value
    if(oldVal !== value ){
      this.cb.call(this.vm, value, oldVal)
    }
  },
}