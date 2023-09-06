<template>
  <div class="city-address">
    <el-cascader :class="{ 'cd-cascader': !addressFlag }" ref="cascaderRef" model-value="itemValue" :props="props" :placeholder="data.placeholder || '请选择'" @change="change" />
    <div v-if="addressFlag" class="city-input-wrap"><el-input v-model="address" :disabled="!current_node" placeholder="请输入详细地址" @input="inputEnter" /></div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, computed } from 'vue'
import request from '@/utils/request'
import { checkDataType, debounce } from '../common'
import { props } from '../base'
export default {
  name: 'CityAreaComponent',
  props: {
    ...props,
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const state = reactive({
      itemValue: '',
      prop: props.data,
      address: '',
      current_node: null,
      props: {
        label: 'name',
        value: 'id',
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          getList(node?.data?.id || 0)
            .then((response) => {
              // 注：同vue2的区别，必须加上，否则选中的值不显示
              response.forEach((item) => {
                item.leaf = level >= 2
              })
              resolve(response)
            })
            .catch(() => {})
        },
      },
      check_data_type: checkDataType(),
    })
    // 定义ref
    const cascaderRef = ref()

    // 是否显示输入框
    const addressFlag = computed(() => {
      const is_bool = state.check_data_type.isBoolean(state.prop?.address)
      return is_bool ? state.prop?.address : true
    })

    // 异步获取数据
    const getList = (id) => {
      return new Promise((resolve, reject) => {
        request({
          url: '/configure/bdRegion/children',
          method: 'post',
          params: {
            parentId: id,
          },
        })
          .then((response) => {
            resolve(response.data)
          })
          .catch(() => {
            reject()
          })
      })
    }

    // 地址输入
    const inputEnter = debounce(function () {
      returnValue()
    }, 1000)

    // 省市区change事件
    const change = (val) => {
      const node = cascaderRef.value.getCheckedNodes()
      state.current_node = node[0]
      returnValue()
    }

    const returnValue = () => {
      const value = {
        id: state.current_node.data.fullIds,
        province: state.current_node.data.parentShortName,
        city: state.current_node.data.parentName,
        area: state.current_node.data.name,
        address: state.address,
        fullNames: state.current_node.data.fullNames.split('-').join('/'),
      }
      callbackFunction(value, state.current_node)
      emit('update:value', value)
    }

    const callbackFunction = (value, node) => {
      const is_function = state.check_data_type.isFunction(state.prop?.callback)
      is_function && state.prop.callback(value, node)
    }

    return {
      ...toRefs(state),
      cascaderRef,
      addressFlag,
      inputEnter,
      change,
      callbackFunction,
    }
  },
}
</script>

<style lang="scss" scoped>
.city-address {
  position: relative;
  width: 100%;
  display: flex;
  :deep(.cd-cascader) {
    width: 100%;
  }
}
.city-input-wrap {
  flex: 1;
  margin-left: 8px;
}
</style>
