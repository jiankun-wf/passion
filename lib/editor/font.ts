import cloneDeep from 'lodash-es/cloneDeep';
import { getFontSubset } from './api';
import { IFontItem, IFontParams, IFontSubsetOptions, IWebFontItem } from './typings';

// 加载字体
const loadFontFace = async (list: IWebFontItem[]) => {
  const promiseArr = list.map((item: IWebFontItem) => {
    return new Promise((resolve) => {
      const font = new FontFace(item.familyName, `url('${item.ttfPath}')`);
      font.load().then(() => {
        const fonts: any = document.fonts;
        fonts.delete(font);
        fonts.add(font);
        resolve(true);
      });
    });
  });
  await Promise.all(promiseArr);
};
/**
 * 设置字体子集数据批量
 * @param {*} dataList
 * @param {*} options  text:子集化文字,textField:子集化文字字段,id:id映射
 * @returns
 */
export const getFontSubsetBatch = (dataList: IFontItem[], args: IFontSubsetOptions) => {
  const defOptions = {
    text: '',
    textField: '',
    id: 'fontGNo',
    children: 'childFontResource',
  };
  const options = { ...defOptions, ...args };
  return new Promise((resolve, reject) => {
    // 数据不能为空
    if (dataList?.length === 0) {
      resolve([]);
      return;
    }
    const params: Array<object> = [];
    const fontList: IFontItem[] = cloneDeep(dataList) || [];
    fontList.forEach((item: { [x: string]: any }) => {
      const simpleText = options.textField ? item[options.textField] + options.text : options.text;
      const children = item[options.children];
      if (simpleText && item[options.id]) {
        params.push({
          gno: item[options.id],
          text: simpleText,
        });
      }
      if (children && children.length > 0) {
        children.forEach((itemC: { [x: string]: any }) => {
          const simpleTextC = options.textField
            ? itemC[options.textField] + options.text
            : options.text;
          if (simpleTextC && itemC[options.id]) {
            params.push({
              gno: itemC[options.id],
              text: simpleTextC,
            });
          }
        });
      }
    });

    getFontSubset(params)
      .then(async (res) => {
        if (res?.length) {
          fontList.forEach((item: IWebFontItem) => {
            const currItem = res.find((i: { gno: string }) => i.gno === item[options.id]);
            if (currItem) {
              currItem.familyName = currItem.gno.replace(/^\d/, 'A');
              item.webFontFamily = currItem.familyName;
              item.woffPath = currItem.woffPath;
              item.ttfPath = currItem.ttfPath;
            }
            const children = item[options.children];
            if (children && children.length > 0) {
              children.forEach((itemC: IWebFontItem) => {
                const currItemC = res.find((i: { gno: any }) => i.gno === itemC[options.id]);
                if (currItemC) {
                  currItemC.familyName = currItemC.gno.replace(/^\d/, 'A');
                  itemC.webFontFamily = currItemC.familyName;
                  itemC.woffPath = currItemC.woffPath;
                  itemC.ttfPath = currItemC.ttfPath;
                }
              });
            }
          });
          await loadFontFace(res);
          resolve(fontList);
        } else {
          resolve([]);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
/**
 * 设置字体子集数据单个
 * @param {*} data
 * @param {*} options  text:子集化文字,textField:子集化文字字段,id:id映射
 * @returns
 */
export const getFontSubsetSingle = (data: IFontParams, options: IFontSubsetOptions) => {
  const defOptions = { text: '', textField: '', id: 'fontGNo' };
  options = { ...defOptions, ...options };
  return new Promise((resolve, reject) => {
    // 数据不能为空
    if (!data) {
      resolve(null);
      return;
    }
    const fontData = cloneDeep(data);
    const simpleText = options.text || fontData[options.textField as string];
    const params = [
      {
        gno: fontData[options.id as string],
        text: simpleText,
      },
    ];

    getFontSubset(params)
      .then(async (res) => {
        if (res?.length) {
          const currItem = res[0];
          if (currItem) {
            currItem.familyName = currItem.gno.replace(/^\d/, 'A');
            fontData.webFontFamily = currItem.familyName;
            fontData.woffPath = currItem.woffPath;
            fontData.ttfPath = currItem.ttfPath;
          }
          await loadFontFace(res);
          resolve(fontData);
        } else {
          resolve(null);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
