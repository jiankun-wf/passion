<template>
  <div class="editor-attr">
    <div class="editor-attr__title">{{ title }}</div>
    <div class="editor-attr__group">
      <BaseStyle :activeObject="activeObjectRef" :types="['flip', 'opacity', 'shadow']" />
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorAttrImage">
  import { ref, watchEffect } from 'vue';
  import BaseStyle from './BaseStyle.vue';
  const props = defineProps({
    title: { type: String },
    activeObject: { type: Object },
  });
  const activeObjectRef = ref();
  watchEffect(() => {
    activeObjectRef.value = props.activeObject;
    // getDefaultAttr();
  });
</script>
