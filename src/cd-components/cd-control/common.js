/**
 * 检测数据类型
 */
export function checkDataType() {
  const type_fun = {};
  const types = ["Number", "String", "Boolean", "Array", "Function", "Null", "Undefained", "Set", "Map", "Object"];
  types.forEach((item) => {
    const fun = `is${item}`;
    type_fun[fun] = (value) => Object.prototype.toString.call(value) === `[object ${item}]`;
  });
  return type_fun;
}
/**
 * 防抖
 */
export function debounce(func, wait = 500) {
  let timeout;
  return function(event) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.call(this, event);
    }, wait);
  };
}
/**
 * 数字类型，可以是小数
 */
export function checkNumber(value, fixed = 0) {
  const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{0,2})))$/;
  function checkpricenum(val) {
    let value = val;
    value = value.replace(/[^\d.]/g, ""); // 清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
    value = value
      .replace(".", "$#$")
      .replace(/\./g, "")
      .replace("$#$", ".");
    value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
    if (value.indexOf(".") < 0 && value != "") {
      // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      value = parseFloat(value);
    }
    return value;
  }
}
