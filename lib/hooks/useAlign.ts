import { Ref, toRaw } from 'vue';

/**
 * 编辑器动作方法
 * @param editor
 * @returns
 */
export function useAlign(editor: Ref<any>) {
  const canvas = toRaw(editor.value.canvas);
  const activeEl = canvas.getActiveObjects()[0];
  const stageRect = toRaw(editor.value.stage.stageRect);
  console.log('stageRect', stageRect);
  console.log('activeEl', activeEl);
  console.log('getCenterPoint()', activeEl.getCenterPoint());

  // 上左
  function topLeft() {
    activeEl.set({
      left: 0,
      top: 0,
    });
    // const point = stageRect.getCenterPoint();
    // new fabric.Point(object.getCenterPoint().x, stageRect.getCenterPoint().y)
    // activeEl.setXY(point, 'center', 'center');
    activeEl.setCoords();
    canvas.renderAll();
  }
  // 上中
  function topCenter() {
    canvas.viewportCenterObjectH(activeEl);
    activeEl.set({
      top: activeEl.aCoords.tl.y,
    });
    activeEl.setCoords();
    canvas.renderAll();
  }
  // 上右
  function topRight() {
    canvas.viewportCenterObjectH(activeEl);
    activeEl.set({
      top: activeEl.aCoords.tl.y,
    });
    activeEl.setCoords();
    canvas.renderAll();
  }
  // 中左
  function centerLeft() {
    activeEl.set({
      left: 0,
      top: 0,
    });
    activeEl.setCoords();
    canvas.renderAll();
  }
  // 中中
  function centerCenter() {
    canvas.viewportCenterObject(activeEl);
  }
  // 中右
  function centerRight() {
    canvas.viewportCenterObjectH(activeEl);
    activeEl.set({
      top: activeEl.aCoords.tl.y,
    });
    activeEl.setCoords();
    canvas.renderAll();
  }
  // 下左
  function bottomLeft() {
    activeEl.set({
      left: 0,
      top: 0,
    });
    activeEl.setCoords();
    canvas.renderAll();
  }
  // 下中
  function bottomCenter() {
    canvas.viewportCenterObjectH(activeEl);
    activeEl.set({
      top: activeEl.aCoords.tl.y,
    });
    activeEl.setCoords();
    canvas.renderAll();
  }
  // 下右
  function bottomRight() {
    canvas.viewportCenterObjectH(activeEl);
    activeEl.set({
      top: activeEl.aCoords.tl.y,
    });
    activeEl.setCoords();
    canvas.renderAll();
  }

  return {
    topLeft,
    topCenter,
    topRight,
    centerLeft,
    centerCenter,
    centerRight,
    bottomLeft,
    bottomCenter,
    bottomRight,
  };
}
