import { fabric } from 'fabric';

export type IExtObject = fabric.Object & {
  id: string;
  copyNum: number;
};
export interface IEditorOptions {
  container: string;
  selector: string;
}
export interface IEditorOptions {
  container: string;
  selector: string;
}
export interface IElementOptions {
  name?: string;
  left?: number;
  top?: number;
  fontFamily?: string;
  text?: string;
  imgEl?: any;
  width?: number;
  height?: number;
  url?: string;
  textAlign?: string;
  fontSize?: number;
}
export interface IEditorPage {
  id: string;
  thumb?: string;
  data: {
    version: string;
    objects: Object[];
    background?: any;
  };
  preview?: IEditorPageImage;
  saveTime?: number;
  fileNaming?: {
    content: string[];
    fileType: string;
  };
  current?: number;
}
export interface IEditorPageImage {
  width: number;
  height: number;
  src: string;
  page?: number;
}
export interface IFontDownloadSettings {
  fileName: string;
  releaseVersion: string;
  download: boolean;
  fontVersion: string;
}
export interface IFontItem {
  fontGNo: string;
  fontBrandId: string;
  fontBrandNumber: string;
  fontTypeNumber: string;
  fontNamePinyin: string;
  calligraphyTypeNumber: string;
  fontCharsetNumber: string;
  fontLanguageNumber: string;
  fontWeightNumber: string;
  fontFamilyNumber: string;
  fontFamilyNamePinyin: string;
  fontFamilyName: string;
  fontFamilyNameCn: string;
  fontFamilyNameEn: string;
  familyed: boolean;
  familyGrouped: boolean;
  firstWeightDisplay: string;
  resourceType: string;
  childFontResource: IFontItem[];
  firstTagsDisplay: string;
  downloadSettings: IFontDownloadSettings[];
  traditionalSupport: string;
  fontAlias: string;
  fontCover: string;
  fontSampleword: string;
  wapperTag?: string[];
  isUnfold?: boolean;
  webFontFamily?: string;
  woffPath?: string;
  ttfPath?: string;
  webFontUrl?: string;
}

export interface IFontSubsetOptions {
  textField?: string;
  text?: string;
  children?: string;
  id?: string;
  isAppend?: boolean;
}

export interface IWebFontItem extends IFontItem {
  gno: string;
  familyName: string;
  webFontFamily?: string;
  woffPath: string;
  ttfPath: string;
}
export interface IFontParams {
  fontGNo: string;
  fontFamilyName?: string;
  fontFamilyNameCn?: string;
  text?: string;
  gno?: string;
  familyName?: string;
  webFontFamily?: string;
  woffPath?: string;
  ttfPath?: string;
}
// 字体属性设置
export interface IFontAttr {
  fontReplace?: boolean;
  fontGNo: string;
  fontFamilyName: string;
  webFontUrl: string;
  fontSampleword: string;
}
