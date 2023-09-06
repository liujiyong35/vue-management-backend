<template>
  <div class="select-chain-wrap">
    <el-select v-model="selValue" :multiple="data.multiple" collapse-tags :filterable="data.filterable" :allow-create="data.allowCreate" :disabled="disabled" :style="`width: ${data.width || '100%'}`" :placeholder="data.placeholder || '请选择'" @change="callback">
      <el-option v-for="item in option_data" :key="item[select_props.value]" :label="item[select_props.label]" :value="item[select_props.value]" />
    </el-select>
    <el-input :maxlength="maxlength2" v-model.trim="firstValue" class="first-input" :placeholder="placeholder1" @input="callback" />
    <el-input :maxlength="maxlength1" v-model.trim="secondvalue" :placeholder="placeholder2" @input="callback" />
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, watch, computed } from "vue";
import { useStore } from "vuex";
import { props } from "../base";
import { checkDataType } from "../common";

export default {
  name: "SelectChainComponent",
  props: {
    ...props,
  },
  emits: ["update:value", "update:secondValue", "update:selectValue"],
  setup(props, { emit }) {
    // store
    const store = useStore();
    // data
    const state = reactive({
      prop: props.data,
      options: props.data.options,
      placeholder1: props.data.placeholder1 || "请输入关键字",
      placeholder2: props.data.placeholder2 || "请输入关键字",
      firstValue: "",
      secondvalue: "",
      selValue: "",
      option_data: [],
      maxlength1:props.data?.maxlength1 || 64,
      maxlength2:props.data?.maxlength2 || 64
    });
    // 监听
    watch(
      () => state.prop.options,
      (newValue) => {
        if (!newValue) {
          return false;
        }
        state.option_data = newValue || [];
      },
      {
        immediate: true,
      }
    );
    watch(
      () => props.value,
      () => {
        initValue();
      },
      {
        immediate: true,
      }
    );
    // 初始化value
    function initValue() {
      const is_object = checkDataType().isObject(props.value);
      if (is_object) {
        state.selValue = props.value.selProp == 0 ? "" : props.value.selProp;
        state.firstValue = props.value.prop;
        state.secondvalue = props.value.secondprop;
        emit("update:value", state.firstValue);
        emit("update:secondValue", state.secondvalue);
        emit("update:selectValue", state.selValue);
        return;
      }
    }
    const select_props = computed(() => {
      const label = state?.prop?.props?.label;
      const value = state?.prop?.props?.value;
      // 只处理字典数据
      if (state?.prop?.dict_key) {
        return {
          label: label || "dictItemValue",
          value: value || "dictItemIndex",
        };
      }
      return {
        label: label || "label",
        value: value || "value",
      };
    });
    /** 获取列表 */
    const getData = () => {
      if (state.prop?.dict_key) {
        // 获取字典数据
        const dict_item = store.state.crmdata.dict_item;
        state.option_data = dict_item[state.prop.dict_key] || [];
      }
    };
    const callback = () => {
      emit("update:value", state.firstValue);
      emit("update:secondValue", state.secondvalue);
      emit("update:selectValue", state.selValue);
      let dataConfig = {
        value: state.firstValue,
        secondValue: state.secondvalue,
        selectValue: state.selValue,
      };
      const is_function = checkDataType().isFunction(state.prop.callback);
      if (state.prop.callback && is_function) {
        state.prop.callback(dataConfig);
      }
    };
    /** 生命周期挂载之前 */
    onBeforeMount(() => {
      getData();
    });
    return {
      ...toRefs(state),
      select_props,
      callback,
    };
  },
};
</script>

<style lang="scss" scoped>
.select-chain-wrap {
  display: flex;
  position: relative;
  width: 100%;
  :deep(.el-select) {
    min-width: 90px;
  }
}
.first-input {
  margin: 0 8px;
}
</style>
