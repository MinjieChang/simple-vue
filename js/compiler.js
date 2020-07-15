function compiler(el, vm){
  this.el = document.querySelector(el)
  this.vm = vm
  this.init()
}

compiler.prototype = {
  init(){
    if(this.el){
      // 首先将 el转为fragment片段
      this.fragment = this.nodeToFragment(this.el)
      console.log(this.fragment, 'fragment')
      // 解析 fragment
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
    }else{
      console.error('root dom not found')
    }
  },
  nodeToFragment(el){
    let fragment = document.createDocumentFragment();
    let child = el.firstChild;
    while(child) {
      // 将Dom元素移入fragment中
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  },
  compileElement(el){
    let childNodes = el.childNodes;
    [].slice.call(childNodes).forEach(node => {
      // 判断 {{}}
      // console.log(node, 'element');
      // console.log(node.nodeType, 'nodeType');

      let reg = /\{\{(.*)\}\}/
      let text = node.textContent;
      
      if(this.isElementNode(node)){
        this.compile(node)
      }
      // 匹配文本节点，并且节点内容为 {{}} 这种格式
      if(this.isTextNode(node) && reg.test(text)){
        this.compileTextNode(node, reg.exec(text)[1])
      }
      // 判断节点是否还有子节点, 递归遍历节点
      if(node.childNodes && node.childNodes.length){
        this.compileElement(node)
      }
    })
  },
  // 解析dom节点
  compile(node) {
    // 解析自定义指令
    const attrs = Array.from(node.attributes);
    attrs.forEach(attr => {
      const name = attr.name
      if(this.isDirective(attr.name)){
        const dir = name.substring(2)
        const value = attr.value
        // 解析事件绑定
        if(this.isEventDirective(dir)){
          this.compileEvent(node, dir, value)
        }
        // 解析属性bind
        if(this.isBindDirective(dir)){
          this.compileBind(node, dir, value)
        }
        // 解析 v-model
        if(this.isModelDirective(dir)){
          console.log(dir, 'mm')
        }
        node.removeAttribute(name)
      }
    })
  },
  // 解析文本节点
  compileTextNode(node, exp){
    /**
     * 1、读取data中的值
     * 2、把值添加到dom中
     * 3、构建watcher，添加监听
     */
    const initText = getDataVal(this.vm, exp)

    this.updateText(node, initText);

    // 在这里 给data的每个属性添加一个监听者
    new watcher(this.vm, exp, (value) => {
      this.updateText(node, value)
    })
  },
  compileEvent(node, dir, method){
    //v-on:click="clickMe"
    // 给node绑定事件
    const eventName = dir.split(':')[1]

    const errorTip = () => {console.warn(`${bindMethod}未定义`)}

    let bindVmMethod = this.vm.methods[method]

    if (bindVmMethod) {
      bindVmMethod = bindVmMethod.bind(this.vm)
    }
    const bindMethod = bindVmMethod || errorTip

    node.addEventListener(eventName, bindMethod)
  },
  compileBind(node, dir, exp){
    // v-bind:href="url"
    const attr = dir.split(':')[1];

    const vmVal = this.vm[exp]

    node.setAttribute(attr, vmVal)
  },
  updateText(node, text = '') {
    node.textContent = text
  },
  // 是否为自定义指令
  isDirective(attr = ''){
    console.log(typeof attr, '999')
    return attr.indexOf('v-') > -1
  },
  isEventDirective(dir){
    return dir.trim().indexOf('on:') > -1
  },
  isBindDirective(dir){
    return dir.trim().indexOf('bind') > -1
  },
  isModelDirective(dir){
    return dir.trim().indexOf('model') > -1
  },
  isElementNode(node){
    return node.nodeType === 1
  },
  isTextNode(node){
    return node.nodeType === 3
  },
}