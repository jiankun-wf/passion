import { UploadApiResult } from '/@/api/sys/model/uploadModel';

export enum UploadResultStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  UPLOADING = 'uploading',
}

export interface FileItem {
  thumbUrl?: string;
  uid?: string;
  name?: string;
  size?: string | number;
  type?: string;
  percent?: number;
  file?: File;
  status?: UploadResultStatus;
  responseData?: UploadApiResult;
  onSuccess?: Function | any;
  onError?: Function | any;
  url?: string;
  preview?: string;
  originFileObj?: any;
  itemUid?: string;
}

export interface PreviewFileItem {
  url: string;
  name: string;
  type: string;
}

export interface FileBasicColumn {
  /**
   * Renderer of the table cell. The return value should be a VNode, or an object for colSpan/rowSpan config
   * @type Function | ScopedSlot
   */
  customRender?: Function;
  /**
   * Title of this column
   * @type any (string | slot)
   */
  title: string;

  /**
   * Width of this column
   * @type string | number
   */
  width?: number;
  /**
   * Display field of the data record, could be set like a.b.c
   * @type string
   */
  dataIndex: string;
  /**
   * specify how content is aligned
   * @default 'left'
   * @type string
   */
  align?: 'left' | 'right' | 'center';
  /**
   * 是否可编辑
   */
  editRow?: boolean;
  slots?: Object;

  // 是否为自定义渲染
  __renderInput?: boolean;
  [x: string]: any;
}
