import { inject, onMounted, onUnmounted, toRaw } from 'vue';

export function useCanvasDrop() {
  const { editor } = inject<any>('editor');
  const dragPos = {
    left: 0,
    top: 0,
  };
  const boxPos = {
    offsetX: 0,
    offsetY: 0,
  };
  // 开始拖拽
  function handleDragstart(e: MouseEvent) {
    boxPos.offsetX = e.offsetX;
    boxPos.offsetY = e.offsetY;
    // e.target.classList.add('drag');
    // e.dataTransfer.setDragImage(e.target, e.offsetX, e.offsetY);
  }
  // drop事件操作
  function eventDrop(option: any) {
    const canvas = toRaw(editor.value.canvas);
    // 画布元素距离浏览器左侧和顶部的距离
    const offset = {
      left: canvas.getSelectionElement().getBoundingClientRect().left,
      top: canvas.getSelectionElement().getBoundingClientRect().top,
    };

    // 鼠标转画布坐标（未经过缩放和平移坐标）
    const point = {
      x: option.e.x - offset.left - boxPos.offsetX,
      y: option.e.y - offset.top - boxPos.offsetY,
    };

    // 坐标(不受视窗变换的影响)
    const pointerVpt = canvas.restorePointerVpt(point);
    dragPos.left = pointerVpt.x;
    dragPos.top = pointerVpt.y;
  }
  onMounted(() => {
    const canvas = toRaw(editor.value.canvas);
    canvas.on('drop', eventDrop);
  });
  onUnmounted(() => {
    const canvas = toRaw(editor.value.canvas);
    canvas.off('drop', eventDrop);
  });

  return { handleDragstart, dragPos, boxPos };
}
