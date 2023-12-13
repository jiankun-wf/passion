import { useEventListener } from '@vueuse/core';
import hotkeys from 'hotkeys-js';
import { inject, onMounted, onUnmounted, toRaw } from 'vue';
import { outParams } from '../editor';
import { HotkeyEnum } from '../enums/editorEnum';

const useKeyEvent = () => {
  const { editor, editorPageHistoryUpdateDebounce, editorHistoryBack, editorHistoryForward } =
    inject<any>('editor');
  let _clipboard: any = null; // 当前选中的元素
  // 方向
  function handleDirection(e: KeyboardEvent) {
    e.preventDefault();
    const canvas = toRaw(editor.value.canvas);
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    const rate = e.shiftKey ? 10 : 1;
    const x = activeObject.left || 0;
    const y = activeObject.top || 0;
    switch (e.key) {
      case 'ArrowLeft':
        activeObject.set('left', x - rate);
        break;
      case 'ArrowRight':
        activeObject.set('left', x + rate);
        break;
      case 'ArrowDown':
        activeObject.set('top', y + rate);
        break;
      case 'ArrowUp':
        activeObject.set('top', y - rate);
        break;
      default:
    }
    canvas.renderAll();
    editorPageHistoryUpdateDebounce();
  }
  // 删除图层
  function handleDelete(e: Event) {
    e.preventDefault();
    const _editor = toRaw(editor.value);
    _editor.delete();
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
    _editor.delete();
  }
  // 粘贴图层
  function handlePaste(e: Event) {
    e.preventDefault();
    if (!_clipboard) return false;
    const _editor = toRaw(editor.value);
    _editor.paste(_clipboard);
  }
  // 图层顺序-置顶
  function handleStackFront(e: Event) {
    e.preventDefault();
    const _editor = toRaw(editor.value);
    _editor.front();
    editorPageHistoryUpdateDebounce();
  }
  // 图层顺序-向前移动
  function handleStackForward(e: Event) {
    e.preventDefault();
    const _editor = toRaw(editor.value);
    _editor.forward();
    editorPageHistoryUpdateDebounce();
  }
  // 图层顺序-置底
  function handleStackBack(e: Event) {
    e.preventDefault();
    const _editor = toRaw(editor.value);
    _editor.back();
    editorPageHistoryUpdateDebounce();
  }
  // 图层顺序-向后移动
  function handleStackBackward(e: Event) {
    e.preventDefault();
    const _editor = toRaw(editor.value);
    _editor.backward();
    editorPageHistoryUpdateDebounce();
  }
  // 页面后退
  function handleBack(e: Event) {
    e.preventDefault();
    editorHistoryBack();
  }
  // 页面前进
  function handleForward(e: Event) {
    e.preventDefault();
    editorHistoryForward();
  }
  // 页面保存
  function handleSave(e: Event) {
    e.preventDefault();
    editorPageHistoryUpdateDebounce();
  }
  // 标尺
  function handleRuler(e: Event) {
    e.preventDefault();
    const ruler = toRaw(editor.value.ruler);
    if (ruler.options.enabled) {
      ruler.disable();
    } else {
      ruler.enable();
    }
  }
  // 画布拖拽
  function handleCanvasDring() {
    let isSpace = false;
    useEventListener(document, 'keydown', (e) => {
      if (isSpace) return;
      const code = e?.code?.toLocaleLowerCase();
      if (code === HotkeyEnum.CANVAS_DRING) {
        const stage = toRaw(editor.value.stage);
        isSpace = true;
        stage.startDring();
      }
    });
    useEventListener(document, 'keyup', (e) => {
      const code = e?.code?.toLocaleLowerCase();
      if (code === HotkeyEnum.CANVAS_DRING) {
        const stage = toRaw(editor.value.stage);
        isSpace = false;
        stage.endDring();
      }
    });
  }
  handleCanvasDring();
  // 中心缩放
  function handleCenteredScaling() {
    let isAlt = false;
    useEventListener(document, 'keydown', (e) => {
      if (isAlt) return;
      if (e.key === HotkeyEnum.CENTERED_SCALING) {
        console.log('handleCenteredScaling');
        const canvas = toRaw(editor.value.canvas);
        const activeEl = canvas.getActiveObject();
        isAlt = true;
        activeEl.centeredScaling = true;
      }
    });
    useEventListener(document, 'keyup', (e) => {
      if (e.key === HotkeyEnum.CENTERED_SCALING) {
        const canvas = toRaw(editor.value.canvas);
        const activeEl = canvas.getActiveObject();
        isAlt = false;
        activeEl.centeredScaling = false;
      }
    });
  }
  handleCenteredScaling();
  onMounted(() => {
    hotkeys(HotkeyEnum.DIRECTION, handleDirection);
    hotkeys(HotkeyEnum.COPY, handleCopy);
    hotkeys(HotkeyEnum.CUT, handleCut);
    hotkeys(HotkeyEnum.PASTE, handlePaste);
    hotkeys(HotkeyEnum.DELETE, handleDelete);
    hotkeys(HotkeyEnum.STACK_FRONT, handleStackFront);
    hotkeys(HotkeyEnum.STACK_BACK, handleStackBack);
    hotkeys(HotkeyEnum.STACK_FORWARD, handleStackForward);
    hotkeys(HotkeyEnum.STACK_BACKWARD, handleStackBackward);
    hotkeys(HotkeyEnum.BACK, handleBack);
    hotkeys(HotkeyEnum.Forward, handleForward);
    hotkeys(HotkeyEnum.SAVE, handleSave);
    hotkeys(HotkeyEnum.RULER, handleRuler);
  });
  onUnmounted(() => {
    hotkeys.unbind(HotkeyEnum.DIRECTION, handleDirection);
    hotkeys.unbind(HotkeyEnum.COPY, handleCopy);
    hotkeys.unbind(HotkeyEnum.CUT, handleCut);
    hotkeys.unbind(HotkeyEnum.PASTE, handlePaste);
    hotkeys.unbind(HotkeyEnum.DELETE, handleDelete);
    hotkeys.unbind(HotkeyEnum.STACK_FRONT, handleStackFront);
    hotkeys.unbind(HotkeyEnum.STACK_BACK, handleStackBack);
    hotkeys.unbind(HotkeyEnum.STACK_FORWARD, handleStackForward);
    hotkeys.unbind(HotkeyEnum.STACK_BACKWARD, handleStackBackward);
    hotkeys.unbind(HotkeyEnum.BACK, handleBack);
    hotkeys.unbind(HotkeyEnum.Forward, handleForward);
    hotkeys.unbind(HotkeyEnum.SAVE, handleSave);
    hotkeys.unbind(HotkeyEnum.RULER, handleRuler);
  });
};

export { useKeyEvent, HotkeyEnum };
