import { createRouter, createWebHashHistory } from "vue-router";
// import createPermissionGuard from './guard'
import { routes } from "./routes";
import { getToken } from "../utils/storege";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});
router.beforeEach((to, from, next) => {
  const token = getToken();
  console.log(token, "token");
  if (!token && to.path !== "/login") {
    next("/login");
  } else if (token && to.path === "/login") {
    next("/home");
  } else {
    // next("/dashboard");
    next();
  }
  // document.title = `${to.meta.title} | vue-manage-system`;
  // const role = localStorage.getItem("ms_username");
  // if (!role && to.path !== "/login") {
  //   next("/login");
  // } else if (to.meta.permission) {
  //   // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
  //   role === "admin" ? next() : next("/403");
  // } else {
  //   next();
  // }
});
function setupRouter(app) {
  app.use(router);
  // createPermissionGuard(router)
}

export { router, setupRouter };
