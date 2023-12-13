<template>
  <!-- 位置 -->
  <div class="editor-attr__group">
    <div class="editor-attr__group-title">位置</div>
    <div class="editor-attr__position">
      <div class="editor-attr__position-box">
        <Tooltip :title="item.label" v-for="(item, index) in alignList" :key="index">
          <div class="editor-attr__position-item" @click="handlePosition(item)">
            <Icon :icon="item.icon" size="16" />
          </div>
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorBasePosition">
  import { inject, ref, watchEffect } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { Tooltip } from 'ant-design-vue';
  import { useAlign } from '../../hooks/useAlign';

  const props = defineProps({
    title: { type: String },
    activeObject: { type: Object },
  });

  const { editor, editorPageHistoryUpdateDebounce } = inject<any>('editor');
  const { topLeft, topCenter, centerCenter } = useAlign(editor);

  interface IAttrItem {
    icon?: string;
    label?: string;
    value: any;
  }
  let alignList = ref<Array<IAttrItem>>([
    {
      icon: 'ic:baseline-arrow-back',
      label: '顶部左对齐',
      value: 'tl',
    },
    {
      icon: 'ic:baseline-arrow-upward',
      label: '顶部居中对齐',
      value: 'tc',
    },
    {
      icon: 'ic:baseline-arrow-outward',
      label: '顶部右对齐',
      value: 'tr',
    },
    {
      icon: 'ic:baseline-arrow-back',
      label: '垂直左对齐',
      value: 'cl',
    },
    {
      icon: 'ic:baseline-filter-center-focus',
      label: '垂直居中',
      value: 'cc',
    },
    {
      icon: 'ic:baseline-arrow-forward',
      label: '垂直右对齐',
      value: 'cr',
    },
    {
      icon: 'ic:baseline-arrow-back',
      label: '底部左对齐',
      value: 'bl',
    },
    {
      icon: 'ic:baseline-arrow-downward',
      label: '底部居中对齐',
      value: 'bc',
    },
    {
      icon: 'ic:baseline-arrow-forward',
      label: '底部右对齐',
      value: 'br',
    },
  ]);
  const activeObjectRef = ref();

  function handlePosition(item: IAttrItem) {
    switch (item.value) {
      case 'tl':
        topLeft();
        break;
      case 'tc':
        topCenter();
        break;
      case 'cc':
        centerCenter();
        break;

      default:
        break;
    }
    editorPageHistoryUpdateDebounce();
  }

  watchEffect(() => {
    activeObjectRef.value = props.activeObject;
  });
</script>

<style lang="less" scoped>
  .editor-attr__position {
    display: flex;
    justify-content: center;
    &-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      width: 132px;
    }
    &-item {
      background: #efefef;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      margin: 2px;
      padding: 4px;
      width: 40px;
      &:hover {
        background: #e2e2e2;
      }
    }
  }
</style>
