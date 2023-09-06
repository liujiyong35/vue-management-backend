<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">教务管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.email" placeholder="username">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="param.password" @keyup.enter="submitForm()">
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="permission">
          <div class="permission">
            <label class="label-word">权限</label>
            <el-select class="permission-select" v-model="param.permissionType" placeholder="Select" :style="{ width: '100%' }">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
            </el-select>
          </div>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" :loading="loading" @click="submitForm()">登录</el-button>
        </div>
        <p class="login-tips">Tips : 请填写账号和密码</p>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { apiLogin } from "../api";
import { setToken } from "../utils/storege";
import { reactive, toRefs, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { User, Lock } from "@element-plus/icons-vue";
const login = ref(null);
const router = useRouter();
const { proxy } = getCurrentInstance();
const state = reactive({
  param: {
    email: "123456@qq.com",
    password: "123456",
    permissionType: "3",
  },
  rules: {
    email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  },
  loading: false,
  options: [
    {
      value: "1",
      label: "管理员",
    },
    {
      value: "2",
      label: "教师",
    },
    {
      value: "3",
      label: "学生",
    },
  ],
});
const submitForm = () => {
  state.loading = true;
  login.value.validate((valid) => {
    if (valid) {
      apiLogin(state.param)
        .then((res) => {
          if (res.code === 200) {
            state.loading = false;
            proxy.$message.success("登录成功");
            setToken(res.data.token);
            router.push("/");
          } else {
            state.loading = false;
            proxy.$message.error(res.message);
          }
        })
        .catch(() => {
          state.loading = false;
        });
    } else {
      proxy.$message.error("请输入账号和密码");
      return false;
    }
  });
};
const { param, rules, loading, options } = toRefs(state);
</script>

<style lang="scss" scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/img/login-bg.jpg) no-repeat center center;
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
.permission {
  width: 100%;
  display: flex;
  align-items: center;
}
.label-word {
  width: 53px;
  text-align: center;
  color: #666;
  background-color: #f5f7fa;
  border-radius: 4px 0 0 4px;
  max-height: 30px;
  border: 1px solid #dcdfe6;
  border-right: none;
}
.permission-select {
  :deep(.el-input__wrapper) {
    border-radius: 0 4px 4px 0;
    box-sizing: border-box;
  }
}
</style>
