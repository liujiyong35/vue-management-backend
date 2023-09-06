<template>
  <div class="content-warp">
    <div>222</div>
    <div class="dis-flex form-and-table">
      <formSetting></formSetting>
      <tableManagement class="flex-1"></tableManagement>
    </div>
  </div>
</template>
<script setup>
// import { apiGetUserInfo } from "../api";
import { reactive, toRefs, getCurrentInstance, onBeforeUnmount } from "vue";
// import { setCookies } from "../utils/storege";
// import { COOKIES } from "../utils/types";
// import { useStore } from "vuex";
import formSetting from "./form.vue";
import tableManagement from "./table.vue";

// store
// const store = useStore();
const { proxy } = getCurrentInstance();
const state = reactive({
  tagsList: [],
  collapse: false,
  memu_val: "",
  header_name: "",
});
const { tagsList, collapse, header_name, memu_val } = toRefs(state);
const setMemuVal = (val) => {
  state.memu_val = val;
};

proxy.$eventBus.on("setMemuVal", setMemuVal);

onBeforeUnmount(() => {
  proxy.$eventBus.off("setMemuVal", setMemuVal);
});
</script>
<style lang="scss" scoped>
.content-warp {
  padding: 20px;
  background-color: #fff;
  height: calc(100% - 40px);
}
.form-and-table {
  height: calc(100% - 20px);
  // background-color: #f0f0f0;
  .flex-1 {
    margin-left: 10px;
  }
}
</style>
