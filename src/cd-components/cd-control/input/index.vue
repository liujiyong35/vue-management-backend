<template>
  <div class="item-wrap">
    <el-input
      v-model.trim="value"
      :type="value_type"
      debounce
      :placeholder="placeholder"
      :show-word-limit="limit"
      :disabled="disabled_control"
      :maxlength="maxlength"
      :minlength="prop.minlength || 0"
      @input="handlerEnter"
    >
      <template v-if="data.suffix" #append>{{ data.suffix }}</template>
      <template v-if="data.prepend" #prepend>{{ data.prepend_value }}</template>
    </el-input>
    <i v-if="is_password" class="icon icon-16 icon-company" @click="toggle" />
    <div v-if="prop.tip" class="tips">{{ prop.tip }}</div>
  </div>
</template>

<script>
import { reactive, toRefs, watchEffect, watch, computed } from 'vue'
import { controlHook } from '../hook'
import { props } from '../base'
export default {
  name: 'InputComponent',
  props: {
    ...props,
  },
  emits: ['update:value', 'callback'],
  setup(props, { emit }) {
    const { control_init } = controlHook(props)
    const data = reactive({
      value: props.value || '',
      prop: props.data,
      placeholder: props.data.placeholder,
      is_password: false,
      value_type: 'text',
      Disabled: false,
      ...control_init,
      input_type: props.data.input_type || '',
      disabled_control: false,
    })

    watch(
      () => props.disabled,
      (newV) => {
        data.Disabled = newV
      },
      { immediate: true }
    )
    // 是否显示输入框
    const max = computed(() => {
      return data.prop?.max || 999999999
    })
    /**
     * 监听数据的变化
     * 作用于重置数据时，检测为空时，重置为空
     */
    watch(
      () => props.value,
      (value) => {
        data.value = value
      }
    )
    watch(
      () => props.disabled,
      (value) => {
        data.disabled_control = value
      },
      { immediate: true }
    )
    // 立即执行函数
    watchEffect(() => {
      if (['password', 'passwords'].includes(props.data.value_type)) {
        data.is_password = true
        data.value_type = 'password'
      }
    })
    // 切换文本类型
    const toggle = () => {
      data.value_type = data.value_type === 'password' ? 'text' : 'password'
    }
    // input框输入时
    const handlerEnter = (val) => {
      if (props.data.callback && Object.prototype.toString.call(props.data.callback) === '[object Function]') {
        props.data.callback(val)
      }
      if (data.input_type === 'number') {
        let value = val.trim()
        // 是否超出范围
        if (Number(val) > max.value) {
          data.value = max.value
          value = max.value
        }
        emit('update:value', value || '')
        return
      }
      emit('update:value', data.value || '')
    }

    return {
      ...toRefs(data),
      handlerEnter,
      toggle,
      max,
    }
  },
}
</script>

<style lans="scss" scoped>
.item-wrap {
  position: relative;
  width: 100%;
}
.icon {
  position: absolute !important;
  right: 8px;
  top: 8px;
  cursor: pointer;
}
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0 6px;
  border-radius: 0;
}
.tips {
  color: #e21818;
}
</style>
