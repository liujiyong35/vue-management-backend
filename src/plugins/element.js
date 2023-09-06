import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

function setupElementPlus(app) {
  app.use(ElementPlus, { locale: zhCn });
}

export { setupElementPlus };
