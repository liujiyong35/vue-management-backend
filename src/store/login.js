import { defineStore } from "pinia";
import { getCookies } from "@/utils/storege";
import { COOKIES } from "@/utils/types";
export const useLogin = defineStore("login", {
  state: () => {
    return {
      user_name: "",
      permissions: [],
    };
  },
  getters: {},
  actions: {
    /**
     * 更新state
     * @param { Object } this 对象
     * @param { Array } payload JSON串 key -> state对象的key，value更新的值
     */
    SET_STATE(payload) {
      if (Array.isArray(payload) && payload.length > 0) {
        payload.forEach((item) => {
          this[item.key] = item.value;
        });
      }
    },
    INITDATA() {
      this.user_name = "";
      this.permissions = [];
    },
  },
});
