<template>
  <span v-if="prop_key && !tagList">
    {{ renderProp() }}
  </span>
  <template v-else-if="tagList">
    <span class="ellipse" :title="header?.showTitle ? renderTagList() : ''" v-html="renderTagList()" />
  </template>
  <template v-else-if="thousandth">
    <span class="ellipse" v-html="renderRhousandth()" />
  </template>
  <span v-else>{{ value || "--" }}</span>
</template>

<script>
import { computed, reactive } from "vue";
import { props } from "../base";
import { checkDataType } from "../common";
import { comdify } from "@/utils/amountFormat"
export default {
  name: "RenderTextComponent",
  props: {
    ...props,
  },
  setup(props, { emit }) {
    const state = reactive({
      empty: '--'
    })
    const prop_key = computed(() => props.header?.prop_key);
    const prop_conn = computed(() => props.header?.prop_conn || "-");
    const unit = computed(() => props.header?.unit || "");
    const tagList = computed(() => props.header?.value_type === 'tag_list')
    const thousandth = computed(() => props.header?.value_type === 'thousandth')

    const renderProp = () => {
      let str = "";
      const is_array = checkDataType().isArray(prop_key.value);
      if (is_array) {
        prop_key.value.forEach((item, index) => {
          const value = props.fieldData[item];
          if (value) {
            str += `${index > 0 ? prop_conn.value : ""}${value}`;
          }
        });
      } else {
        str = props.fieldData[prop_key.value];
      }
      // 如果存在单位
      unit.value && (str += `${unit.value}`);
      return str;
    };
    const renderTagList = () => {
      const value = props.fieldData[props.header.prop]
      const conn = props.header.prop_conn || ','
      const is_array = checkDataType().isArray(value)
      const is_string = checkDataType().isString(value)
      if (is_array && value.length > 0) {
        const str = value.map((v) => (props.header.prop_key ? (v[props.header.prop_key] ? v[props.header.prop_key] : '--') : (v ? v : '--')))
        return str.join(conn)
      }
      return is_string && value ? value : state.empty
    }
    // 千分位格式化
    const renderRhousandth = () => {
      let value = props.fieldData[props.header.prop]
      const hasFloat = props.header?.hasFloat ?? true
      const fixed = props.header?.fixed ?? 2
      if (value) {
        if (hasFloat) {
          value = (value * 1).toFixed(fixed)
        }
        return comdify(value.toString(), hasFloat) + unit.value
      } else {
        return state.empty
      }
    }
    return {
      prop_key,
      renderProp,
      tagList,
      thousandth,
      renderTagList,
      renderRhousandth
    };
  },
};
</script>

<style lang="scss" scoped>
.item-wrap {
  position: relative;
  width: 100%;
}
</style>
