<!--  -->
<template>
  <div class="city-address">
    <el-cascader
      ref="cascader"
      collapse-tags
      collapse-tags-tooltip
      :clearable="clearable"
      v-model="val"
      :disabled="disabled"
      :popper-class="disabledLevel"
      :class="{ 'cascader-placeholder': default_value }"
      :size="size"
      :style="`width: ${data.width || '100%'}`"
      :props="prop"
      :options="options_data"
      @change="change"
      @visible-change="visibleChange"
      :placeholder="placeholders"
    />
    
    <div v-if="addressFlag" class="city-input-wrap">
      <el-input v-model="address" :maxlength="maxlength" @input="inputEnter" />
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { reactive, ref, watch, computed, toRefs } from 'vue'
import { checkDataType } from '../common'
import { controlHook } from '../hook'
import { props } from '../base'
export default {
  name: 'CityArea',
  props: {
    ...props,
    single: Boolean,
    lazy: {
      type: Boolean,
      default: true,
    },
    level_field: {
      type: Array,
      default: () => [],
    },
    beforeRender: Function,
  },
  emits: ['callback', 'update:value'],
  setup(props, { emit }) {
    const { control_init } = controlHook(props)
    const state = reactive({
      ...control_init,
      val: ref([]),
      valu: '111',
      value: {},
      address: '',
      default_value: '',
      current_node: null,
      size: 'default',
      options_data: [],
      prop: {
        label: 'name',
        value: 'id',
        lazy: true,
        checkStrictly: false,
        expandTrigger: 'click',
        multiple: false,
        lazyLoad(node, resolve) {
          const { level } = node
          getList(node?.data?.id || 0)
            .then((response) => {
              let data = response
              if (props.beforeRender) {
                data = props.beforeRender(data, level)
              }
              // 注：同vue2的区别，必须加上，否则选中的值不显示
              response.forEach((item) => {
                item.leaf = level >= 2
              })
              resolve(response)
            })
            .catch(() => {})
        },
      },
      level_field_arr: null,
      level_id: null,
      cascader: ref(null),
      maxlength: props.data?.maxlength || 255,
    })

    const placeholders = computed(() => {
      return removeStrSymbols(props.placeholder) || removeStrSymbols(props.header.placeholder) || '请选择'
    })
    const removeStrSymbols = (str) => {
      if(str){
        return str.trim().replace(/\/$/g, '')
      }else{
        return ''
      }
    }
    const addressFlag = computed(() => {
      // 只有为 Boolean 类型时赋值，否则默认为 true
      const is_bool = checkDataType().isBoolean(props.data?.address)
      return is_bool ? props.data.address : true
    })
    // 禁用指层级
    const disabledLevel = computed(() => {
      const disabledLevel = props.header?.disabled_level
      return disabledLevel ? 'cascader-hidden-' + disabledLevel : ''
    })

    const initValue = () => {
      const is_object = checkDataType().isObject(props.value)
      const is_array = checkDataType().isArray(props.value)
      if (is_array) {
        state.val = props.value
      }
      if (is_object) {
        state.address = props.value.address
        // 省市区
        state.default_value = props.value.value
        if (props.value?.ids && checkDataType().isObject(props.value?.ids)) {
          state.val = Object.values(props.value?.ids) || []
        }
      }
    }

    watch(
      () => props.value,
      () => {
        initValue()
      },
      { immediate: true }
    )
    // 启用多选
    watch(
      () => state.multiple,
      (newvalue) => {
        state.prop.multiple = newvalue
      },
      { immediate: true }
    )
    // 启用单选
    watch(
      () => state.radio,
      (newvalue) => {
        state.prop.checkStrictly = newvalue
      },
      { immediate: true }
    )
    watch(
      () => props.data.prop_key,
      (newvalue) => {
        state.level_id = newvalue
      },
      { immediate: true }
    )
    watch(
      () => props.data.level_field,
      (newvalue) => {
        state.level_field_arr = newvalue
      },
      { immediate: true }
    )
    // 更新值
    watch(
      () => props.options,
      (value) => {
        if (!value.length) {
          return false
        }
        'value', value
        state.options_data = value
      }
    )

    // const initValue = () => {
    //   const is_object = checkDataType().isObject(props.value);
    //   if (is_object) {
    //     state.address = props.value.address;
    //     // 省市区
    //     state.default_value = props.value.value;
    //   }
    // };

    /**
     * 异步获取数据
     */
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
          .catch(() => {})
      })
    }
    /**
     * 输入地址
     */
    const inputEnter = () => {
      const value = {
        address: state.address,
      }
      emit('update:value', value)
    }
    /** 选择 */
    const change = (val) => {
      const node = state.cascader.getCheckedNodes()
      state.current_node = state.multiple ? node : node[0]
      returnValue()
    }

    const returnValue = () => {
      state.value = state.multiple ? multiSelect() : radio()
      // callback
      const is_function = checkDataType().isFunction(props.header.callback)
      is_function && props.header.callback(state.value)
      // 回调父组件
      emit('callback', state.value)
      // 同步数据
      emit('update:value', state.value)
    }
    // 参数处理
    const radio = () => {
      const params = {}
      // 单选
      state.level_id &&
        state.current_node.pathValues.forEach((path, index) => {
          params[state.level_id[index]] = path
        })
      state.level_field_arr &&
        state.level_field_arr.forEach((key, index) => {
          params[state.level_field_arr[index]] = state.current_node.pathNodes[0].data[key]
        })
      const value = {
        id: state.current_node.data.fullIds,
        province: state.current_node.pathLabels[0],
        city: state.current_node.pathLabels[1],
        area: state.current_node.pathLabels[2],
        address: state.address,
        fullNames: state.current_node.data.fullNames.split('-').join(' / '),
        params,
      }
      return value
    }
    const multiSelect = () => {
      const params = {}
      // 多选
      let pathValuesArr = [[], [], []]
      state.current_node &&
        state.current_node.length > 0 &&
        state.current_node.forEach((item) => {
          const index = item.level - 1
          pathValuesArr[index].push(item.value)
        })
      state.level_id &&
        pathValuesArr.forEach((item, index) => {
          params[state.level_id[index]] = item
        })
      const value = {
        params,
      }
      return value
    }
    const visibleChange = (val) => {
      // if (!state.current_node) return
      // !val && returnValue()
    }
    const clear = () => {
      state.value = {}
      state.val = []
      state.default_value = ''
      // const cascader = state.cascader
      // if (cascader) {
      //   cascader.panel.checkedValue = []
      //   cascader.panel.activePath = []
      //   cascader.panel.syncActivePath()
      //   cascader.handleClear()
      // }
    }
    return {
      ...toRefs(state),
      clear,
      returnValue,
      inputEnter,
      change,
      visibleChange,
      addressFlag,
      disabledLevel,
      placeholders,
    }
  },
}
</script>
<style lang="scss" scoped>
.city-address {
  width: 100%;
  display: flex;
}
::v-deep .el-cascader {
  .el-input__inner {
    border-radius: 3px 0 0 3px;
  }
}
::v-deep .city-input-wrap {
  position: relative;
  flex: 1;
  .el-input__inner {
    border-left: none;
    border-radius: 0 3px 3px 0;
  }
}
</style>
<style lang="scss">
// ::v-deep .el-popper .is-light{
//   z-index: 9999 !important;
// }
.el-cascader .el-input__inner::-webkit-input-placeholder {
  color: #606266 !important;
}
.el-cascader .el-input__inner:-moz-placeholder {
  color: #606266 !important;
}
.el-cascader .el-input__inner::-moz-placeholder {
  color: #606266 !important;
}
.el-cascader .el-input__inner:-ms-input-placeholder {
  color: #606266 !important;
}
.el-cascader .el-input__inner::-ms-input-placeholder {
  color: #606266 !important;
}
.cascader-hidden-1 {
  > .el-cascader-panel > div:nth-child(1) {
    display: none;
  }
}
.cascader-hidden-2 {
  > .el-cascader-panel > div:nth-child(2) {
    display: none;
  }
}
.cascader-hidden-3 {
  > .el-cascader-panel > div:nth-child(3) {
    display: none;
  }
}
</style>
