import request from "../utils/request";

export const fetchData = (query) => {
  return request({
    url: "./table.json",
    method: "get",
    params: query,
  });
};
export const getData = (query) => {
  return request({
    url: "/api/data",
    method: "get",
    params: query,
  });
};
export const apiRegister = (query) => {
  return request({
    url: "/api/register",
    method: "post",
    data: query,
  });
};
export const apiLogin = (query) => {
  return request({
    url: "/api/login",
    method: "post",
    data: query,
  });
};
export const apiGetUserInfo = (query) => {
  return request({
    url: "/api/getUserInfo",
    method: "get",
    params: query,
  });
};
