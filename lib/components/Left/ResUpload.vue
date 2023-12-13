<template>
  <div class="editor-upload">
    <div class="editor-upload-add">
      <ImgUpdate>
        <a-button block type="primary" size="large"> 上传本地图片 </a-button>
      </ImgUpdate>
    </div>
    <div class="editor-upload-card" v-for="(item, index) in dataList" :key="index">
      <div class="editor-upload-card-title">{{ item.title }}</div>
      <div class="editor-upload-card-list">
        <div
          class="editor-upload-item"
          v-for="(itemC, indexC) in item.children"
          :key="indexC"
          :draggable="true"
          @dragend="handleAdd(itemC.url)"
          @click="handleAdd(itemC.url)"
        >
          <img :src="itemC.url" :alt="itemC.title" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorResUpload">
  import { inject, onMounted, onUnmounted, ref, toRaw } from 'vue';
  import { addImage } from '../../editor/element';
  import { createImgDom } from '../../editor/utils';
  import ImgUpdate from '../ImgUpdate/index.vue';
  const { editor } = inject<any>('editor');

  const dragOption = {
    left: 0,
    top: 0,
  };

  let dataList = ref<any>([]);

  // 添加元素
  async function handleAdd(url: string) {
    const canvas = toRaw(editor.value.canvas);
    const stageRect = toRaw(editor.value?.stage?.stageRect);
    const imgEl = await createImgDom(url);
    addImage(canvas, { imgEl, width: stageRect.width, height: stageRect.height });
    canvas.renderAll();
    imgEl.remove();
  }
  // drop事件操作
  function eventDrop(option: any) {
    const canvas = toRaw(editor.value.canvas);
    // 画布元素距离浏览器左侧和顶部的距离
    const offset = {
      left: canvas.getSelectionElement().getBoundingClientRect().left,
      top: canvas.getSelectionElement().getBoundingClientRect().top,
    };

    // 鼠标坐标转换成画布的坐标（未经过缩放和平移的坐标）
    const point = {
      x: option.e.x - offset.left,
      y: option.e.y - offset.top,
    };

    // 转换后的坐标，restorePointerVpt 不受视窗变换的影响
    const pointerVpt = canvas.restorePointerVpt(point);
    dragOption.left = pointerVpt.x;
    dragOption.top = pointerVpt.y;
  }

  function init() {
    const canvas = toRaw(editor.value.canvas);
    canvas.on('drop', eventDrop);
  }
  function destroy() {
    const canvas = toRaw(editor.value.canvas);
    canvas.off('drop', eventDrop);
  }
  onUnmounted(() => {
    destroy();
  });
  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  .editor-upload {
    &-add {
      padding: 16px;
    }
    &-card {
      padding: 0 16px;
      &-title {
        align-items: center;
        color: #000;
        display: flex;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        margin-bottom: 10px;
      }
      &-list {
        display: flex;
        flex-wrap: wrap;
      }
    }
    &-item {
      margin: 0 10px 10px 0;
      text-align: center;
      cursor: pointer;
      background: #f7f7f7;
      border-radius: 5px;
      display: flex;
      // align-items: center;
      justify-content: center;
      width: calc(50% - 5px);
      overflow: hidden;
      transition: all 0.25s;
      &:hover {
        opacity: 0.95;
        box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.1);
      }
      &:nth-child(2n + 2) {
        margin-right: 0;
      }
      img {
        max-height: 500px;
        min-height: 30px;
      }
    }
  }
</style>
