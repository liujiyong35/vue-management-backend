<template>
  <div class="about">
    <v-header />
    <div class="dis-flex sidebar-and-content">
      <v-sidebar />
      <div class="content-box flex-1" :class="{ 'content-collapse': collapse }">
        <!-- <v-tags></v-tags> -->
        <h4 class="header-content">{{ header_name }}</h4>
        <div class="content">
          <mainContent></mainContent>
          <!-- <router-view v-slot="{ Component }">
                    <transition name="move" mode="out-in">
                        <keep-alive :include="tagsList">
                            <component :is="Component" />
                        </keep-alive>
                    </transition>
                </router-view> -->
          <!-- <el-backtop target=".content"></el-backtop> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import vHeader from "@/components/Header.vue";
import vSidebar from "@/components/Sidebar.vue";
import mainContent from "./components/management/index.vue";
import { apiGetUserInfo } from "../api";
import { setCookies } from "../utils/storege";
import { COOKIES } from "../utils/types";
import { getCurrentInstance, reactive, toRefs, onBeforeUnmount, onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useLogin } from "@/store/login";
const { proxy } = getCurrentInstance();
const useLoginStore = useLogin();
const { user_name } = storeToRefs(useLoginStore);
const state = reactive({
  tagsList: [],
  collapse: false,
  header_name: "",
});
const setHeaderName = (val) => {
  state.header_name = val;
};
const { tagsList, collapse, header_name } = toRefs(state);
proxy.$eventBus.on("setHeaderName", setHeaderName);
onBeforeUnmount(() => {
  proxy.$eventBus.off("setHeaderName", setHeaderName);
});
onBeforeMount(() => {
  apiGetUserInfo().then((res) => {
    setCookies(COOKIES.USERNFO, res.data.username);
    useLoginStore.SET_STATE([
      {
        key: "user_name",
        value: res.data.username,
      },
      {
        key: "permissions",
        value: res.data.permissions,
      },
    ]);
    // store.commit("login/SET_STATE", [
    //   {
    //     key: "user_name",
    //     value: res.data.username,
    //   },
    //   {
    //     key: "permissions",
    //     value: res.data.permissions,
    //   },
    // ]);
  });
});

// mounted() {
//   console.log(this.$store.state.tagsList, "this.$store.state");
//   apiGetUserInfo().then((res) => {
//     console.log(res);

//   });
// },
// computed: {
//   tagsList() {
//     return this.$store.state.tagsList.map((item) => item.name);
//   },
//   collapse() {
//     return this.$store.state.collapse;
//   },
// },
</script>
<style lang="scss" scoped>
.about {
  height: 100%;
}
.sidebar-and-content {
  height: calc(100% - 70px);
}
.header-content {
  padding: 0 10px;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  font-size: 16px;
  color: #303133;
}
</style>
