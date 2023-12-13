<template>
  <div class="editor-layout">
    <div class="editor-layout-header">
      <EditorHeader @save="handleSave" @close="handleClose" @saveclose="handleSaveClose" />
    </div>
    <main class="editor-layout-main">
      <!-- 左侧组件列表 -->
      <section class="editor-layout-left"><EditorLeft /></section>
      <!-- 中间画布 -->
      <section class="editor-layout-center"><EditorStage /></section>
      <!-- 右侧属性列表 -->
      <section class="editor-layout-right"><EditorRight /></section>
    </main>
  </div>
</template>
<script setup lang="ts" name="EditorIndex">
  import { provide, ref, watchEffect, onUnmounted, toRaw, onMounted } from 'vue';
  import EditorHeader from './components/Header/index.vue';
  import EditorLeft from './components/Left/index.vue';
  import EditorRight from './components/Right/index.vue';
  import EditorStage from './components/Stage/index.vue';
  import { IEditorPage } from './editor/typings';
  import Editor from './editor';
  import { useAction } from './hooks/useAction';
  import { getFontList, getFontSubset, getResSvgList, getResPicList } from './editor/api';

  let editorPage = ref<IEditorPage[]>([]);
  let editorPageId = ref<string>('');
  let editorPageLoading = ref<boolean>(false);
  let editorEleCustom = ref<any[]>([]);
  let editor = ref();
  // props
  const props = withDefaults(
    defineProps<{
      dataList: IEditorPage[];
      resProps?: {
        svgApi?: (...args: any[]) => Promise<any>;
        picApi?: (...args: any[]) => Promise<any>;
      };
      fontProps: {
        api?: (...args: any[]) => Promise<any>;
        subsetApi?: (...args: any[]) => Promise<any>;
        childrenKey?: string;
      };
    }>(),
    {
      resProps: () => {
        return {
          svgApi: getResSvgList,
          picApi: getResPicList,
        };
      },
      fontProps: () => {
        return {
          api: getFontList,
          subsetApi: getFontSubset,
        };
      },
    },
  );

  const emit = defineEmits(['save', 'close', 'saveclose']);
  // 保存数据
  const handleSave = (params: any) => {
    emit('save', params);
  };
  // 关闭
  const handleClose = () => {
    emit('close');
  };
  // 关闭
  const handleSaveClose = (params: any) => {
    emit('saveclose', params);
  };

  const {
    editorPageHistoryUpdate,
    editorPageHistoryUpdateDebounce,
    editorPageSave,
    editorHistoryList,
    editorHistoryDoList,
    editorHistoryAdd,
    editorHistoryBack,
    editorHistoryForward,
  } = useAction(editor, editorPage, editorPageId, editorPageLoading);

  provide('editor', {
    editor,
    editorPage,
    editorPageId,
    editorPageLoading,
    editorPageHistoryUpdate,
    editorPageHistoryUpdateDebounce,
    editorPageSave,
    editorHistoryList,
    editorHistoryDoList,
    editorHistoryAdd,
    editorHistoryBack,
    editorHistoryForward,
    editorEleCustom,
    editorProps: props,
  });

  // 初始化编辑器
  function initEditor() {
    editor.value = new Editor();
  }
  // 初始化事件
  function initEvent() {
    destroyEvent();
    const canvas = toRaw(editor.value.canvas);
    canvas.on({
      'object:modified': editorPageHistoryUpdate,
      'object:added': editorPageHistoryUpdate,
      'object:removed': editorPageHistoryUpdate,
    });
  }
  // 销毁事件
  function destroyEvent() {
    const canvas = toRaw(editor.value.canvas);
    canvas.off({
      'object:modified': editorPageHistoryUpdate,
      'object:added': editorPageHistoryUpdate,
      'object:removed': editorPageHistoryUpdate,
    });
  }

  onUnmounted(() => {
    destroyEvent();
  });
  onMounted(() => {
    initEditor();
    initEvent();
  });
  watchEffect(() => {
    const pageList = toRaw(props.dataList);
    if (pageList?.length) {
      editorPage.value = pageList || [];
    }
  });
</script>

<style lang="less">
  @font-face {
    font-family: GEETYPE-DSDADAGB;
    src: url('./editor/fonts/GEETYPE-DSDADAGB.ttf') format('truetype');
  }
  @header-h: 54px;
  .editor-layout {
    min-width: 1200px;
    width: 100%;
    min-height: 500px;
    height: 100vh;
    background: #fff;
    overflow: hidden;
    &-header {
      height: @header-h;
      position: fixed;
      width: 100%;
      top: 0;
      background: #fff;
      z-index: 2;
      box-shadow: 0 4px 10px 0 rgb(0 0 0 / 5%);
      border-bottom: 1px solid #e9e8e8;
    }
    &-main {
      height: calc(100% - @header-h);
      position: relative;
      top: @header-h;
    }
    &-left {
      position: absolute;
      height: 100%;
      width: 340px;
      left: 0;
      top: 0;
      box-shadow: 4px 0 10px 0 rgb(0 0 0 / 5%);
      border-right: 1px solid #e9e8e8;
      z-index: 2;
    }

    &-right {
      position: absolute;
      height: 100%;
      width: 240px;
      right: 0;
      top: 0;
      border-left: 1px solid #e9e8e8;
      box-shadow: -4px 0 10px 0 rgb(0 0 0 / 5%);
    }

    &-center {
      margin-left: 340px;
      margin-right: 240px;
      background: #f5f5f5;
      height: 100%;
      overflow: auto;
      // padding: 15px;
    }

    .placeholder {
      text-align: center;
      color: #333;
    }
  }
  .editor {
    &__btn {
      display: inline-flex;
      align-items: center;
      height: 30px;
      line-height: 30px;
      border-radius: 4px;
      background: #f7f8fa;
      font-size: 14px;
      // color: #979797;
      text-align: center;
      cursor: pointer;
      padding: 0 10px;
      position: relative;
      transition: all 0.2s;
      margin: 0 0 0 10px;
      span {
        margin: 0 2px;
      }
      &:hover,
      &.active {
        background: #e6f7ff;
        color: #1890ff;
      }
      &-danger {
        background: rgba(255, 182, 182, 0.39);
        color: #f75757;
        &:hover {
          opacity: 0.85;
        }
      }
      &-ico {
        line-height: 30px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        // color: #979797;
        &:hover,
        &.active {
          color: #1890ff;
        }
        &:disabled {
          color: #979797;
          cursor: not-allowed;
          &:hover,
          &.active {
            color: #979797;
          }
        }
      }
      &:disabled {
        color: #979797;
        cursor: not-allowed;
        &:hover,
        &.active {
          color: #979797;
        }
      }
      &.xl {
        height: 40px;
        line-height: 40px;
      }
      &.block {
        display: block;
        width: 100%;
        text-align: center;
        margin: 0;
      }
      &.primary {
        background: #e6f7ff;
        color: #1890ff;
        &:hover {
          opacity: 0.85;
        }
      }
    }
    &__form {
      text-align: left;
    }
  }
</style>
