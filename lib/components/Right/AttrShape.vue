<template>
  <div class="editor-attr">
    <div class="editor-attr__title">{{ title }}</div>
    <BaseStyle :activeObject="activeObjectRef" />
  </div>
</template>

<script lang="ts" setup name="EditorAttrShape">
  import { ref, watchEffect } from 'vue';
  import BaseStyle from './BaseStyle.vue';
  const props = defineProps({
    title: { type: String },
    activeObject: { type: Object },
  });

  const activeObjectRef = ref();
  // let state = reactive({
  //   fill: '#000',
  //   opacity: 100,
  // });
  // function getDefaultAttr() {
  //   const activeObject = activeObjectRef.value;
  //   state.fill = activeObject?.get('fill');
  //   state.opacity = activeObject?.get('opacity') * 100;
  // }
  watchEffect(() => {
    activeObjectRef.value = props.activeObject;
    // getDefaultAttr();
  });
</script>

<style lang="less" scoped>
  .editor-attr {
    &-title {
      align-items: center;
      color: #000;
      display: flex;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      margin-bottom: 10px;
    }
    &-card {
      background: #f7f7f7;
      border-radius: 10px;
      display: flex;
      height: 40px;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      margin-bottom: 10px;
    }
    &-item {
      cursor: pointer;
    }
  }
</style>
