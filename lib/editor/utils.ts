import { cloneDeep } from 'lodash-es';
import { IEditorPage, IEditorPageImage } from './typings';
import { jsPDF } from 'jspdf';
import { buildUUID as uuid } from './uuid';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * 获取多边形顶点坐标
 * @param edges 变数
 * @param radius 半径
 * @returns 坐标数组
 */
export const getPolygonVertices = (edges: number, radius: number) => {
  const vertices: Array<{ x: number; y: number }> = [];
  const interiorAngle = (Math.PI * 2) / edges;
  let rotationAdjustment = -Math.PI / 2;
  if (edges % 2 === 0) {
    rotationAdjustment += interiorAngle / 2;
  }
  for (let i = 0; i < edges; i++) {
    // 画圆取顶点坐标
    const rad = i * interiorAngle + rotationAdjustment;
    vertices.push({
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius,
    });
  }
  return vertices;
};

/**
 * @description: 创建图片元素
 * @param {String} str 图片地址或者base64图片
 * @return {Promise} element 图片元素
 */
export function createImgDom(str: string): Promise<any> {
  return new Promise((resolve) => {
    const imgEl = document.createElement('img');
    imgEl.crossOrigin = 'anonymous';
    imgEl.src = str;
    // 插入页面
    document.body.appendChild(imgEl);
    imgEl.onload = () => {
      resolve(imgEl);
    };
  });
}
/**
 * 页面数据转图片
 * @param list
 * @returns
 */

export function pageToImageBatch(list: IEditorPage[]) {
  return new Promise<any>(async (resolve) => {
    const c = document.createElement('canvas') as any;
    c.setAttribute('id', 'preview-canvas');
    document.body.appendChild(c);
    let cEle = document.getElementById('preview-canvas') as any;
    const canvas = new fabric.StaticCanvas('preview-canvas');
    const pageList = cloneDeep(list);
    const promiseArr = pageList.map((editorPage: IEditorPage) => {
      return new Promise((resolve) => {
        const stageObj = editorPage?.data?.objects.find((item: any) => item?.id === 'stage');
        const { left, top, width, height, name } = stageObj as fabric.Object;
        if (!width || !height) {
          editorPage.preview = { width: 0, height: 0, src: '' };
          resolve(true);
          return false;
        }
        editorPage.data.background = '';
        const option = { name, format: 'png', quality: 1, width, height, left, top };
        canvas.clear();
        canvas.loadFromJSON(editorPage.data, () => {
          canvas.renderAll.bind(canvas);
          canvas.requestRenderAll();
          canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
          canvas.renderAll();
          editorPage.preview = { width, height, src: canvas.toDataURL(option) };
          resolve(true);
        });
      });
    });
    await Promise.all(promiseArr);
    canvas.dispose();
    cEle.remove();
    cEle = null;
    const imgList = pageList.map((item) => item.preview) || [];
    resolve(imgList);
  });
}
/**
 * 页面数据生成缩略图
 * @param list
 * @returns
 */

export function pageToThumbBatch(list: IEditorPage[], thumbW?: number) {
  return new Promise<any>(async (resolve) => {
    const c = document.createElement('canvas') as any;
    c.setAttribute('id', 'thumb-canvas');
    document.body.appendChild(c);
    let cEle = document.getElementById('thumb-canvas') as any;
    const canvas = new fabric.StaticCanvas('thumb-canvas');

    const promiseArr = list.map((editorPage: IEditorPage) => {
      return new Promise((resolve) => {
        const stageObj = editorPage?.data?.objects.find((item: any) => item?.id === 'stage');
        const { width, height } = stageObj as fabric.Object;
        if (!width || !height) {
          editorPage.thumb = '';
          resolve(true);
          return false;
        }
        thumbW = thumbW || 100;
        const rate = thumbW / width;
        const thumbH = rate * height;
        const option = { format: 'png', quality: 1, width: thumbW, height: thumbH };
        canvas.clear();
        canvas.loadFromJSON(editorPage.data, () => {
          canvas.renderAll.bind(canvas);
          canvas.requestRenderAll();
          canvas.setViewportTransform([rate, 0, 0, rate, 0, 0]);
          canvas.renderAll();
          editorPage.thumb = canvas.toDataURL(option);
          resolve(true);
        });
      });
    });
    await Promise.all(promiseArr);
    canvas.dispose();
    cEle.remove();
    cEle = null;
    resolve(list);
  });
}
/**
 * 页面数据生成缩略图
 * @param list
 * @returns
 */

export function pageToThumb(editorPage: IEditorPage, thumbW?: number) {
  return new Promise<string>((resolve) => {
    const c = document.createElement('canvas') as any;
    c.setAttribute('id', 'thumb-canvas');
    c.setAttribute('style', 'display:none');
    document.body.appendChild(c);
    let cEle = document.getElementById('thumb-canvas') as any;
    const canvas = new fabric.StaticCanvas('thumb-canvas');
    const stageObj = editorPage?.data?.objects.find((item: any) => item?.id === 'stage');
    if (!stageObj) {
      resolve('');
      return false;
    }
    const { width, height } = stageObj as fabric.Object;
    if (!width || !height) {
      resolve('');
      return false;
    }
    thumbW = thumbW || 100;
    const rate = thumbW / width;
    const thumbH = rate * height;
    const option = { format: 'png', quality: 1, width: thumbW, height: thumbH };
    canvas.clear();
    canvas.loadFromJSON(editorPage.data, () => {
      canvas.renderAll.bind(canvas);
      canvas.requestRenderAll();
      canvas.setViewportTransform([rate, 0, 0, rate, 0, 0]);
      canvas.renderAll();
      const base64Url = canvas.toDataURL(option);
      canvas.dispose();
      cEle.remove();
      cEle = null;
      resolve(base64Url);
    });
  });
}
/**
 * 页面导出PDF
 * @param list
 * @param filename
 * @returns
 */
