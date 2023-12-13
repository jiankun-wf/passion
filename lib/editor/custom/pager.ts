import { fabric } from 'fabric';

// 分页组件
export class PagerTextbox extends fabric.Textbox {
  constructor(text: string, options?: fabric.ITextboxOptions | undefined) {
    super(text, options);
  }
}

export function initPager() {
  if (!fabric.PagerTextbox) fabric.PagerTextbox = PagerTextbox;
}
