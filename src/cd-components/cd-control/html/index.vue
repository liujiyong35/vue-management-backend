<!--  -->
<template>
  <div>
    <div v-if="prop.label" class="html-label" :style="prop.style">{{ prop.label }}</div>
    <div v-html="prop.content" />
  </div>
</template>

<script>
export default {
  name: 'HTMLCom',
  props: {
    prop: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
<style scoped>
  .html-label {
    margin-bottom: 15px;
    font-size: 14px;
    font-weight: bold;
    color: #333333
  }
</style>
