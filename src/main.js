import { createApp } from "vue";
import "./style.css";
import "element-plus/dist/index.css";
import App from "./App.vue";
import { setupStore } from "@/store";
import { setupRouter } from "@/router";
import { setupElementPlus } from "@/plugins/element";
import componentPlugin from "@/cd-components";
import "./assets/iconfont/iconfont.css";
import "./styles/index.scss"; // global css
// 总线程通信
import mitt from "mitt";

const app = createApp(App);
// 配置 store
setupStore(app);
// 配置 router
setupRouter(app);
// 配置 element-plus
setupElementPlus(app);
// 配置总线程通信
app.config.globalProperties.$eventBus = mitt();
app.use(componentPlugin);
// 挂载
app.mount("#app");
