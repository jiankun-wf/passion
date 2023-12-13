<template>
  <div class="editor-ele">
    <div class="editor-ele-card" v-for="(item, index) in dataList" :key="index">
      <div class="editor-ele-card-title">{{ item.title }}</div>
      <div class="editor-ele-card-list">
        <template v-for="(itemC, indexC) in item.children">
          <div class="editor-ele-item" v-if="itemC.types.includes(type)" :key="indexC">
            <div
              class="editor-ele-item-box"
              :draggable="true"
              @dragend="handleAdd($event, itemC.name)"
              @click="handleAdd($event, itemC.name)"
              @dragstart="handleDragstart"
            >
              <Icon :icon="itemC.icon" size="30" color="#1890ff" />
            </div>
            <p class="editor-ele-item-title">{{ itemC.title }}</p>
          </div>
        </template>
      </div>
    </div>
    <div class="editor-ele-card" v-if="editorEleCustom?.length">
      <div class="editor-ele-card-title">自定义组件</div>
      <div class="editor-ele-card-list">
        <div class="editor-ele-item" v-for="(item, index) in editorEleCustom" :key="index">
          <div
            class="editor-ele-item-box"
            :draggable="true"
            @dragend="handleAddCustom($event, item)"
            @click="handleAddCustom($event, item)"
            @dragstart="handleDragstart"
          >
            <Icon icon="material-symbols:dashboard-customize-rounded" size="30" color="#1890ff" />
          </div>
          <p class="editor-ele-item-title">{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorResEle">
  import { inject, ref, toRaw } from 'vue';
  import { EleIconEnum } from '../../enums/editorEnum';
  import { Icon } from '/@/components/Icon';
  import sampleJson from '../data/sample.json';
  import draftJson1 from '../data/draft-1.json';
  import {
    addCircle,
    addCustomDraftHeader,
    addCustomGroup,
    addCustomPager,
    addPolygon,
    addRect,
    addText,
    addTextBox,
    addTriangle,
  } from '../../editor/element';
  const { editor, editorEleCustom } = inject<any>('editor');
  import { useCanvasDrop } from '../../hooks/useCanvasDrop';
  import { useRoute } from 'vue-router';

  const { query } = useRoute();
  const type = query.type as string;
  const { handleDragstart, dragPos } = useCanvasDrop();

  let dataList = ref<any>([
    {
      title: '基本组件',
      children: [
        {
          icon: EleIconEnum.ITEXT,
          title: '文本',
          name: 'IText',
          types: ['all', 'template', 'free', 'draft'],
        },
        {
          icon: EleIconEnum.RECT,
          title: '矩形',
          name: 'Rect',
          types: ['all', 'template', 'free', 'draft'],
        },
        {
          icon: EleIconEnum.CIRCLE,
          title: '圆形',
          name: 'Circle',
          types: ['all', 'template', 'free', 'draft'],
        },
        {
          icon: EleIconEnum.TEXTBOX,
          title: '文本框',
          name: 'TextBox',
          types: ['all', 'template', 'free', 'draft'],
        },
        {
          icon: EleIconEnum.TRIANGLE,
          title: '三角形',
          name: 'Triangle',
          types: ['all', 'template', 'free', 'draft'],
        },
        {
          icon: EleIconEnum.POLYGON,
          title: '多边形',
          name: 'Polygon',
          types: ['all', 'template', 'free', 'draft'],
        },
      ],
    },
    {
      title: '功能组件',
      children: [
        {
          icon: EleIconEnum.SAMPLE,
          title: '样例',
          name: 'Sample',
          types: ['all', 'free'],
        },
        {
          icon: EleIconEnum.TEXTBOX,
          title: '分页',
          name: 'PagerTextBox',
          types: ['all', 'template', 'free', 'draft'],
        },
        {
          icon: EleIconEnum.TEXTBOX,
          title: '字稿表页眉',
          name: 'DraftHeader',
          types: ['all', 'template', 'free', 'draft'],
        },
        {
          icon: EleIconEnum.SAMPLE,
          title: '字稿表',
          name: 'Draft1',
          types: ['all', 'template', 'free', 'draft'],
        },
        // {
        //   icon: EleIconEnum.CASE,
        //   title: '案例',
        //   name: 'Case',
        // },
        // {
        //   icon: EleIconEnum.INTRODUCTION,
        //   title: '简介',
        //   name: 'Introduction',
        // },
      ],
    },
  ]);

  // 添加元素
  function handleAdd(e: MouseEvent, name: string) {
    const options = e.type === 'click' ? null : dragPos;
    const canvas = toRaw(editor.value.canvas);
    switch (name) {
      case 'IText':
        addText(canvas, options);
        break;
      case 'Rect':
        addRect(canvas, options);
        break;
      case 'Circle':
        addCircle(canvas, options);
        break;
      case 'TextBox':
        addTextBox(canvas, options);
        break;
      case 'Triangle':
        addTriangle(canvas, options);
        break;
      case 'Polygon':
        addPolygon(canvas, options);
        break;
      case 'PagerTextBox':
        addCustomPager(canvas, options);
        break;
      case 'DraftHeader':
        addCustomDraftHeader(canvas, options);
        break;
      case 'Sample':
        addCustomGroup(canvas, options, sampleJson);
        break;
      case 'Draft1':
        addCustomGroup(canvas, { ...options, top: 100, left: 30 }, draftJson1);
        break;
      default:
    }
  }
  // 添加自定义组件
  function handleAddCustom(e: MouseEvent, obj: any) {
    const options = e.type === 'click' ? null : dragPos;
    const canvas = toRaw(editor.value.canvas);
    addCustomGroup(canvas, options, obj);
  }
</script>

<style lang="less" scoped>
  .editor-ele {
    padding: 16px;
    &-card {
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

      &:nth-child(3n + 3) {
        margin-right: 0;
      }
      &-box {
        align-items: center;
        background: #f7f7f7;
        border-radius: 5px;
        display: flex;
        width: 75px;
        height: 75px;
        justify-content: center;
        margin-bottom: 5px;
        text-align: center;
        border: 2px solid #f7f7f7;
        transition: all 0.25s ease;
        &:hover,
        &.active {
          border-color: #1890ff;
        }
      }
      &-title {
        font-size: 12px;
      }
    }
  }
</style>
