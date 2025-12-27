import functionCore from './functionCore'

/**
 * 计算公式
 * @param {{text: string, marks: Array, value: Object}} params
 * @returns
 */
function calculate(params) {
  const { text, marks = [], value = {} } = params
  if (!text) return new Error('Error: #VALUE!')
  var str = text
  try {
    for(var key in value){
      while(str.indexOf(key) != -1){
        str = str.replace(key, value[key])
      }
    }

    str = str.replace(/\{\{.*?\}\}/g, match => match.slice(2, -2));

    // console.log('执行的str', str)
    const result = functionCore.executeFunction(str)
    return result
  } catch (e) {
    console.log('calculate执行失败，str：', str)
    const errorTypes = {
      TypeError: () => '类型错误',
      RangeError: () => '范围错误',
      SyntaxError: () => '语法错误',
      ReferenceError: () => {
        const regex = /^(\w+)\s+is\s+not\s+defined$/
        const match = e.message.match(regex)
        return match ? `${match[1]} 未定义` : '未定义的变量'
      },
    }
    const errorType = errorTypes[e.constructor.name]
    const errorMessage = errorType?.() || `其他错误: ${e.message}`
    return {
      error: true,
      message: errorMessage,
    }
  }
}

/**
 * 动态监听并返回计算结果
 * @param {VueContentInstance} vm 当前Vue实例
 * @param {Object} formData 计算公式所需的数据
 * @param {Object} formulaConf 计算公式配置
 * @param {Function} fn 回调函数
 * @returns {Function} 取消监听函数
 */
function formulaWatcher(vm, formData, formulaConf, fn) {
  const watchList = []
  const { key, value } = formData

  const toCalculate = () => {
    const data = calculate({
      value,
      marks: formulaConf.marks,
      text: formulaConf.text,
    })
    fn(data)
  }
  formulaConf.marks.forEach(mark => {
    const [preCode] = mark.enCode.split('.')
    const watchItem = vm.$watch(`${key}.${preCode}`, toCalculate)
    watchList.push(watchItem)
  })
  // 初始化计算
  toCalculate()
  return () => watchList.forEach(watchItem => watchItem())
}

export { calculate, formulaWatcher }
