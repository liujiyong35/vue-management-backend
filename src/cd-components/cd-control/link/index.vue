<template>
  <div v-if="value.length > 0 || value" class="link-text">
    <div v-if="Array.isArray(value)">
      <el-link type="primary" v-for="(item, index) in value" :key="index">
        <span class="ellipse" @click="onLinkHandler(data.enterprises[index])">{{ item.name }}<span v-if="value.length !== 1 && index !== value.length - 1">；</span></span>
      </el-link>
    </div>
    <div v-else>
      <el-link type="primary">
        <span class="ellipse" @click="onLinkHandler(data)">{{ value }}</span>
      </el-link>
    </div>
  </div>
  <div v-if="value.length === 0 || value === ''">--</div>
</template>

<script>
import { computed, reactive, toRefs, getCurrentInstance } from "vue";
// import { props } from "../../cd-table/control/props";
export default {
  name: "LinkComponent",
  props: {
    // ...props,
    isHttp: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    // 是否有右側插槽
    const state = reactive({});
    // 数据类型
    const dataType = computed(() => {
      return props.header?.dataType || "array";
    });
    // 是否多条数据
    const dataConfig = computed(() => {
      return props.header?.dataConfig || { name: "name", id: "id" };
    });
    // 文案提示位置
    const tooltipPosition = computed(() => {
      return props.header?.tooltipPosition || "top";
    });
    // 点击对应行事件
    const onLinkHandler = (data) => {
      if (props.isHttp) {
        const regHttp = /(http|https):\/\/([\w.]+\/?)\S*/gi;
        if (!props.value.match(regHttp)) {
          proxy.$message({
            message: "网址不合法",
            type: "warning",
          });
          return;
        }
      }
      // 传递对应行内容
      if (props.header.callback && Object.prototype.toString.call(props.header.callback) === "[object Function]") {
        props.header.callback(data);
      }
    };
    return {
      ...toRefs(state),
      dataType,
      dataConfig,
      tooltipPosition,
      onLinkHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.item-wrap {
  position: relative;
  width: 100%;
  .link-text {
    max-width: 100%;
    :deep(.el-link) {
      width: 100%;
      .el-link__inner {
        width: 100%;
        .ellipse {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          display: block;
          word-break: break-all;
        }
      }
    }
    span {
      cursor: pointer;
    }
  }
  .count {
    // width: 18%;
    margin-left: 4px;
    cursor: pointer;
  }
}
</style>
