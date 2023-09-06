<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <el-icon v-if="!isCollapse"><Fold /></el-icon>
      <el-icon v-else><Expand /></el-icon>
    </div>
    <div class="logo">教务管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip effect="dark" :content="message ? `有${message}条未读消息` : `消息中心`" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../assets/img/img.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
                <el-dropdown-item>项目仓库</el-dropdown-item>
              </a>
              <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script setup>
import { clearCookies } from "../utils/storege";
import { reactive, toRefs, computed } from "vue";
import { Expand, Fold } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useLogin } from "@/store/login";
import { useData } from "@/store/data";
// router
const router = useRouter();
// store
const useLoginStore = useLogin();
const useDataStore = useData();
const { user_name } = storeToRefs(useLoginStore);
const { collapse } = storeToRefs(useDataStore);
const state = reactive({
  fullscreen: false,
  name: "linxin",
  message: 2,
});
const { fullscreen, name, message } = toRefs(state);
const username = computed(() => {
  return user_name.value;
});
const isCollapse = computed(() => {
  return collapse.value;
});
const handleCommand = (command) => {
  if (command == "loginout") {
    clearCookies();
    useLoginStore.INITDATA();
    router.push("/login");
  }
};
const collapseChage = () => {
  useDataStore.SET_STATE([
    {
      key: "collapse",
      value: !collapse.value,
    },
  ]);
  // store.commit("data/SET_STATE", [{ key: "collapse", value: !store.state.data.collapse }]);
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
  user-select: none;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
