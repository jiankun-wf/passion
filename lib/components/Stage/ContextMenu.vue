<template>
  <div
    class="editor-context"
    v-show="menuVisable"
    :style="menuPos"
    @contextmenu.prevent=""
    ref="menu"
  >
    <template v-if="isStage">
      <div class="editor-context__group">
        <div class="editor-context__item" @click="handlePaste" :class="{ disabled: !isPaste }">
          <span>粘贴图层</span>
          <span class="editor-context__item-hotkey">{{ HotkeyEnum.PASTE }}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="editor-context__group">
        <div class="editor-context__item" @click="handleCopy">
          <span>复制图层</span>
          <span class="editor-context__item-hotkey">{{ HotkeyEnum.COPY }}</span>
        </div>
        <div class="editor-context__item" @click="handleCut">
          <span>剪切图层</span>
          <span class="editor-context__item-hotkey">{{ HotkeyEnum.CUT }}</span>
        </div>
        <div class="editor-context__item" @click="handlePaste">
          <span>粘贴图层</span>
          <span class="editor-context__item-hotkey">{{ HotkeyEnum.PASTE }}</span>
        </div>
        <div class="editor-context__item" @click="handleDelete">
          <span>删除图层</span>
          <span class="editor-context__item-hotkey">{{ HotkeyEnum.DELETE }}</span>
        </div>
      </div>
      <div class="editor-context__group">
        <div class="editor-context__item" @click="handleFront">
          <span>置顶</span>
          <span class="editor-context__item-hotkey">{{ HotkeyEnum.STACK_FRONT }}</span>
        </div>
        <div class="editor-context__item" @click="handleForward">
          <span>上移一层</span>
          <span class="editor-context__item-hotkey">{{ HotkeyEnum.STACK_FORWARD }}</span>
        </div>
        <div class="editor-context__item" @click="handleBackward">
          <span>下移一层</span>
          <span class="editor-context__item-hotkey">{{ HotkeyEnum.STACK_BACKWARD }}</span>
        </div>
        <div class="editor-context__item" @click="handleBack">
          <span>置底</span>
          <span class="editor-context__item-hotkey">{{ HotkeyEnum.STACK_BACK }}</span>
        </div>
      </div>
      <div class="editor-context__title">选择重叠图层</div>
      <div class="editor-context__stack">
        <div
          class="editor-context__stack-item"
          @click="handleLayerSelect(item.id)"
          v-for="(item, index) in layerList"
          :key="index"
        >
          <div class="editor-context__stack-thumb">
            <Icon :icon="typeIcon(item.type)" size="30" />
          </div>
          <div class="editor-context__stack-desc">{{ item.text || item.name || item.type }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup name="EditorContextMenu">
  import { inject, ref, nextTick, toRaw, onMounted } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { HotkeyEnum } from '../../hooks/useHotKey';
  import { EleIconEnum } from '../../enums/editorEnum';
  import { outParams } from '../../editor';

  const { editor, editorPageHistoryUpdateDebounce } = inject<any>('editor');
  const menu = ref(); // 画布元素
  const menuVisable = ref(false); // 右键菜单显示状态
  const menuPos = ref(''); // 右键菜单位置
  const layerList = ref<any[]>([]);
  let _clipboard = null; // 当前选中的元素
  const isStage = ref(false);
  const isPaste = ref(false);

  function typeIcon(type: string) {
    const ico = '';
    const typeList = {
      group: EleIconEnum.GROUP,
      textbox: EleIconEnum.TEXTBOX,
      'i-text': EleIconEnum.ITEXT,
      image: EleIconEnum.IMAGE,
      rect: EleIconEnum.RECT,
      circle: EleIconEnum.CIRCLE,
      triangle: EleIconEnum.TRIANGLE,
      polygon: EleIconEnum.POLYGON,
    };

    return typeList[type] || ico;
  }

  // 获取当前重叠元素列表

  function getOverlapLayer(obj: any) {
    const _editor = toRaw(editor.value);
    const list = _editor.getLayer() || [];
    layerList.value = list.filter((item) => {
      const isOverlap = obj.intersectsWithObject(item);
      return isOverlap;
    });
  }

  async function handleCanvasMouseDown(opt) {
    const canvas = toRaw(editor.value.canvas);
    if (opt.button === 3 && opt.target) {
      // 是否为工作台
      isStage.value = opt.target.id === 'stage' ? true : false;
      // 获取当前元素
      // activeEl = opt.target;
      getOverlapLayer(opt.target);
      // 显示菜单
      menuVisable.value = true;
      await nextTick();
      // 设置右键菜单位置
      // 1. 获取菜单组件的宽高
      const menuWidth = menu.value.offsetWidth;
      const menuHeight = menu.value.offsetHeight;
      // 当前鼠标位置
      let pointX = opt.pointer.x + menuWidth;
      let pointY = opt.pointer.y;

      if (pointX + menuWidth > canvas.width) {
        pointX -= menuWidth;
      }
      if (pointY + menuHeight > canvas.height) {
        pointY -= menuHeight;
      }
      pointY = pointY <= 0 ? 20 : pointY;
      pointX = pointX <= 0 ? 20 : pointX;
      menuPos.value = `
      left: ${pointX}px;
      top: ${pointY}px;
    `;
    } else {
      hiddenMenu();
    }
  }

  function hiddenMenu() {
    menuVisable.value = false;
  }
  // 删除图层
  function handleDelete(e: Event) {
    e.preventDefault();
    const _editor = toRaw(editor.value);
    _editor.delete();
    hiddenMenu();
  }
  // 复制图层
  function handleCopy(e: Event) {
    e.preventDefault();
    const canvas = toRaw(editor.value.canvas);
    // 要复制的目标元素
    const target = canvas.getActiveObject();
    // 有选中的元素时才进行克隆
    if (target) {
      target.clone(function (cloned) {
        _clipboard = cloned; // 将克隆出来的元素赋值给 _clipboard
      }, outParams);
    }
    isPaste.value = true;
    hiddenMenu();
  }
  // 剪切图层
  function handleCut(e: Event) {
    e.preventDefault();
    const _editor = toRaw(editor.value);
    const canvas = toRaw(editor.value.canvas);
    // 要复制的目标元素
    const target = canvas.getActiveObject();
    // 有选中的元素时才进行克隆
    if (target) {
      target.clone(function (cloned) {
        _clipboard = cloned; // 将克隆出来的元素赋值给 _clipboard
      }, outParams);
    }
    isPaste.value = true;
    _editor.delete();
    hiddenMenu();
  }
  // 粘贴图层
  function handlePaste(e: Event) {
    e.preventDefault();
    if (!_clipboard) return false;
    const _editor = toRaw(editor.value);
    _editor.paste(_clipboard);
    hiddenMenu();
  }
  // 图层顺序-置顶
  function handleFront(e: Event) {
    e.preventDefault();
    const _editor = toRaw(editor.value);
    _editor.front();
    editorPageHistoryUpdateDebounce();
    hiddenMenu();
  }
  // 图层顺序-向前移动
  function handleForward(e: Event) {
    e.preventDefault();
    const _editor = toRaw(editor.value);
    _editor.forward();
    editorPageHistoryUpdateDebounce();
    hiddenMenu();
  }
  // 图层顺序-置底
  function handleBack(e: Event) {
    e.preventDefault();
    const _editor = toRaw(editor.value);
    _editor.back();
    editorPageHistoryUpdateDebounce();
    hiddenMenu();
  }
  // 图层顺序-向后移动
  function handleBackward(e: Event) {
    e.preventDefault();
    const _editor = toRaw(editor.value);
    _editor.backward();
    editorPageHistoryUpdateDebounce();
    hiddenMenu();
  }
  // 选择重叠图层
  function handleLayerSelect(id: string) {
    const canvas = toRaw(editor.value.canvas);
    const info = canvas.getObjects().find((item) => item.id === id);
    canvas.discardActiveObject();
    canvas.setActiveObject(info);
    canvas.requestRenderAll();
    hiddenMenu();
  }

  // 省略上面的部分代码
  function init() {
    const canvas = toRaw(editor.value.canvas);
    // 按下鼠标
    canvas.on('mouse:down', handleCanvasMouseDown);
  }
  onMounted(() => {
    nextTick(() => {
      init();
    });
  });
</script>

<style lang="less" scoped>
  .editor-context {
    width: 250px;
    position: fixed;
    left: 0;
    top: 0;
    background: hsla(0, 0%, 100%, 0.94);
    border-radius: 4px;
    box-shadow: 0 2px 10px hsl(0deg 0% 80% / 64%);
    left: 100px;
    padding: 4px 0;
    z-index: 9999999;
    user-select: none;
    &__group {
      border-bottom: 1px solid #e4e9ee;
      &:last-child {
        border-bottom: 0;
      }
    }
    &__item {
      cursor: pointer;
      display: flex;
      font-size: 14px;
      justify-content: space-between;
      align-items: center;
      line-height: 36px;
      padding: 0 20px;
      transition: all 0.25s;
      &-hotkey {
        color: #999;
      }
      &:hover {
        background: #e6f7ff;
        color: #000;
      }
      &.disabled {
        color: #999;
        background-color: transparent;
        cursor: not-allowed;
      }
    }
    &__title {
      line-height: 36px;
      padding: 0 20px;
    }
    &__stack {
      max-height: 150px;
      overflow-y: auto;
      &-item {
        cursor: pointer;
        display: flex;
        font-size: 14px;
        justify-content: space-between;
        align-items: center;
        padding: 5px 20px;
        transition: all 0.25s;
        &:hover {
          background: #e6f7ff;
          color: #000;
        }
      }
      &-thumb {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: cover;
        border: 1px solid #e4e9ee;
        height: 45px;
        line-height: 45px;
        overflow: hidden;
        width: 45px;
      }
      &-desc {
        flex: 1;
        padding-left: 10px;
      }
    }
  }
</style>
