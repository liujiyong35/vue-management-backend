<template>
  <!-- form_disabled 不可编辑数组名单未找到，暂时注释  -->
  <!-- <el-input v-model="value" type="textarea" debounce :rows="data.rows || 5" :disabled="form_disabled[data.prop]" :style="`width: ${data.width || '100%'}`" :placeholder="data.placeholder" @change="handlerChange" /> -->
  <el-input v-model="value" type="textarea" :disabled="disabled_control" debounce :rows="data.rows || 5" :style="`width: ${data.width || '100%'}`" show-word-limit :maxlength="data.maxlength || 128" :placeholder="data.placeholder" @change="handlerChange" />
</template>

<script>
import { reactive, toRefs, watch } from "vue";
import { props } from "../base"
export default {
  name: "TextareaComponent",
  props: {
    ...props,
  },
  emits: ["update:value", "callback"],
  setup(props, { emit }) {
    const data = reactive({
      value: props.value || "",
      data: props.data,
      disabled_control: false
    });

    /**
     * 监听数据的变化
     * 作用于重置数据时，检测为空时，重置为空
     */
    watch(() => props.value, (value) => { data.value = value })

    watch(() => props.disabled, (value) => {
        data.disabled_control = value
      },
      { immediate: true }
    );

    const handlerChange = (val) => {
      emit("update:value", data.value);
    };
    return {
      ...toRefs(data),
      handlerChange,
    };
  },
};
</script>
<style scoped>
:deep(.el-textarea__inner) {
  border-radius: 0;
}
</style>
