// js-cookies 包
import Cookies from "js-cookie";
// type
import { COOKIES } from "./types";
// 开发环境
// const is_dev = process.env.VUE_APP_ENV === "LOCAL";
/**
 * 获取 token
 */
export function getToken() {
  return getCookies(COOKIES.TOKEN);
}
export function setToken(token) {
  return Cookies.set(COOKIES.TOKEN, token);
}
/**
 * 获取userid
 */
export function getUserId() {
  return getCookies(COOKIES.USERID);
}
/**
 * 获取 cookies 存储
 * @param { String } name * 键名
 * @returns { String }
 */
export function getCookies(name) {
  const cookieValue = Cookies.get(name);
  if (cookieValue) {
    try {
      // 尝试解析为 JSON 对象
      return JSON.parse(cookieValue);
    } catch (error) {
      // 如果解析失败，说明存储的是普通字符串
      return cookieValue;
    }
  }
  return null;
}
/**
 * 存储 cookies 存储
 * @param { String } name * 键名
 * @param { Any } name * 数据
 */
export function setCookies(name, data) {
  // 如果数据是字符串，直接存储
  if (typeof data === "string") {
    Cookies.set(name, data);
  }
  // 如果数据是对象，将其转换为 JSON 字符串后存储
  else if (typeof data === "object") {
    Cookies.set(name, JSON.stringify(data));
  }
  // 其他情况下，不支持的数据类型，您可以根据需求添加处理逻辑
  else {
    console.error("Unsupported data type:", typeof data);
  }
}
/**
 * 删除 cookies 存储
 * @param { String } name * 键名
 */
export function removeCookies(name) {
  Cookies.remove(name);
}
/**
 * 清除 cookies
 */
export function clearCookies() {
  removeCookies(COOKIES.TOKEN);
  removeCookies(COOKIES.USERNFO);
  // removeCookies(COOKIES.TENANTID);
}

/**
 * 获取 长久级 存储
 * @param { String } name * 键名
 * @returns { String }
 */
export function getLocal(name) {
  return localStorage.getItem(name);
}
/**
 * 存储 长久级 存储
 * @param { String } name * 键名
 * @param { Any } name * 数据
 */
export function setLocal(name, data) {
  localStorage.setItem(name, data);
}
/**
 * 删除 长久级 存储
 * @param { String } name * 键名
 */
export function removeLocal(name) {
  localStorage.removeItem(name);
}
/**
 * 获取 会话级 存储
 * @param { String } name * 键名
 * @returns { String }
 */
export function getSession(name) {
  return sessionStorage.getItem(name);
}
/**
 * 存储 会话级 存储
 * @param { String } name * 键名
 * @param { Any } name * 数据
 */
export function setSession(name, data) {
  sessionStorage.setItem(name, data);
}
/**
 * 删除 会话级 存储
 * @param { String } name * 键名
 */
export function removeSession(name) {
  sessionStorage.removeItem(name);
}

export function clearStorage(form, to) {
  if ((form.path === "/userImport" && to.path === "/organization") || (form.path === "/organization" && to.path === "/userImport")) {
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("failList");
  }
}

/**
 * 设置工作台token
 */
export function setWorkBenchToken() {
  Cookies.set("user_token", getToken(), { path: "", domain: process.env.VUE_APP_WORKBENCH_TOKEN });
  Cookies.set("user_id", getUserId(), { path: "", domain: process.env.VUE_APP_WORKBENCH_TOKEN });
}
/**
 * 清除工作台token
 */
export function clearWorkBenchToken() {
  Cookies.set("user_token", "", { path: "", domain: process.env.VUE_APP_WORKBENCH_TOKEN });
  Cookies.set("user_id", "", { path: "", domain: process.env.VUE_APP_WORKBENCH_TOKEN });
}
