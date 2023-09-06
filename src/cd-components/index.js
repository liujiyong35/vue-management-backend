import FormComponent from "./cd-form/index.vue";
import ButtonComponent from "./cd-button/index.vue";
export default {
  install(Vue) {
    Vue.component("CdForm", FormComponent);
    Vue.component("CdButton", ButtonComponent);
  },
};
