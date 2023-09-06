<template>
  <template v-if="!data.options && data.callback && data.callback(data)"></template>
  <el-radio-group v-else v-model="select_value" :disabled="disabled" @change="handlerChange">
    <el-radio v-for="radio in data.options" :key="radio[data.key_value] || radio.value" :label="radio[data.key_value] || radio.value" :disabled="radio.disabled">
      <div class="radio-wrap">
        {{ radio[data.key_label] || radio.label }}
        <i v-if="showIcon" :class="['iconfont-' + module_name, iconSuffix, 'ml-8']"></i>
        <slot v-if="isSlot" :data="radio" :name="radio.slot_name"></slot>
      </div>
    </el-radio>
  </el-radio-group>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
// API
import { props } from '../base'
export default {
  name: 'DateComponent',
  props: {
    ...props,
    iconSuffix: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value', 'callback'],
  setup(props, { emit }) {
    const data = reactive({
      select_value: props.value,
      data: props.data,
      module_name: process.env.VUE_APP_MODULE,
    })
    watch(
      () => props.value,
      (newV) => {
        data.select_value = newV
      }
    )
    const handlerChange = (val) => {
      emit('update:value', val)
      emit('callback', {
        type: 'radio',
        value: val,
        formItem: props.data,
      })
    }
    return {
      ...toRefs(data),
      handlerChange,
    }
  },
}
</script>
<style lang="scss" scoped>
.radio-wrap {
  display: flex;
  align-items: center;
}
</style>
