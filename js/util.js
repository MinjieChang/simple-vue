function isObject(val){
  return Object.prototype.toString.call(val) === '[object Object]';
}

function isArray(val){
  return Object.prototype.toString.call(val) === '[object Array]';
}

function getDataVal(data, exp = ''){
  
  const attrs = exp.split('.')

  return attrs.reduce((prev, next) => {
    return prev[next] || {}
  }, data)
}

function obArray(data = []){
  data.forEach(ele => {
    if(isObject(ele)){
      Object.keys(ele).forEach(key => {
        getDataVal(ele, key)
      })
    }
    if(isArray(ele)) {
      obArray(ele)
    }
  })
}