<!--  -->
<template>
  <div v-html="header.callback && header.callback(data)" />
</template>

<script>
  import { props } from "../base"
  export default {
    props: {
      ...props,
    },
    // data() {
    //   return {}
    // },
    // // 生命周期 - 创建完成（访问当前this实例）
    // created() {},
    // // 生命周期 - 挂载完成（访问DOM元素）
    // mounted() {},
  }
</script>
<style scoped>
  /* @import url(); 引入css类 */
</style>
