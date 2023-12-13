<template>
  <div class="editor-attr">
    <div class="editor-attr__title">{{ title }}</div>
    <div class="editor-attr__group">
      <div class="editor-attr__row">
        <ImgUpdate>
          <button class="editor__btn primary block xl"> 更换图片 </button>
        </ImgUpdate>
      </div>
      <BaseStyle :activeObject="activeObjectRef" />
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorAttrImage">
  import { ref, watchEffect } from 'vue';
  import BaseStyle from './BaseStyle.vue';
  import ImgUpdate from '../ImgUpdate/index.vue';
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
