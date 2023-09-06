<template>
  <button type="button" class="cd-button" :disabled="disabled || loadings || load" :class="[theme, isBorder, isRound, sizes, blockCss, textCss, hoverTypeCss]" :style="[bgColorCss, marginCSS, minWidthCss, borderColorCss, borderStyleCss, cornerCss]" @click="change">
    <span :style="[textAlign]">
      <el-icon v-if="loadings || load" class="is-loading" style="margin-right: 4px">
        <Loading />
      </el-icon>
      <i v-if="iconPerfix" class="icon-prefix" :class="['iconfont', iconPerfix]" />
      <slot />
      <i v-if="iconSuffix" class="icon-suffix" :class="['iconfont', iconSuffix]" />
    </span>
  </button>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import { Loading } from "@element-plus/icons-vue";
import { debounce, checkDataType } from "../common";
export default {
  name: "CDButton",
  components: {
    Loading,
  },
  props: {
    type: {
      type: String,
      default: "",
    },
    hoverType: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "small",
    },
    minWidth: {
      type: String,
      default: "",
    },
    borderStyle: {
      type: String,
      default: "",
    },
    borderColor: {
      type: String,
      default: "",
    },
    perfix: {
      type: String,
      default: "",
    },
    suffix: {
      type: String,
      default: "",
    },
    corner: {
      type: String,
      default: "",
    },
    align: {
      type: String,
      default: "",
    },
    margin: {
      type: String,
      default: "",
    },
    bgColor: {
      type: String,
      default: "",
    },
    active: {
      type: String,
      default: "",
    },
    params: {
      type: [String, Object],
      default: "",
    },
    loading: Boolean, // 默认false
    border: Boolean, // 默认false
    round: Boolean, // 默认false
    disabled: Boolean, // 默认false
    block: Boolean, // 默认false
    text: Boolean, // 默认false
    beforeChange: Function,
  },
  emits: ["click"],
  setup(props, { emit }) {
    const state = reactive({
      load: false,
      // perfix_name: process.env.VUE_APP_MODULE,
    });

    // computed
    const loadings = computed(() => props.loading);
    const theme = computed(() => (props.type ? `cd-button-${props.type}` : ""));
    const sizes = computed(() => (props.size ? `cd-button-${props.size}` : ""));
    const isBorder = computed(() => (props.border ? "is-border" : ""));
    const isRound = computed(() => (props.round ? "is-round" : ""));
    const minWidthCss = computed(() => (props.minWidth ? { "min-width": props.minWidth } : ""));
    const borderColorCss = computed(() => (props.borderColor ? { "border-color": props.borderColor } : ""));
    const borderStyleCss = computed(() => (props.borderStyle ? { borderStyle: props.borderStyle } : ""));
    const iconPerfix = computed(() => props.perfix || "");
    const iconSuffix = computed(() => props.suffix || "");
    const blockCss = computed(() => (props.block ? "cd-button-block" : ""));
    const cornerCss = computed(() => (props.corner ? { "border-radius": props.corner } : ""));
    const marginCSS = computed(() => (props.margin ? { margin: props.margin } : ""));
    const bgColorCss = computed(() => (props.bgColor ? { "background-color": `${props.bgColor} !important` } : ""));
    const textCss = computed(() => (props.text ? "is-text" : ""));
    const hoverTypeCss = computed(() => (props.hoverType ? "cd-button-hover-" + props.hoverType : ""));
    const textAlign = computed(() => {
      const align = { left: "flex-start" };
      return props.align ? { "justify-content": align[props.align] } : "";
    });

    const change = debounce(function (e) {
      if (props.beforeChange && Object.prototype.toString.call(props.beforeChange) === "[object Function]") {
        state.load = true;
        props
          .beforeChange(props.params)
          .then((response) => {
            state.load = false;
          })
          .catch(() => {
            state.load = false;
          });
      }
      emit("click", e);
    }, 100);

    // const change = (e) => {
    // if (props.beforeChange && Object.prototype.toString.call(props.beforeChange) === '[object Function]') {
    //   state.load = true
    //   props
    //     .beforeChange(props.params)
    //     .then((response) => {
    //       state.load = false
    //     })
    //     .catch(() => {
    //       state.load = false
    //     })
    // }
    // emit('click', e)
    // }

    return {
      ...toRefs(state),
      theme,
      sizes,
      isBorder,
      isRound,
      minWidthCss,
      borderColorCss,
      borderStyleCss,
      iconPerfix,
      iconSuffix,
      blockCss,
      cornerCss,
      marginCSS,
      bgColorCss,
      textCss,
      textAlign,
      change,
      loadings,
      hoverTypeCss,
    };
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
