<template>
  <div class="editor-img-update">
    <EditorUploadImage
      @change="handleUploadChange"
      :multiple="false"
      :cropper="false"
      :max-number="1"
      :is-base64="true"
    >
      <slot><a-button block type="primary" size="large"> 更换图片 </a-button></slot>
    </EditorUploadImage>
  </div>
</template>

<script lang="ts" setup name="EditorImgUpdate">
  import { inject, toRaw } from 'vue';
  import { createImgDom } from '../../editor/utils';
  import { UploadImage as EditorUploadImage } from '../Upload';
  import { addImage } from '../../editor/element';
  const { editor } = inject<any>('editor');

  function handleUploadChange(url: string) {
    updateImg(url);
  }
  // 替换图片
  async function updateImg(url: string) {
    const canvas = toRaw(editor.value.canvas);
    const stageRect = toRaw(editor.value?.stage?.stageRect);
    const activeObject = canvas.getActiveObjects()[0];
    const imgEl = await createImgDom(url);
    if (activeObject && activeObject.type === 'image') {
      const height = activeObject.get('height');
      const scaleX = activeObject.get('scaleX');
      activeObject.setSrc(imgEl.src, () => {
        const scaleH = (height * scaleX) / imgEl.height;
        activeObject.set('scaleX', scaleH);
        activeObject.set('scaleY', scaleH);
        canvas.renderAll();
      });
      imgEl.remove();
    } else {
      addImage(canvas, { imgEl, width: stageRect.width, height: stageRect.height });
      canvas.renderAll();
      imgEl.remove();
    }
  }
</script>

<style lang="less" scoped>
  .editor-img-update {
    display: block;
    width: 100%;
  }
  :deep(.ant-upload.ant-upload-select) {
    display: block;
  }
</style>
