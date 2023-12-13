<template>
  <div class="editor-zoom">
    <div class="editor-zoom-item" @click="handleChangeSize('big')">
      <Icon icon="ant-design:zoom-in-outlined" />
    </div>
    <div class="editor-zoom-item" @click="handleChangeSize('small')">
      <Icon icon="ant-design:zoom-out-outlined" />
    </div>
    <div class="editor-zoom-item" @click="handleChangeSize('one')">
      <!-- <Icon icon="ant-design:one-to-one-outlined" /> -->
      1:1
    </div>
    <div class="editor-zoom-item" @click="handleChangeSize('auto')">
      <Icon icon="ant-design:fullscreen-outlined" />
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorZoom">
  import { inject, toRaw } from 'vue';
  import Icon from '/@/components/Icon';
  const { editor } = inject<any>('editor');

  const handleChangeSize = (key: string) => {
    const _editor = toRaw(editor.value);
    switch (key) {
      case 'big':
        _editor.stage.big();
        break;
      case 'small':
        _editor.stage.small();
        break;
      case 'one':
        _editor.stage.one();
        break;
      case 'auto':
        _editor.stage.auto();
        break;

      default:
        break;
    }
  };
</script>

<style lang="less" scoped>
  .editor-zoom {
    position: absolute;
    right: 20px;
    bottom: 20px;
    box-shadow: 0 0 4px 0 rgb(0 0 0 / 12%);
    color: #202020;
    font-size: 12px;
    height: 40px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    background-color: #fff;
    user-select: none;
    &-item {
      border-left: 1px solid #edeef0;
      padding: 0 10px;
      cursor: pointer;
      &:first-child {
        border-left: 0;
      }
    }
  }
</style>
