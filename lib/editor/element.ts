import { IElementOptions } from './typings';
import { buildUUID as uuid } from './uuid';
import { fabric } from 'fabric';
import { getPolygonVertices } from './utils';

// 添加文字
export function addText(canvas: fabric.Canvas, option: IElementOptions | null) {
  // 按比例设置初始大小
  const fontSize = 40 / canvas.getZoom();

  const defaultText = '双击修改文字';
  const text = new fabric.IText(defaultText, {
    ...option,
    fontSize,
    strokeWidth: 0,
    id: uuid(),
  } as any);
  if (!option) {
    canvas.viewportCenterObject(text);
  }
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.requestRenderAll();
}

// 添加文本域
export function addTextBox(canvas: fabric.Canvas, option: IElementOptions | null) {
  // 按比例设置初始大小
  const zoom = canvas.getZoom();
  const fontSize = 40 / zoom;
  const width = 300 / zoom;

  const defaultText = '双击修改文字';
  const text = new fabric.Textbox(defaultText, {
    ...option,
    splitByGrapheme: true,
    width,
    fontSize,
    strokeWidth: 0,
    id: uuid(),
  } as any);
  if (!option) {
    canvas.viewportCenterObject(text);
  }
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.requestRenderAll();
}
// 添加三角形
export function addTriangle(canvas: fabric.Canvas, option: IElementOptions | null) {
  // 按比例设置初始大小
  const size = 75 / canvas.getZoom();

  const triangle = new fabric.Triangle({
    ...option,
    width: size,
    height: size,
    fill: '#FFCDD3',
    strokeWidth: 0,
  });
  if (!option) {
    canvas.viewportCenterObject(triangle);
  }
  canvas.add(triangle);
  canvas.setActiveObject(triangle);
  canvas.requestRenderAll();
}
// 添加多边形
export function addPolygon(canvas: fabric.Canvas, option: IElementOptions | null) {
  // 按比例设置初始大小
  const size = 37.5 / canvas.getZoom();

  const polygon = new fabric.Polygon(getPolygonVertices(5, size), {
    ...option,
    fill: '#CDFFE0',
    id: uuid(),
    name: '多边形',
    strokeWidth: 0,
  } as any);
  polygon.set({
    // 创建完设置宽高，不然宽高会变成自动的值
    // width: size,
    // height: size,
    // 关闭偏移
    pathOffset: {
      x: 0,
      y: 0,
    },
  } as any);
  if (!option) {
    canvas.viewportCenterObject(polygon);
  }
  canvas.add(polygon);
  canvas.setActiveObject(polygon);
  canvas.requestRenderAll();
}
// 添加矩形
export function addRect(canvas: fabric.Canvas, option: IElementOptions | null) {
  // 按比例设置初始大小
  const size = 75 / canvas.getZoom();

  const rect = new fabric.Rect({
    ...option,
    fill: '#FFCDD3',
    width: size,
    height: size,
    id: uuid(),
    name: '矩形',
    strokeWidth: 0,
  } as any);
  if (!option) {
    canvas.viewportCenterObject(rect);
  }
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.requestRenderAll();
}
// 添加矩形
export function addCircle(canvas: fabric.Canvas, option: IElementOptions | null) {
  // 按比例设置初始大小
  const size = 37.5 / canvas.getZoom();

  const circle = new fabric.Circle({
    ...option,
    radius: size,
    fill: '#CDE3FF',
    id: uuid(),
    name: '圆形',
    strokeWidth: 0,
  } as any);
  if (!option) {
    canvas.viewportCenterObject(circle);
  }
  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.requestRenderAll();
}
// 添加图片
export function addImage(canvas: fabric.Canvas, option: IElementOptions, isThumb?: boolean) {
  // 创建图片对象
  const image = new fabric.Image(option.imgEl, {
    id: uuid(),
    name: '图片',
    left: option.left || 0,
    top: option.top || 0,
  } as any);

  if (isThumb) {
    // 拖拽为小缩图图
    const size = 150 / canvas.getZoom();
    image.scaleToWidth(size);
    canvas.add(image);
  } else if (option?.width && option?.height) {
    // 自适画布
    const imgW = option?.imgEl.width;
    const imgH = option?.imgEl.height;
    const width = option?.width;
    const height = option?.height;
    const scaleX = width / imgW || 1;
    const scaleY = height / imgH || 1;
    if (imgW < width / 2 && imgH < height / 2) {
      canvas.add(image);
    } else if (imgW >= imgH) {
      image.set('scaleX', scaleX);
      image.scaleToWidth(width);
      canvas.add(image);
    } else {
      image.set('scaleY', scaleY);
      image.scaleToHeight(height);
      canvas.add(image);
    }
    // canvas.viewportCenterObject(image);
  } else {
    canvas.add(image);
  }
  // canvas.viewportCenterObject(image);
  canvas.setActiveObject(image);
}
// 添加SVG
export function addSVG(canvas: fabric.Canvas, url: string, option: IElementOptions | null) {
  // 按比例设置初始大小
  const svgW = 91 / canvas.getZoom();

  fabric.loadSVGFromURL(url, (objects) => {
    const item = fabric.util.groupSVGElements(objects, {
      ...option,
      id: uuid(),
      name: 'svg',
    });
    if (!option) {
      canvas.viewportCenterObject(item);
    }
    item.scaleToWidth(svgW);
    canvas.add(item);
    canvas.requestRenderAll();
  });
}

