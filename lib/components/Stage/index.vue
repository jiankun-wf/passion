<template>
  <div id="editor-stage" class="editor-stage">
    <canvas id="editor-canvas"></canvas>
    <EditorZoom />
    <EditorContextMenu />
  </div>
</template>
<script lang="ts" setup name="EditorStage">
  import EditorZoom from './Zoom.vue';
  import EditorContextMenu from './ContextMenu.vue';
  import { useKeyEvent } from '../../hooks/useKeyEvent';
  useKeyEvent();
</script>
<style lang="less" scoped>
  .editor-stage {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  #canvas {
    width: 800px;
    height: 600px;
    margin: 0 auto;
    background-color: #fff;
  }
  // 网格背景
  .grid-bg {
    --offsetX: 0px;
    --offsetY: 0px;
    --size: 16px;
    --color: #dedcdc;
    background-image: linear-gradient(
        45deg,
        var(--color) 25%,
        transparent 0,
        transparent 75%,
        var(--color) 0
      ),
      linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
    background-position: var(--offsetX) var(--offsetY),
      calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
    background-size: calc(var(--size) * 2) calc(var(--size) * 2);
  }
</style>