export async function exportPDFA4(list: Array<IEditorPageImage>, filename?: string) {
  return new Promise<boolean>((resolve) => {
    filename = filename || uuid();
    const [pageX, pageY] = [595.28, 841.89]; // A4纸
    let pdf: any = null; // A4纸，纵向
    list.forEach((item: IEditorPageImage, index: number) => {
      const imgW = item.width;
      const imgH = item.height;
      const orientation = imgW <= imgH ? 'p' : 'l';
      const rate = imgW <= imgH ? pageX : pageY;
      const pdfW = rate;
      const pdfH = rate / (imgW / imgH); //根据宽度计算高度
      if (index === 0) {
        pdf = new jsPDF(orientation, 'px', [pageX, pageY], true);
      } else {
        pdf.addPage([pageX, pageY], orientation);
      }

      pdf.setPage(index + 1);
      pdf.addImage(item.src, 'PNG', 0, 0, pdfW, pdfH);
    });
    pdf.save(`${filename}.pdf`);
    resolve(true);
  });
}
/**
 * 页面导出PDF
 * @description 根据页面实际尺寸导出，支持每页不同尺寸
 * @param list
 * @param filename
 * @returns
 */
export async function exportPDF(list: Array<IEditorPageImage>, filename?: string) {
  return new Promise<boolean>((resolve) => {
    filename = filename || uuid();
    let pdf: any = null;
    list.forEach((item: IEditorPageImage, index: number) => {
      const imgW = item.width;
      const imgH = item.height;
      const orientation = imgW <= imgH ? 'p' : 'l';
      const defW = 800;
      let pdfW = defW;
      let pdfH = imgW <= imgH ? defW / (imgW / imgH) : defW * (imgH / imgW); //根据宽度计算高度
      if (imgW < defW) {
        pdfW = imgW;
        pdfH = imgH;
      }
      if (index === 0) {
        pdf = new jsPDF(orientation, 'px', [pdfW, pdfH], true);
      } else {
        pdf.addPage([pdfW, pdfH], orientation);
      }
      pdf.addImage(item.src, 'PNG', 0, 0, pdfW, pdfH);
    });
    pdf.save(`${filename}.pdf`);
    resolve(true);
  });
}

/**
 * 多文件打包并下载
 * @param files 待下载的文件列表
 * @param fileName  下载的目标文件名
 * @files [ {name: 'xx', url: 'xx'}, {name: 'xx', url: 'xx'} ]
 * @example exportZip(files, 'xx.zip');
 */
export const exportZip = (files: IEditorPageImage[], ext?: string, fileName?: string) => {
  fileName = (fileName || uuid()) + '.zip';
  const fileExt = ext || '.png';
  const zip = new JSZip();
  const folder = zip.folder('files');
  return new Promise((resolve) => {
    if (folder && files && files.length > 0) {
      Promise.resolve()
        .then(() => {
          return files.reduce(
            async (accumulator: Promise<any>, file: any, currentIndex: number) => {
              const page = currentIndex + 1;
              await accumulator;
              const resp = await fetch(file.src);
              const blob = await resp.blob();
              return folder.file(page + fileExt, blob);
            },
            Promise.resolve(),
          );
        })
        .then(() => {
          folder.generateAsync({ type: 'blob' }).then((content) => saveAs(content, fileName));
          resolve(true);
        });
    } else {
      resolve(false);
    }
  });
};

/**
 * 页面导出JSON
 * @param list
 * @param filename
 * @returns
 */
export async function exportJSON(params: IEditorPage) {
  return new Promise<boolean>((resolve) => {
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(params, null, '\t'),
    )}`;
    const downEl = document.createElement('a');
    downEl.href = fileStr;
    downEl.download = `${uuid()}.json`;
    document.body.appendChild(downEl);
    downEl.click();
    downEl.remove();
    resolve(true);
  });
}
/**
 * 页面导出SVG
 * @param list
 * @param filename
 * @returns
 */
export function pageToSvgBatch(list: IEditorPage[]) {
  return new Promise<any>(async (resolve) => {
    const c = document.createElement('canvas') as any;
    c.setAttribute('id', 'preview-canvas');
    document.body.appendChild(c);
    let cEle = document.getElementById('preview-canvas') as any;
    const canvas = new fabric.StaticCanvas('preview-canvas');
    const pageList = cloneDeep(list);
    const promiseArr = pageList.map((editorPage: IEditorPage) => {
      return new Promise((resolve) => {
        const stageObj = editorPage?.data?.objects.find((item: any) => item?.id === 'stage');
        const { left, top, width, height } = stageObj as fabric.Object;
        if (!width || !height) {
          editorPage.preview = { width: 0, height: 0, src: '' };
          resolve(true);
          return false;
        }
        editorPage.data.background = '';
        const option = {
          width,
          height,
          viewBox: {
            x: left || 0,
            y: top || 0,
            width,
            height,
          },
        };
        canvas.clear();
        canvas.loadFromJSON(editorPage.data, () => {
          canvas.renderAll.bind(canvas);
          canvas.requestRenderAll();
          canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
          canvas.renderAll();
          const dataUrl = canvas.toSVG(option);
          const fileStr = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dataUrl)}`;
          editorPage.preview = { width, height, src: fileStr };
          resolve(true);
        });
      });
    });
    await Promise.all(promiseArr);
    canvas.dispose();
    cEle.remove();
    cEle = null;
    const imgList = pageList.map((item) => item.preview) || [];
    resolve(imgList);
  });
}
