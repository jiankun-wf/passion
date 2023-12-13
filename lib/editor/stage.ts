import { fabric } from 'fabric';
import { throttle } from 'lodash-es';
import canvasBg from './image/canvas-bg.svg';

declare type StageOption = { width: number; height: number };
declare type ExtCanvas = fabric.Canvas & {
  isDragging: boolean;
  lastPosX: number;
  lastPosY: number;
};

class Stage {
  canvas: fabric.Canvas;
  stageEl: HTMLElement;
  stageRect: fabric.Rect | null;
  option: StageOption;
  dragMode: boolean;
  constructor(canvas: fabric.Canvas, stageEl: HTMLElement, option: StageOption) {
    this.canvas = canvas;
    this.stageEl = stageEl;
    this.stageRect = null;
    this.option = option;
    this.dragMode = false;
    this._initCanvas();
    this._initStage();
    this._initResize();
    this._initDring();
  }

  // 初始化背景
  _initCanvas() {
    this.canvas.setBackgroundColor(
      'rgba(127,127,127,0.5)',
      this.canvas.renderAll.bind(this.canvas),
    );
    this.canvas.setWidth(this.stageEl.offsetWidth);
    this.canvas.setHeight(this.stageEl.offsetHeight);
    // 激活该对象保持元素在默认层组顺序
    this.canvas.preserveObjectStacking = true;
    this.canvas.hoverCursor = 'default';
    this.canvas.selectionColor = 'rgba(59, 130, 246, 0.05)'; // 选择区颜色
    this.canvas.selectionBorderColor = '#1890ff'; // 边框颜色
    this.canvas.selectionLineWidth = 1; // 线框
    // this._setCanvasBg();
  }

  // 初始化画布
  _initStage() {
    const { width, height } = this.option;
    const stage = new fabric.Rect({
      strokeWidth: 0,
      fill: 'rgba(255,255,255,1)',
      width,
      height,
      id: 'stage',
    } as any);
    stage.set('selectable', false);
    stage.set('hasControls', false);
    stage.hoverCursor = 'selection';
    this.canvas.add(stage);
    this.canvas.renderAll();

    this.stageRect = stage;
    this.auto();
  }
  // 设置画布背景
  _setCanvasBg() {
    const url = canvasBg;
    fabric.util.loadImage(url, (img: any) => {
      const fillBg = new fabric.Pattern({
        source: img,
        repeat: 'repeat',
      });
      this.canvas.setBackgroundColor(fillBg, this.canvas.renderAll.bind(this.canvas));
    });
  }

  /**
   * 设置画布中心到指定对象中心点上
   * @param {Object} obj 指定的对象
   */
  setCenterFromObject(obj: fabric.Rect) {
    const { canvas } = this;
    const objCenter = obj.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;
    if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) return;
    viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0];
    viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);
    canvas.renderAll();
  }

  // 初始化监听器
  _initResize() {
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        this.auto();
      }, 50),
    );
    resizeObserver.observe(this.stageEl);
  }
  // 设置填充颜色
  setFill(color: string) {
    this.stageRect = this.canvas
      .getObjects()
      .find((item: any) => item.id === 'stage') as fabric.Rect;
    this.stageRect.set('fill', color);
    this.stageRect.set('strokeWidth', 0);
    this.canvas.renderAll();
  }
  setFillPattern(url: string, repeat?: string) {
    repeat = repeat || 'repeat';
    fabric.util.loadImage(url, (img) => {
      this.stageRect &&
        this.stageRect.set(
          'fill',
          new fabric.Pattern({
            source: img,
            repeat: repeat,
          }),
        );
      this.canvas.renderAll();
    });
  }
  // 设置画布大小
  setSize(width: number, height: number, auto?: boolean) {
    this._initCanvas();
    this.option.width = width;
    this.option.height = height;
    this.stageRect = this.canvas
      .getObjects()
      .find((item: any) => item.id === 'stage') as fabric.Rect;
    this.stageRect.set('width', width);
    this.stageRect.set('height', height);
    if (auto) {
      this.auto();
    }
  }

  setZoomAuto(scale: number, cb?: (left?: number, top?: number) => void) {
    const { stageEl } = this;
    const width = stageEl.offsetWidth;
    const height = stageEl.offsetHeight;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    const center = this.canvas.getCenter();
    this.canvas.setViewportTransform(fabric.iMatrix.concat());
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale);
    if (!this.stageRect) return;
    this.setCenterFromObject(this.stageRect);

    // 超出画布不展示
    this.stageRect.clone((cloned: fabric.Rect) => {
      this.canvas.clipPath = cloned;
      this.canvas.requestRenderAll();
    });
    if (cb) cb(this.stageRect.left, this.stageRect.top);
  }

  _getScale() {
    const viewPortWidth = this.stageEl.offsetWidth;
    const viewPortHeight = this.stageEl.offsetHeight;
    // 按照宽度
    if (viewPortWidth / viewPortHeight < this.option.width / this.option.height) {
      return viewPortWidth / this.option.width;
    } // 按照宽度缩放
    return viewPortHeight / this.option.height;
  }

  // 放大
  big() {
    let zoomRatio = this.canvas.getZoom();
    zoomRatio += 0.05;
    const center = this.canvas.getCenter();
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
  }

  // 缩小
  small() {
    let zoomRatio = this.canvas.getZoom();
    zoomRatio -= 0.05;
    const center = this.canvas.getCenter();
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
  }

  // 自动缩放
  auto() {
    const scale = this._getScale();
    this.setZoomAuto(scale - 0.08);
  }

  // 1:1 放大
  one() {
    this.setZoomAuto(1);
    this.canvas.requestRenderAll();
  }

  // 开始拖拽
  startDring() {
    this.dragMode = true;
    this.canvas.defaultCursor = 'grab';
    this.canvas.hoverCursor = 'grab';
  }
  endDring() {
    this.dragMode = false;
    this.canvas.defaultCursor = 'default';
    this.canvas.hoverCursor = 'default';
  }

  // 拖拽模式
  _initDring() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.canvas.on('mouse:down', function (this: ExtCanvas, opt) {
      const evt = opt.e;
      if (self.dragMode) {
        self.canvas.defaultCursor = 'grabbing';
        self.canvas.discardActiveObject();
        self._setDring();
        this.selection = false;
        this.isDragging = true;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
        this.requestRenderAll();
      }
    });

    this.canvas.on('mouse:move', function (this: ExtCanvas, opt) {
      if (this.isDragging) {
        self.canvas.discardActiveObject();
        self.canvas.defaultCursor = 'grabbing';
        const { e } = opt;
        if (!this.viewportTransform) return;
        const vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
        this.requestRenderAll();
      }
    });

    this.canvas.on('mouse:up', function (this: ExtCanvas) {
      if (!this.viewportTransform) return;
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
      this.getObjects().forEach((obj) => {
        if (obj.id !== 'stage' && obj.hasControls) {
          obj.selectable = true;
        }
      });
      this.requestRenderAll();
      self.canvas.defaultCursor = 'default';
    });

    this.canvas.on('mouse:wheel', function (this: fabric.Canvas, opt) {
      const delta = opt.e.deltaY;
      let zoom = this.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      const center = this.getCenter();
      this.zoomToPoint(new fabric.Point(center.left, center.top), zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  }

  _setDring() {
    this.canvas.selection = false;
    this.canvas.defaultCursor = 'grab';
    this.canvas.getObjects().forEach((obj) => {
      obj.selectable = false;
    });
    this.canvas.renderAll();
    this.canvas.requestRenderAll();
  }
}

export default Stage;
