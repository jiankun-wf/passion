import { fabric } from 'fabric';

// 字稿表模板表格
export class DraftGroup extends fabric.Group {
  constructor() {
    super();
  }
}
// 字稿表模板单元格
export class DraftCell extends fabric.Group {
  constructor() {
    super();
  }
}

// 字稿表模板页眉
export class DraftHeader extends fabric.Textbox {
  constructor(text: string, options?: fabric.ITextboxOptions | undefined) {
    super(text, options);
  }
}

export function initDraft() {
  if (!fabric.DraftGroup) fabric.DraftGroup = DraftGroup;
  if (!fabric.DraftCell) fabric.DraftCell = DraftCell;
  if (!fabric.DraftHeader) fabric.DraftHeader = DraftHeader;
}
