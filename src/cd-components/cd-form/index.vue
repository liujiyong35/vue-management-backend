<template>
  <el-form
    ref="formDom"
    :model="field"
    :class="[
      {
        'label-gray': labelGray,
        hidden_redDot: hiddenRedDot,
        'label-block': labelBlock,
      },
    ]"
    :label-position="labelPosition"
    :loading="loadingMask"
    element-loading-text="加载中，请稍候"
    :label-width="label_width"
  >
    <el-row :gutter="gutter">
      <template v-for="item in form_item" :key="item.prop">
        <el-col class="relative" v-if="!form_hidden[item.prop]" :span="item.col || 24">
          <component :is="'htmlComponent'" v-if="item.type === 'html'" :prop="item" />
          <slot v-else-if="item.type === 'custom_slot'" :name="item.slot_name" :data="item"></slot>
          <el-form-item v-else :myattr="item.prop_field || item.prop" :label="item.label" :prop="item.prop" :rules="item.rules" :style="item.style || [styleItem]" :label-width="item.labelwidths">
            <slot name="item" :data="item"></slot>
            <!--自定义label-->
            <template v-if="item.label_html" #label>
              <span class="custom-label" :style="item.style || [styleItem]">
                <div>
                  <span style="position: relative">
                    <label class="form-center" v-html="item.label_html.label || ''" />
                    <em v-if="item.label_html.spot" class="spot"></em>
                  </span>
                </div>
                <span :class="item.label_html.suffix_class" @click="item.label_html.suffix_callback && item.label_html.suffix_callback(item)" v-html="item.label_html.suffix_text || ''" />
              </span>
            </template>
            <template v-if="item.label_slot" #label>
              <slot name="label_slot" :data="item"></slot>
            </template>
            <!--动态组件-->
            <div v-if="control" style="width: 100%">
              <span v-if="item.is_readonly">{{ fieldText[item.prop] || "--" }}</span>
              <template v-else>
                <component
                  :is="item.type + 'Component'"
                  v-if="item.type !== 'slot'"
                  v-model:value="field[item.prop]"
                  v-model:second-value="field[item.secondprop]"
                  v-model:select-value="field[item.selProp]"
                  :data="item"
                  :header="item"
                  :disabled="disabled[item.prop]"
                  :fieldData="fieldData"
                  @callback="componentCallback"
                />
                <!--插槽-->
                <template v-else>
                  <slot :name="item.slot_name" :data="item" />
                  <span v-if="item.tip" class="tip">{{ item.tip }}</span>
                </template>
              </template>
            </div>
            <div :class="{ 'ellipse-1': item.isEllipse }" v-if="!control">
              <slot v-if="item.slot_text" :name="item.slot_text" />
              <div v-else>
                <component :is="item.type + 'Component'" v-if="item.is_write" v-model:value="field[item.prop]" v-model:second-value="field[item.secondprop]" v-model:select-value="field[item.selProp]" :data="item" :header="item" :disabled="disabled[item.prop]" @callback="componentCallback" />
                <span :title="fieldText[item.prop] || '--'" v-else>{{ fieldText[item.prop] || "--" }}</span>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <!-- button -->
    <div :class="['form-button', { 'dialog-footer': dialog }, 'buttonPosition' + buttonPosition]" :style="buttonStyle">
      <template v-if="form_button && form_button.length > 0">
        <template v-for="button in form_button" :key="button.key">
          <template v-if="!button.hidden">
            <CdButton :class="{ rowButton: button.rowButton }" v-if="button.key === 'submit'" :size="button.size || 'small'" :disabled="button.disabled" :loading="load || loading" :block="button.block" :type="button.type" @click="button.callback ? button.callback() : handlerFormValidate()">
              {{ button.label }}
            </CdButton>
            <CdButton v-else-if="button.key === 'cancel'" :size="button.size || 'small'" :disabled="button.disabled" :border="button.border" @click="button.callback ? button.callback() : handlerFormCancel()">
              {{ button.label }}
            </CdButton>
            <CdButton v-else :size="button.size || 'small'" :type="button.type" :disabled="button.disabled" :loading="button.loading || load || loading" :border="button.border" @click="button.callback && button.callback()">
              {{ button.label }}
            </CdButton>
          </template>
        </template>
      </template>
    </div>
  </el-form>
</template>

