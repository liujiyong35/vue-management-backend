<template>
  <div>right</div>
</template>
<script setup>
// import { apiGetUserInfo } from "../api";
import { reactive, toRefs, onBeforeUnmount } from "vue";
// import { setCookies } from "../utils/storege";
// import { COOKIES } from "../utils/types";
// import { useStore } from "vuex";
// store
// const store = useStore();
// const { proxy } = getCurrentInstance();
const state = reactive({});
const {} = toRefs(state);
onBeforeUnmount(() => {});
</script>
<style lang="scss" scoped>
.about {
  background-color: #fff;
}
</style>
