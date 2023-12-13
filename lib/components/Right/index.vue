<template>
  <div class="editor-right">
    <div class="editor-right__wrap">
      <BaseLayer
        v-if="activeType !== 'stage'"
        :activeObject="activeObject"
        :key="new Date().getTime()"
      />
      <template v-for="(item, index) in attrList">
        <component
          :is="item.component"
          :key="index + new Date().getTime()"
          :title="item.title"
          v-if="item.types.includes(activeType)"
          :activeObject="activeObject"
          :activeType="activeType"
        />
      </template>
      <BaseTemplate
        :key="new Date().getTime()"
        :activeObject="activeObject"
        :activeType="activeType"
        :editorType="editorType"
      />
      <!-- <BasePosition v-if="activeType !== 'stage'" :activeObject="activeObject" /> -->
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorRight">
  import { inject, ref, nextTick, onUnmounted, onMounted, toRaw } from 'vue';
  import BaseLayer from './BaseLayer.vue';
  import BaseTemplate from './BaseTemplate.vue';
  // import BasePosition from './BasePosition.vue';
  import AttrFont from './AttrFont.vue';
  import AttrStage from './AttrStage.vue';
  import AttrImage from './AttrImage.vue';
  import AttrSvg from './AttrSvg.vue';
  import AttrShape from './AttrShape.vue';
  import AttrGroup from './AttrGroup.vue';
  import AttrSample from './AttrSample.vue';
  import AttrDraft from './AttrDraft.vue';
  import { useEventBus } from '@vueuse/core';
  import { useRoute } from 'vue-router';

  const { query } = useRoute();
  const editorType = ref<string>(query.type as string);
  const { editor } = inject<any>('editor');

  let attrList = [
    {
      title: '画布',
      component: AttrStage,
      types: ['stage'],
    },
    {
      title: '文字',
      component: AttrFont,
      types: ['i-text', 'text', 'textbox', 'pager-textbox', 'draft-header'],
    },
    {
      title: '图片',
      component: AttrImage,
      types: ['image'],
    },
    {
      title: '素材',
      component: AttrSvg,
      types: ['svg'],
    },
    {
      title: '形状',
      component: AttrShape,
      types: ['triangle', 'polygon', 'rect', 'circle'],
    },
    {
      title: '组合',
      component: AttrGroup,
      types: ['group', 'multiple', 'draft-group', 'draft-cell'],
    },
    {
      title: '样例',
      component: AttrSample,
      types: ['sample-group'],
    },
    {
      title: '字样稿',
      component: AttrDraft,
      types: ['draft-group'],
    },
  ];
  const activeObject = ref<any>();
  const activeType = ref<string>('stage');

  // 侦听画布操作事件
  const bus = useEventBus<string>('editor');
  const unsubscribe = bus.on((key) => {
    const _editor = toRaw(editor.value);
    activeObject.value = _editor.canvas.getActiveObject();
    switch (key) {
      case 'select-single':
        activeType.value = activeObject.value?.type;
        if (activeObject.value?.name === 'svg') {
          activeType.value = 'svg';
        }
        break;
      case 'select-cancle':
        activeType.value = 'stage';
        activeObject.value = _editor.stage.stageRect;
        break;
      case 'select-multiple':
        activeType.value = 'multiple';
        break;

      default:
        activeType.value = 'stage';
        activeObject.value = _editor.stage.stageRect;
        break;
    }
  });

  onMounted(() => {
    nextTick(() => {
      const _editor = toRaw(editor.value);
      activeObject.value = _editor.stage.stageRect;
    });
  });

  onUnmounted(() => {
    unsubscribe();
  });
</script>
<style lang="less">
  .editor-right {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    z-index: 1000;
    &__wrap {
      height: 100%;
      background: #fff;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 10px;
    }
  }
  .editor-attr {
    &__title {
      align-items: center;
      color: #000;
      display: flex;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      margin-bottom: 10px;
    }
    &__popup {
      width: 96px;
      height: 240px;
      background: #fff;
      box-shadow: 0 2px 6px 2px #e4e9ee;
      border-radius: 2px;
      padding: 10px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      &-slider {
        flex: 1;
        margin: 10px 0;
      }
    }
    &__group {
      &-title {
        padding: 10px 0;
        font-size: 14px;
        font-weight: 700;
        color: #979ca2;
        line-height: 20px;
        text-align: left;
      }
      &-box {
        background: #f7f7f7;
        border-radius: 10px;
        display: flex;
        height: 40px;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        margin-bottom: 10px;
        &-item {
          cursor: pointer;
          &:hover {
            color: @primary-color;
          }
        }
      }
    }
    &__row {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      width: 100%;
    }
    &__col {
      margin-right: 10px;
      flex: 1;
      display: flex;
      align-items: center;
      font-size: 14px;
      &:last-child {
        margin-right: 0;
      }
    }
    &__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 40px;
      line-height: 40px;
      border-radius: 4px;
      background: #f7f8fa;
      font-size: 14px;
      color: #202020;
      text-align: center;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
      &:hover,
      &.active {
        background: #e6f7ff;
        color: #1890ff;
      }
    }
    &__tab {
      border: 1px solid #e8e8e8;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      &-btn {
        flex: 1;
        height: 38px;
        line-height: 38px;
        font-size: 14px;
        color: #202020;
        text-align: center;
        cursor: pointer;
        position: relative;
        transition: all 0.2s;
        &:hover,
        &.active {
          background: #e6f7ff;
          color: #1890ff;
        }
      }
    }

    &__field {
      flex: 1;
      height: 38px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      font-size: 14px;
      padding-right: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .n-color-picker {
        flex: 1;
      }
      .n-color-picker-trigger {
        border: 0;
      }
      .ant-input-number {
        flex: 1;
        min-width: auto;
        width: auto;
        border-color: transparent;
      }
      &-label {
        padding: 0 10px;
      }
      &-value {
        flex: 1;
        &.right {
          text-align: right;
          padding-right: 10px;
        }
      }
      &-number {
        width: 54px;
        margin-left: 6px;
        .ant-input-number-input {
          height: auto;
          padding: 0;
        }
      }
    }
  }
</style>
