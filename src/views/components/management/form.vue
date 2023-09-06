<template>
  <div class="management-form-warp">
    <CdForm class="management-form" :field="form_feild" :button="form_button" :item="form_item" labelWidth="55px" :buttonPosition="'Center'" :buttonStyle="{ marginTop: '12px' }"></CdForm>
  </div>
</template>
<script setup>
// import { apiGetUserInfo } from "../api";
import { reactive, toRefs, onBeforeUnmount } from "vue";
// import { setCookies } from "../utils/storege";
// import { COOKIES } from "../utils/types";
// import { useStore } from "vuex";
// const store = useStore();
// const { proxy } = getCurrentInstance();
const state = reactive({
  form_item: [
    {
      type: "input",
      prop: "departmentNum",
      label: "系编号",
    },
    {
      type: "input",
      prop: "departmentName",
      label: "系名称",
    },
    {
      type: "input",
      prop: "dean",
      label: "系主任",
      style: { marginBottom: "0px" },
    },
  ],
  form_button: [
    {
      key: "submit",
      label: "提交",
      type: "primary",
      callback: () => {
        console.log("提交");
        console.log(state.form_feild);
      },
    },
    {
      key: "cancel",
      label: "取消",
      callback: () => {
        console.log("取消");
      },
    },
  ],
  form_feild: {
    departmentNum: "",
    departmentName: "",
    dean: "",
  },
});
const { form_item, form_button, form_feild } = toRefs(state);

onBeforeUnmount(() => {});
</script>
<style lang="scss" scoped>
.about {
  background-color: #fff;
}
.management-form-warp {
  width: 30%;
  padding: 10px;
  background-color: #f0f0f0;
}
.management-form {
  padding: 10px;
  height: calc(100% - 20px);
  background-color: #fff;
}
</style>
