import axios from "axios";
// ElementUI 单独引入
import { ElMessage, ElMessageBox } from "element-plus";
import { getToken, clearCookies } from "./storege";
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了2
  // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
  timeout: 5000,
});
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = getToken();
    if (token) {
      config.headers["X-Access-Token"] = token; // 携带token
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject();
  }
);

service.interceptors.response.use(
  (response) => {
    console.log(response, "response");
    if (response.status === 200) {
      return response.data;
    } else {
      Promise.reject();
    }
  },
  (error) => {
    // 检查状态码是否为 417
    if (error.response.status === 417) {
      // 获取服务器返回的数据
      const responseData = error.response.data;
      ElMessage({
        message: responseData.error,
        type: "error",
      });
      return Promise.reject(responseData);
      // 处理返回的数据...
    } else if (error.response.status === 401) {
      ElMessageBox.confirm("登录已过期，请重新登录", "提示", {
        showCancelButton: true,
        confirmButtonText: "重新登录",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            // instance.confirmButtonLoading = true;
            // instance.confirmButtonText = "执行中...";
            // setTimeout(() => {
            //   instance.confirmButtonLoading = false;
            //   done();
            // }, 1000);
            clearCookies();
            done();
            location.replace(import.meta.env.VUE_APP_LOGIN);
          } else {
            done();
          }
        },
      });
      // ElMessage({
      //   message: "登录已过期，请重新登录",
      //   type: "error",
      // });
      return Promise.reject(error);
    } else {
      console.error("Error:", error);
      return Promise.reject(error);
      // 错误处理...
    }
  }
);

export default service;
