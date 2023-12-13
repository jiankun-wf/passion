import { defHttp } from '/@/utils/http/axios';
const ossUrl = '/src/components/CuDesignEditor/src';

/**
 * 字体子集-批量
 * @param params 要传的参数值
 */
export function getFontSubset(params: object) {
  return defHttp.post(
    {
      url: `/webfont/http`,
      data: params,
    },
    { apiUrl: 'http://webfont.godfont.com' },
  );
}
/**
 * 字体列表
 * @param params
 * @returns
 */
export const getFontList = (params: object) => {
  return defHttp.get(
    {
      url: '/web/api/font/getFontList',
      params,
    },
    { apiUrl: 'http://api.godfont.com' },
  );
};

/**
 * 素材svg列表
 * @param params
 * @returns
 */
export const getResSvgList = () => {
  return new Promise((resolve) => {
    const dataList: any[] = [
      {
        title: '甜品',
        type: 'sweet',
        length: 18,
        children: [],
      },
      {
        title: '礼物',
        type: 'gift',
        length: 18,
        children: [],
      },
      {
        title: '旅行',
        type: 'traveling',
        length: 21,
        children: [],
      },
    ];
    dataList.forEach((item) => {
      for (let i = 0; i < item.length; i++) {
        const url = `${ossUrl}/assets/svg/${item.type}/${i + 1}.svg`;
        item.children.push({
          image: url,
          thumb: url,
          title: item.title,
        });
      }
    });
    resolve(dataList);
  });
};

/**
 * 素材照片列表
 * @param params
 * @returns
 */
export const getResPicList = () => {
  return new Promise((resolve) => {
    const dataList: any[] = [
      {
        title: '风景',
        type: 'nature',
        length: 4,
        children: [],
      },
      {
        title: '旅行',
        type: 'travel',
        length: 6,
        children: [],
      },
      {
        title: '美食',
        type: 'food',
        length: 10,
        children: [],
      },
    ];
    dataList.forEach((item) => {
      for (let i = 0; i < item.length; i++) {
        const url = `${ossUrl}/assets/pic/${item.type}/${i + 1}.jpg`;
        item.children.push({
          image: url,
          thumb: url + '?x-oss-process=image/resize,w_150,m_lfit',
          title: item.title,
        });
      }
    });
    resolve(dataList);
  });
};
