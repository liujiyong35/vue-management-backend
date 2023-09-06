// 正数规则
const money_positive = /^(-?[0-9]{1}|^[1-9]{1}\d{1,15})(\.\d{1,2})?$/
const money_is_negative = /((^-?[1-9]\d*)|^-?0)(\.\d{0,2}){0,1}$/
// 最大金额
const max_money = 999999999
/**
 * 金额添加千分位
 */
export const comdify = function (n, hasFloat = true) {
  if (!n) return 0
  const str = n.split('.')
  const re = /\d{1,3}(?=(\d{3})+$)/g
  const n1 = str[0].replace(re, '$&,')
  return str.length > 1 && str[1] ? `${n1}.${str[1]}` : `${n1}${hasFloat ? '.00' : ''}`
}
/**
 * 去除千分位中的‘，’
 */
export const delcommafy = function (num) {
  if (!num) return num
  num = num.toString()
  num = num.replace(/,/gi, '')
  return num
}
/**
 * 金额校验回调
 */
export const valdatePrice = function (rule, val, callback) {
  if (val) {
    const input_vlaue = parseInt(delcommafy(val))
    if (input_vlaue > max_money) {
      callback(new Error(`不能大于${max_money}`))
    } else if (rule.test(input_vlaue)) {
      if (callback) {
        callback()
      } else {
        return true
      }
    } else {
      if (callback) {
        callback(new Error('输入的数字不能超过16位，且不能超过2位小数'))
      } else {
        return false
      }
    }
  } else {
    if (callback) {
      callback()
    } else {
      return true
    }
  }
}
// 验证金额数字可以为负数
export function moneyValid(rule, val, cb) {
  return valdatePrice(money_is_negative, val, cb)
}
// 验证金额数字不可以为负数
export function moneyNValid(rule, val, cb) {
  return valdatePrice(money_positive, val, cb)
}
// 获取输入框的值
export const getInputValue = (value) => {
  if (!value || value == 0) return ''
  if (!moneyNValid('', value)) {
    return value
  }
  return comdify(delcommafy(value))
}
// 获取初始化输入框的值
// export const getInitInputValue = (value) => {
//   if (!value || value == 0) return "";
//   return comdify(delcommafy(value));
// };
