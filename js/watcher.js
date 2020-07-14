function watcher(vm, exp, cb){
  console.log(exp, 'watcher')
  this.vm = vm
  this.exp = exp
  this.cb = cb
  this.value = this.init()
}

watcher.prototype.init = function () {
  // 强制执行 data的getter 函数
  
  let value = this.vm[this.exp]
}