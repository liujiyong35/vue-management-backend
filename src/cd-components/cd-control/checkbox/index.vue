<template>
  <el-checkbox-group v-model="select_value" :disabled="disabled" @change="handlerChange">
    <el-checkbox v-for="checkbox in data.options" :label="checkbox.value" :key="checkbox.value">{{ checkbox.label }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { props } from '../base'
export default {
  name: 'CheckboxComponent',
  props: {
    ...props,
  },
  emits: ['update:value', 'callback'],
  setup(props, { emit }) {
    const data = reactive({
      select_value: props.value,
      data: props.data,
    })

    const handlerChange = (val) => {
      emit('update:value', val)
      emit('callback', {
        type: 'checkbox',
        value: val,
        data: props.data,
      })
    }
    return {
      ...toRefs(data),
      handlerChange,
    }
  },
}
</script>