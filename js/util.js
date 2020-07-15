function getDataVal(data, exp = ''){
  
  const attrs = exp.split('.')

  return attrs.reduce((prev, next) => {
    return prev[next]
  }, data)
}