<template>
  <el-config-provider :locale="locale">
    <el-date-picker
      ref="datePickerRef"
      :class="data.className || ''"
      v-model="value"
      :style="`width: ${data.width || '100%'}`"
      :disabled="disabled"
      :type="data.date_module || 'datetime'"
      :format="data.format || 'YYYY-MM-DD'"
      :value-format="data.format_value || 'YYYY-MM-DD'"
      :placeholder="data.placeholder || '选择日期时间'"
      :start-placeholder="data.start_placeholder || '请选择开始日期'"
      :end-placeholder="data.end_placeholder || '请选择结束日期'"
      :range-separator="data.range_placeholder || '-'"
      :size="data.size || 'default'"
      :clearable="data.clearable"
      :disabled-date="disabledDate"
      :picker-options="data.pickerOptions"
      :defaultValue="data.defaultValue"
      @change="handlerChange"
      @visible-change="handlerVisibleChange"
    />
  </el-config-provider>
</template>

<script>
import { reactive, toRefs, watch, ref } from "vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { props } from "../base";
export default {
  name: "DateComponent",
  props: {
    ...props,
  },
  emits: ["update:value", "callback", "visible-change"],
  setup(props, { emit }) {
    const data = reactive({
      value: "",
      data: props.data,
    });
    const datePickerRef = ref(null);
    /**
     * 监听数据的变化
     * 作用于重置数据时，检测为空时，重置为空
     */
    watch(
      () => props.value,
      (value) => {
        data.value = value;
      },
      {
        immediate: true,
      }
    );

    const handlerChange = (val) => {
      // 是否范围数据
      const is_range = data?.data?.date_module && data?.data?.date_module.indexOf("range") !== -1;
      const value = !val ? (is_range ? ["", ""] : "") : val;
      emit("update:value", value);
      emit("callback", {
        type: "date",
        value,
        data: props.data,
      });
      if (props.data.callback && Object.prototype.toString.call(props.data.callback) === "[object Function]") {
        props.data.callback(value);
      }
    };
    const handlerVisibleChange = (val) => {
      emit("visible-change", val);
    };
    const handleOpen = () => {
      datePickerRef.value.handleOpen();
    };
    const disabledDate = (time) => {
      if (props.data.disabledDate && Object.prototype.toString.call(props.data.disabledDate) === "[object Function]") {
        return props.data.disabledDate(time);
      }
      return false;
    };
    return {
      ...toRefs(data),
      handlerChange,
      locale: zhCn,
      handlerVisibleChange,
      handleOpen,
      datePickerRef,
      disabledDate,
    };
  },
};
</script>
