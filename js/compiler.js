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
  compile(node){},
  // 解析文本节点
  compileTextNode(node, exp){
    /**
     * 1、读取data中的值
     * 2、把值添加到dom中
     * 3、构建watcher，添加监听
     */
    // 注意，这里会到data 的getter方法
    const initText = this.vm[exp]

    this.updateText(node, initText);

    new watcher(this.vm, exp, function(value){
      console.log('watcher数据更新啦======', exp, value)
    })
  },
  updateText(node, text = '') {
    node.textContent = text
  },
  isElementNode(node){
    return node.nodeType === 1
  },
  isTextNode(node){
    return node.nodeType === 3
  },
}