// 添加自定义group组件
export function addCustomGroup(
  canvas: fabric.Canvas,
  option: IElementOptions | null,
  jsonObj: any,
) {
  const data = {
    ...jsonObj,
    ...option,
    id: uuid(),
  };
  new fabric.Group.fromObject(data, (obj) => {
    // if (!option) {
    //   canvas.viewportCenterObject(obj);
    // }
    canvas.add(obj);
    canvas.setActiveObject(obj);
  });
}

// 添加自定义分页组件
export function addCustomPager(canvas: fabric.Canvas, option: IElementOptions | null) {
  const stageW = canvas.clipPath?.width || 0;
  const stageH = canvas.clipPath?.height || 0;
  // 按比例设置初始大小
  const zoom = canvas.getZoom();
  const fontSize = option?.fontSize || 18;
  let width = option?.width || 200;
  // fontSize = fontSize / zoom;
  width = width / zoom;
  const top = stageH - 30 - fontSize;
  const left = stageW - 30 - width;

  const defaultText = '分页-总页数';
  const text = new fabric.PagerTextbox(defaultText, {
    ...option,
    type: 'pager-textbox',
    splitByGrapheme: true,
    width,
    fontSize,
    strokeWidth: 0,
    id: uuid(),
    textAlign: 'right',
    top,
    left,
    template: {
      data: [
        {
          key: 'text',
          value: '${pageNum}-${pageTotal}',
          language: 'void',
        },
      ],
    },
  } as any);
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.requestRenderAll();
}
// 添加字稿表页眉
export function addCustomDraftHeader(canvas: fabric.Canvas, option: IElementOptions | null) {
  // 按比例设置初始大小
  const zoom = canvas.getZoom();
  const fontSize = option?.fontSize || 10;
  let width = option?.width || 400;
  // fontSize = fontSize / zoom;
  width = width / zoom;
  const top = 30;
  const left = 30;

  const defaultText =
    '1、请确保一定不要写出字框! 2、请确保纸面干净，字框内不要有污点! 3、请把字写在字框中间，请不要把字写歪! \n4、如果字写错了，可以重新写一个贴在对应的字框内，注意一定不要遮住字框线。';
  const text = new fabric.PagerTextbox(defaultText, {
    ...option,
    type: 'draft-header',
    splitByGrapheme: true,
    width,
    fontSize,
    strokeWidth: 0,
    id: uuid(),
    textAlign: 'left',
    top,
    left,
  } as any);
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.requestRenderAll();
}
