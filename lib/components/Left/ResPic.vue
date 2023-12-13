<template>
  <div class="editor-pic">
    <div class="editor-pic-card" v-for="(item, index) in dataList" :key="index">
      <div class="editor-pic-card-title">{{ item.title }}</div>
      <div class="editor-pic-card-list">
        <div
          class="editor-pic-item"
          v-for="(itemC, indexC) in item.children"
          :key="indexC"
          :draggable="true"
          @dragstart="handleDragstart"
          @dragend="handleAdd($event, itemC.image)"
          @click="handleAdd($event, itemC.image)"
        >
          <img :src="itemC.thumb" :alt="itemC.title" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorResPic">
  import { inject, ref, toRaw, onMounted } from 'vue';
  import { addImage } from '../../editor/element';
  import { createImgDom } from '../../editor/utils';
  import { useCanvasDrop } from '../../hooks/useCanvasDrop';

  const { handleDragstart, dragPos } = useCanvasDrop();
  const { editor, editorProps } = inject<any>('editor');
  let dataList = ref<any[]>([]);

  // 添加元素
  async function handleAdd(e: MouseEvent, url: string) {
    const options = e.type === 'click' ? null : dragPos;
    const isThumb = e.type !== 'click';
    const canvas = toRaw(editor.value.canvas);
    const stageRect = toRaw(editor.value?.stage?.stageRect);
    const imgEl = await createImgDom(url);
    addImage(
      canvas,
      { ...options, imgEl, width: stageRect.width, height: stageRect.height },
      isThumb,
    );
    canvas.renderAll();
    imgEl.remove();
  }

  async function fetchData() {
    dataList.value = (await editorProps?.resProps?.picApi()) || [];
  }

  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped>
  .editor-pic {
    padding-top: 16px;
    overflow: auto;
    height: 100%;
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
