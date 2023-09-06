<!--  -->
<template>
  <div class="range-wrap" :style="width" :class="[`cd-dom-${size}`,`${data?.className || ''}`]">
    <div>
      <el-input v-model.trim="start" :class="{'input-suffix': data.suffix}" :maxlength="maxlength" :placeholder="placeholderStart" @input="inputEnter" />
      <span v-if="data.suffix" class="suffix">{{ data.suffix }}</span>
    </div>
    <span class="separator">-</span>
    <div>
      <el-input v-model.trim="end" :class="{'input-suffix': data.suffix}" :maxlength="maxlength" :placeholder="placeholderEnd" @input="inputEnter" />
      <span v-if="data.suffix" class="suffix">{{ data.suffix }}</span>
    </div>
  </div>
</template>
<script>
import { computed, reactive, toRefs, watch } from 'vue';
import { checkDataType } from "../common";
import { controlHook } from "../hook";
import { props } from "../base"
  export default {
    name: 'Range',
    props: {
      ...props
    },
    emits: ['update:value'],
    setup(props, { emit }){
      const { control_init } = controlHook(props)
      const state = reactive({
        ...control_init,
        start: '',
        end: ''
      })
      const placeholderStart = computed(() => {
        return props.data?.placeholder_start || '请输入' + props.data.label
      })
      const placeholderEnd = computed(() => {
        return props.data?.placeholder_end || '请输入' + props.data.label
      })
      /**
       * 初始化还原数据
       */
       const initValue = () => {
        const is_array = props.value && checkDataType().isArray(props.value) && props.value.length === 2
        state.start = is_array ? props.value[0] : ''
        state.end = is_array ? props.value[1] : ''
      }
      watch(() => props.value, () => {
        if(!props.value) {
          return
        }
        initValue()
      }, { immediate: true })
      /**
       * 输入数据回调
       */
      const inputEnter = () => {
        emit('update:value', [state.start, state.end])
      }
      /**
       * 重置
       */
      const clear = () => {
        state.start = ''
        state.end = ''
      }
      return {
        ...toRefs(state),
        placeholderStart,
        placeholderEnd,
        clear,
        inputEnter,
        initValue
      }
    }
  }
</script>
<!-- <style src="../style.scss" lang="scss" scoped></style> -->
<style lang="scss" scoped>

.range-wrap {
  display: flex;
  border: 1px solid #dcdfe6;
  > div {
    position: relative;
    flex: 1;
  }
  input {
    display: inline-block;
    padding: 0 15px;
    margin: 0;
    border: none;
    outline: none;
    background: none;
    height: 100%;
    vertical-align: top;
    text-align: center;
  }

}
.suffix {
  position: absolute;
  right: 8px;
  font-size: 12px;
}
.separator {
  width: 50px;
  text-align: center;
}
:deep(.el-input__wrapper) { 
  box-shadow: none;
  background-color: #fff;
}
.range-input{
  display: flex;
  justify-content: center;
  align-items: center;
  >div{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :deep(.el-input__inner) {
    height: 28px;
  }
  .separator{
    line-height: 28px;
  }
}
</style>
