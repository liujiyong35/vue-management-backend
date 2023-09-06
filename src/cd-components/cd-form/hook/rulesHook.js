import { moneyNValid } from "@/utils/amountFormat.js";
/**
 * @returns BasisForm组件创建校验规则
 */
export function rulesHook() {
  /**
   * @param {*} data 配置额外组件
   */
  const InitRules = (data = []) => {
    if (data.length === 0) {
      return false;
    }
    // 判断是否有required属性
    data.forEach((item) => {
      // 初始化规则数组
      let rulesArr = [];
      if (item.required) {
        const json = {
          required: true,
          message: item.message || item.required_msg || messageType(item).msg,
          trigger: item.trigger || "change",
        };
        rulesArr.push(json);
      }
      // 生成placeholder
      item.placeholder = item.placeholder || messageType(item).placeholder;
      // 是否有其他的校验规则
      const rule = item.rule;
      if (rule && Array.isArray(rule) && rule.length > 0) {
        rulesArr = rulesArr.concat(rule);
      }
      // price
      if (item.type === "price" && !item.rule) {
        const json = { validator: moneyNValid, trigger: "change" };
        rulesArr.push(json);
      }
      // 定义rules属性赋值
      item.rules = rulesArr;
    });
    return data;
  };
  /**
   *
   * @description 提示文本
   */
  const messageType = (data) => {
    let msg = "";
    switch (data.type) {
      case "input":
      case "wangeditor":
      case "price":
      case "range":
      case "textarea":
      case "area":
        msg = "请输入";
        break;
      case "upload":
        msg = "请上传";
        break;
      case "radio":
      case "checkbox":
      case "select":
      case "selectV":
      case "date":
      case "cascader":
        msg = "请选择";
        break;
      default:
        msg = "未定义";
    }
    return {
      msg: `${msg}${data.label}`,
      placeholder: `${msg}${data.label}`,
    };
  };
  return { InitRules };
}
