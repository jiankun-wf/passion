<template>
  <div class="editor-attr">
    <div class="editor-attr__group-box">
      <div class="editor-attr__group-box-item" @click="handleLayerLock">
        <Tooltip :title="state.lock ? '解锁图层' : '锁定图层'">
          <Icon icon="material-symbols:lock" size="16" v-if="state.lock" />
          <Icon icon="material-symbols:lock-open" size="16" v-else />
        </Tooltip>
      </div>
      <Dropdown trigger="click" placement="topCenter">
        <Tooltip title="图层顺序">
          <div class="editor-attr__group-box-item">
            <Icon icon="ri:stack-fill" size="16" />
          </div>
        </Tooltip>
        <template #overlay>
          <div class="editor-attr__popup">
            <div><a-button type="text" @click="handleSortFront">置顶</a-button></div>
            <Slider
              class="editor-attr__popup-slider"
              :value="state.sort"
              :marks="state.marks"
              :max="layerList.length - 1"
              :step="1"
              vertical
              @change="handleSortMove"
              v-if="layerList.length <= 10"
            />
            <Slider
              class="editor-attr__popup-slider"
              :min="0"
              :max="layerList.length - 1"
              :step="1"
              vertical
              @change="handleSortMove"
              v-else
            />
            <div><a-button type="text" @click="handleSortBack">置底</a-button></div>
          </div>
        </template>
      </Dropdown>

      <div class="editor-attr__group-box-item" @click="handleLayerClone">
        <Tooltip title="复制图层">
          <Icon icon="clarity:clone-solid" size="16" />
        </Tooltip>
      </div>
      <div class="editor-attr__group-box-item" @click="handleLayerDelete">
        <Tooltip title="删除图层">
          <Icon icon="material-symbols:delete-rounded" size="16" />
        </Tooltip>
      </div>
    </div>
    <div class="editor-attr__group-box">
      <div
        class="editor-attr__group-box-item"
        v-for="(item, index) in alignList"
        :key="index"
        @click="handlePosition(item)"
      >
        <Tooltip :title="item.label">
          <Icon :icon="item.icon" size="16" />
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorBaseLayer">
  import { inject, ref, toRaw, reactive, watchEffect } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { Tooltip, Dropdown, Slider } from 'ant-design-vue';

  const props = defineProps({
    title: { type: String },
    activeObject: { type: Object },
  });

  interface IAttrItem {
    icon?: string;
    label?: string;
    value: any;
  }

  const { editor, editorPageHistoryUpdateDebounce } = inject<any>('editor');

  const layerList = ref([]);
  const activeObjectRef = ref();
  let alignList = ref<Array<IAttrItem>>([
    {
      icon: 'ic:round-align-horizontal-center',
      label: '水平居中',
      value: 'centerH',
    },
    {
      icon: 'ant-design:pic-center-outlined',
      label: '水平垂直居中',
      value: 'center',
    },
    {
      icon: 'ic:outline-align-vertical-center',
      label: '垂直居中',
      value: 'centerV',
    },
  ]);

  let state = reactive({
    sort: 0,
    lock: false,
    marks: {},
  });
  // 锁定图层
  function handleLayerLock() {
    state.lock = !state.lock;
    const _editor = toRaw(editor.value);
    _editor.lock(state.lock);
    editorPageHistoryUpdateDebounce();
  }
  // 图层顺序
  function handleSortMove(value: number) {
    const zIndex = value + 1;
    state.sort = zIndex;
    const _editor = toRaw(editor.value);
    _editor.moveTo(zIndex);
    editorPageHistoryUpdateDebounce();
  }
  // 图层顺序-置顶
  function handleSortFront() {
    const _editor = toRaw(editor.value);
    _editor.front();
    editorPageHistoryUpdateDebounce();
  }
  // 图层顺序-置顶
  function handleSortBack() {
    const _editor = toRaw(editor.value);
    _editor.back();
    editorPageHistoryUpdateDebounce();
  }
  // 复制图层
  function handleLayerClone() {
    const _editor = toRaw(editor.value);
    const canvas = _editor.canvas;
    const _clipboard = canvas.getActiveObject();
    _editor.paste(_clipboard);
  }
  // 删除图层
  function handleLayerDelete() {
    const _editor = toRaw(editor.value);
    _editor.delete();
  }
  function getDefaultAttr() {
    const _editor = toRaw(editor.value);
    const activeObject = activeObjectRef.value;
    state.lock = activeObject.lockMovementX;
    layerList.value = _editor.getLayer() || [];
    const list = layerList.value;
    list.map((_, index) => {
      state.marks[index] = '-';
    });
    const id = activeObject?.id || 0;
    if (id) {
      state.sort = layerList.value.findIndex((item: any) => item.id === id);
    }
  }
  // 设置位置
  function handlePosition(item: IAttrItem) {
    const activeObject = activeObjectRef.value;
    const canvas = toRaw(editor.value.canvas);
    switch (item.value) {
      case 'centerH':
        canvas.viewportCenterObjectH(activeObject);
        break;
      case 'center':
        canvas.viewportCenterObject(activeObject);
        break;
      case 'centerV':
        canvas.viewportCenterObjectV(activeObject);
        break;

      default:
        break;
    }
    editorPageHistoryUpdateDebounce();
  }
  watchEffect(() => {
    activeObjectRef.value = props.activeObject;
    getDefaultAttr();
  });
</script>

<style lang="less" scoped></style>
