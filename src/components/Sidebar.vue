<template>
  <div class="sidebar">
    <el-menu v-if="items.length > 0" class="sidebar-el-menu" :default-active="onRoutes" background-color="#324157" text-color="#bfcbd9" :collapse="isCollapse" active-text-color="#20a0ff" unique-opened @select="selectMenu">
      <el-menu-item v-for="item in items" :index="item.index" :key="item.index">
        <i :class="['iconfont', item.icon]" :style="{ marginRight: '6px' }"></i>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { reactive, toRefs, computed, getCurrentInstance, watch } from "vue";
import { route_icon_list, route_name_list } from "@/mapData";
import { storeToRefs } from "pinia";
import { useLogin } from "@/store/login";
import { useData } from "@/store/data";
const { proxy } = getCurrentInstance();
// store
const useLoginStore = useLogin();
const useDataStore = useData();
const { permissions } = storeToRefs(useLoginStore);
const { collapse } = storeToRefs(useDataStore);
const state = reactive({
  items: computed(() => {
    if (permissions.value.length > 0) {
      return permissions.value.map((item) => {
        return {
          icon: route_icon_list[item.path],
          index: item.path,
          title: item.permissionName,
        };
      });
    } else {
      return [];
    }
  }),
  onRoutes: computed(() => {
    if (permissions.value.length > 0) {
      proxy.$eventBus.emit("setMemuVal", permissions.value[0].path);
      proxy.$eventBus.emit("setHeaderName", route_name_list[permissions.value[0].path]);
      // state.currentKey = store.state.login.permissions[0].path;
      return permissions.value[0].path;
    } else {
      return "";
    }
  }),
  currentKey: "",
  isCollapse: computed(() => {
    return collapse.value;
  }),
});
const { items, onRoutes, currentKey, isCollapse } = toRefs(state);
watch(
  () => state.onRoutes,
  (val) => {
    state.currentKey = val;
  }
);
const selectMenu = (val) => {
  if (state.currentKey !== val) {
    state.currentKey = val;
  } else {
    return;
  }
  proxy.$eventBus.emit("setMemuVal", val);
  proxy.$eventBus.emit("setHeaderName", route_name_list[val]);
};
</script>

<style scoped>
/* .sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
} */
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
