<template>
  <ul class="smapli-options-list" :class="['smapli-options-' + size]">
    <li v-for="item in options" :key="item.vlaue" :class="[{ active: multiple ? item.active : active === item.value }]" @click="change(item)">
      <span>{{ item.label }}</span>
    </li>
  </ul>
</template>

<script>
import { computed, watch, reactive, toRefs } from "vue";
import { checkDataType } from "../common";
import { props } from "../base";
export default {
  name: "SampleComponent",
  props: {
    ...props,
  },
  setup(props, { emit }) {
    const state = reactive({
      prop: props.data,
      active: "",
      check_data_type: checkDataType(),
    });
    // 尺寸
    const size = computed(() => {
      return state?.prop?.size || "small";
    });
    // 选择列表
    const options = computed(() => {
      return state?.prop?.options || [];
    });
    // 是否多选
    const multiple = computed(() => {
      return state?.prop?.multiple || false;
    });
    // 默认值
    const defaultValue = computed(() => {
      return state?.prop?.default_value;
    });
    //  回调函数
    const callback = computed(() => {
      return state?.prop?.callback;
    });

    // 监听更改初始化默认值
    watch(
      () => options.value,
      (newValue) => {
        initDefaultChange();
      },
      {
        immediate: true,
      }
    );

    // 初始化默认值函数
    function initDefaultChange() {
      if (!defaultValue.value) return false;
      const is_array = state.check_data_type.isArray(defaultValue.value);
      if (is_array && defaultValue.value.length > 0) {
        defaultValue.value.forEach((item) => {
          const option = options.value.filter((option) => option.value === item);
          if (option.length > 0) {
            option[0].active = true;
          }
        });
      } else {
        state.active = defaultValue.value;
      }
    }
    // 列表change事件
    const change = (data) => {
      // 如果是多选
      const is_multiple = multiple.value;
      if (is_multiple) {
        data.active = !data.active;
      } else {
        state.active = data.value;
      }
      // 回调
      if (callback.value && state.check_data_type.isFunction(callback.value)) {
        callback.value(data);
      }
    };

    return {
      ...toRefs(state),
      size,
      options,
      multiple,
      defaultValue,
      callback,
      initDefaultChange,
      change,
    };
  },
};
</script>

<style lang="scss" scoped>
.smapli-options-list {
  display: flex;
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    // min-width: 88px;
    padding: 9px 25px;
    border: 1px solid #333;
    text-align: center;
    cursor: pointer;
    border-radius: 2px;
    span {
      line-height: 1;
    }
    // @include webkit(box-sizing, border-box);
    &.active {
      // color: $primary;
      // border-color: $primary;
    }
    + li {
      margin-left: 8px;
    }
  }
}
.smapli-options-small {
  height: 32px;
}
</style>
