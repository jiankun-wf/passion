import { buildUUID as uuid } from './uuid';

import { fabric } from 'fabric';
import { IEditorOptions } from './typings';
import type IStage from './stage';
import Stage from './stage';
import initRuler from './ruler';
import type CanvasRuler from './ruler/ruler';
import initEvents from './events';
import { AlignGuidelines } from 'fabric-guideline-plugin';
import initCustom from './custom';

declare type IExtObject = fabric.Object & {
  id: string;
  top: number;
  left: number;
};
// 设置精度
fabric.Object.NUM_FRACTION_DIGITS = 8;
export const outParams = [
  'id',
  'name',
  'vertical',
  'template',
  'font',
  'custom',
  'cuFlex',
  'cuFileName',
  'cuAutoFontSize',
  'lockMovementX',
  'lockMovementY',
  'gradientAngle',
  'selectable',
  'hasControls',
];

class Editor {
  canvas: fabric.Canvas;
  stage: IStage | null;
  ruler: CanvasRuler;
  constructor(option?: IEditorOptions) {
    const config = { stageId: 'editor-stage', canvasId: 'editor-canvas', ...option };
    this.canvas = new fabric.Canvas(config.canvasId, {
      fireRightClick: true,
      stopContextMenu: true,
      controlsAboveOverlay: true,
    });

    const stageEl = document.querySelector('#' + config.stageId) as HTMLElement;
    this.stage = new Stage(this.canvas, stageEl, { width: 900, height: 1200 });
    const guideline = new AlignGuidelines({
      canvas: this.canvas,
      aligningOptions: {
        lineColor: '#ff63fa',
        lineMargin: 8,
      },
    });
    guideline.init();
    initEvents(this.canvas);
    this.ruler = initRuler(this.canvas);
    initCustom();
  }
  getCanvas() {
    return this.canvas;
  }
  // 获取除背景的所有图层
  getLayer() {
    return this.canvas.getObjects().filter((item: IExtObject) => {
      return item.id !== 'stage';
    });
  }
  // 图层拷贝
  clone() {
    const activeObject = this.canvas.getActiveObject();
    activeObject?.clone((cloned: IExtObject) => {
      this.canvas.discardActiveObject();
      if (cloned.left === undefined || cloned.top === undefined) return;
      // 间距设置
      const grid = 30;
      cloned.set({
        left: cloned.left + grid,
        top: cloned.top + grid,
        name: activeObject.name,
        id: uuid(),
        evented: true,
      });
      this.canvas.add(cloned);
      this.canvas.setActiveObject(cloned);
      this.canvas.requestRenderAll();
    });
  }
  paste(_clipboard: IExtObject) {
    const canvas = this.canvas;
    // 如果克隆对象不存在的话就终止粘贴执行
    if (!_clipboard) return;

    _clipboard.clone(function (clonedObj) {
      // 适当的位移
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
        id: uuid(),
      });

      if (clonedObj.type === 'activeSelection') {
        // 框选了多个元素
        // 遍历粘贴所有选中的元素
        clonedObj.canvas = canvas;
        clonedObj.forEachObject(function (obj) {
          canvas.add(obj);
        });
        clonedObj.setCoords();
      } else {
        // 选中一个元素
        canvas.add(clonedObj);
        _clipboard.top += 10;
        _clipboard.left += 10;
      }

      // 适当的位移
      _clipboard.top += 10;
      _clipboard.left += 10;

      // 将新粘贴出来的元素全部选中
      canvas.setActiveObject(clonedObj);
      // 刷新画布
      canvas.requestRenderAll();
    }, outParams);
  }
  // 删除图层
  delete() {
    const activeObject = this.canvas.getActiveObjects();
    activeObject && activeObject.map((item) => this.canvas.remove(item));
    this.canvas.requestRenderAll();
    this.canvas.discardActiveObject();
  }
  // 锁定图层
  lock(value: boolean) {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject.set('hasControls', !value);
      activeObject.set('lockMovementX', value);
      activeObject.set('lockMovementY', value);
      this.canvas.renderAll();
    }
  }
  // 拆分组
  unGroup() {
    const activeObject = this.canvas.getActiveObject() as fabric.Group;
    if (!activeObject) return;
    // 先获取当前选中的对象，然后打散
    activeObject.toActiveSelection();
    activeObject.getObjects().forEach((item: IExtObject) => {
      item.set('id', uuid());
    });
    this.canvas.discardActiveObject().renderAll();
  }
  // 组合元素
  group() {
    const activeObj = this.canvas.getActiveObject() as fabric.ActiveSelection;
    if (!activeObj) return;
    const activegroup = activeObj.toGroup();
    const objectsInGroup = activegroup.getObjects();
    activegroup.clone((newgroup: fabric.Group | any) => {
      newgroup.set('id', uuid());
      newgroup.set('name', '分组');
      this.canvas.remove(activegroup);
      objectsInGroup.forEach((object) => {
        this.canvas.remove(object);
      });
      this.canvas.add(newgroup);
      this.canvas.setActiveObject(newgroup);
    }, outParams);
  }
  // 向前移动
  forward() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.bringForward();
      this.canvas.renderAll();
      this._stageToBack();
    }
  }
  // 置顶
  front() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.bringToFront();
      this.canvas.renderAll();
      this._stageToBack();
    }
  }
  // 向后移动
  backward() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.sendBackwards();
      this.canvas.renderAll();
      this._stageToBack();
    }
  }
  // 置底
  back() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.sendToBack();
      this.canvas.renderAll();
      this._stageToBack();
    }
  }
  // 移动指定层级
  moveTo(value: number) {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1 && value) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.moveTo(value);
      this.canvas.renderAll();
      this._stageToBack();
    }
  }
  // 获取舞台
  getStage() {
    const stage = this.canvas.getObjects().find((item: IExtObject) => item.id === 'stage');
    return stage;
  }

  _stageToBack() {
    const stage = this.getStage();
    stage && stage.sendToBack();
  }

  getJson() {
    return this.canvas.toJSON(outParams);
    // return this.canvas.toJSON();
  }
  // 清空画布
  clear() {
    this.canvas.getObjects().forEach((obj: any) => {
      if (obj.id !== 'stage') {
        this.canvas.remove(obj);
      }
    });
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  /**
   * @description: 拖拽添加到画布
   * @param {Event} event
   * @param {Object} item
   */
  dragAddItem(event: DragEvent, item: IExtObject) {
    const { left, top } = this.canvas.getSelectionElement().getBoundingClientRect();
    if (event.x < left || event.y < top || item.width === undefined) return;

    const point = {
      x: event.x - left,
      y: event.y - top,
    };
    const pointerVpt = this.canvas.restorePointerVpt(point);
    item.left = pointerVpt.x - item.width / 2;
    item.top = pointerVpt.y;
    this.canvas.add(item);
    this.canvas.requestRenderAll();
  }
}

export default Editor;
