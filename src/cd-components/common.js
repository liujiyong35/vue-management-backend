/**
 * 检测数据类型
 */
export function checkDataType() {
  const type_fun = {}
  const types = ['Number', 'String', 'Boolean', 'Array', 'Function', 'Null', 'Undefained', 'Set', 'Map', 'Object']
  types.forEach((item) => {
    const fun = `is${item}`
    type_fun[fun] = (value) => Object.prototype.toString.call(value) === `[object ${item}]`
  })
  return type_fun
}

/**
 * 防抖函数
 * @param { Function } func
 * @param { Number } wait
 * @returns
 */
export function debounce(func, wait = 300) {
  let timeout
  return function (event) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.call(this, event)
    }, wait)
  }
}

/**
 * 获取模块
 * @returns
 */
export function getModule() {
  return process.env.VUE_APP_MODULE
}