<script>
import { defineAsyncComponent, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { checkDataType } from "../common.js";
// hook
import { rulesHook } from "./hook/rulesHook.js";
import { relationHook } from "./hook/relationHook.js";
// props
import { props } from "./props.js";
// import * as files from "@/cd-components/cd-control";

// require import components
// const files = require.context("@/cd-components/cd-control", true, /index.vue$/);
const files = import.meta.glob("../cd-control/*/*.vue");
// console.log(Object.entries(files));
const modules = {};
Object.keys(files).forEach((key) => {
  const name = key.split("/");
  modules[name[2] + "Component"] = defineAsyncComponent(() => import(key));
});

export default {
  name: "BasisForm",
  components: {
    ...modules,
    // inputComponent: defineAsyncComponent(() => import("../cd-control/input/index.vue")),

    // CdButton: defineAsyncComponent(() => import("../cd-button/index.vue")),
  },
  props,
  emits: ["callback", "cancel", "callAttrFun", "mounted"],
  setup(props, { emit }) {
    const { InitRules } = rulesHook();
    const { HiddenItem, DisabledItem } = relationHook();
    // 校验规则处理
    const form_item = reactive(InitRules(props.item));
    const label_width = ref(props.labelWidth);
    const form_button = reactive(props.button);
    const form_disabled = reactive(props.disabled);
    const load = ref(false);
    let form_hidden = ref({});
    watch(
      () => props.hidden,
      (value) => {
        form_hidden.value = value;
      },
      { immediate: true }
    );
    const formDom = ref(null);
    const handlerFormValidate = () => {
      formDom.value.validate((valid) => {
        if (valid) {
          if (checkDataType().isFunction(props.beforeChange)) {
            load.value = true;
            props
              .beforeChange()
              .then(() => {
                load.value = false;
              })
              .catch(() => {
                load.value = false;
              });
            return false;
          }
          emit("callback", true);
        }
      });
    };
    const formValidate = () => {
      return new Promise((resolve, reject) => {
        formDom.value.validate((valid) => {
          valid ? resolve() : reject();
        });
      });
    };
    const formValidateField = (name) => {
      return new Promise((resolve, reject) => {
        formDom.value.validateField(name, (valid) => {
          valid ? resolve() : reject();
        });
      });
    };
    const handlerFormCancel = () => {
      handlerFormReset();
      emit("cancel");
    };
    /** 清除指定字段校验信息 */
    const handlerClearValidate = (fields = []) => {
      formDom.value.clearValidate(fields);
    };
    /**
     * 重置表单
     */
    const handlerFormReset = () => {
      formDom.value.resetFields();
    };
    // change 事件
    const componentCallback = (params) => {};

    /**
     * 生命周期
     */
    onBeforeUnmount(() => {
      form_hidden.value = {};
      handlerFormReset();
    });
    onMounted(() => {
      emit("mounted");
      window.addEventListener("mouseup", (e) => {
        // e.path是谷歌特有属性
        const path = e.path || (e.composedPath && e.composedPath());
        const result = path.find((num) => {
          if (num?.attributes?.myattr) {
            return num;
          }
        });
        result && emit("callAttrFun", result.getAttribute("myattr"));
      });
    });

    return {
      form_item,
      label_width,
      form_button,
      form_hidden,
      form_disabled,
      formDom,
      load,
      handlerFormValidate,
      formValidate,
      formValidateField,
      handlerFormCancel,
      handlerFormReset,
      componentCallback,
      handlerClearValidate,
    };
  },
};
</script>
<style lang="scss" scoped>
:deep(.el-input__wrapper) {
  border-radius: 0;
}
.el-form {
  &.label-block {
    .el-form-item {
      display: block;
    }
    .el-form-item__label {
      width: auto !important;
      display: block;
    }
  }
}
.form-button {
  width: 100%;
}
.form-left {
  text-align: left;
}
.form-center {
  text-align: center;
}
.form-right {
  text-align: right;
}
.custom-label {
  position: relative;
  > span {
    float: right;
  }
}
::v-deep .color-lable-danger {
  width: 6px;
  height: 6px;
  background: #ff6060;
  border-radius: 50%;
  position: absolute;
  right: -7px;
  top: 7px;
}
:deep(.el-input__wrapper) {
  border-radius: 0;
}

.rowButton {
  width: 100% !important;
  margin: 0 !important;
}
.buttonPositionRight {
  display: flex;
  justify-content: flex-end;
}
.buttonPositionLeft {
  display: flex;
  justify-content: flex-start;
}
.buttonPositionCenter {
  display: flex;
  justify-content: center;
}
</style>
