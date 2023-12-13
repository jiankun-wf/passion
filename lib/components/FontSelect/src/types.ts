export declare interface Props {
  value?: undefined | string | Array<string | number>;
  placeholder?: string;
  multiple: boolean;
  disabled: boolean;
}

export interface FontSelectItem {
  id?: string;
  fontGNo: string;
  fontFamilyName?: string;
  fontFamilyNameCn?: string;
  webFontFamily?: string;
  checked?: boolean | undefined;
  indeterminate?: boolean | undefined;
  familyGrouped?: boolean;
  childFontResource?: FontSelectItem[];
  fold?: boolean | undefined;
}
