function getDataVal(data, exp = ''){
  console.log(exp)
  const attrs = exp.split('.')
  console.log(attrs)

  return attrs.reduce((prev, next) => {
    return prev[next]
  }, data)
}