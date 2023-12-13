import { fabric } from 'fabric';

// 字体样例
export class SampleGroup extends fabric.Group {
  constructor() {
    super();
  }
}

export function initSample() {
  if (!fabric.SampleGroup) fabric.SampleGroup = SampleGroup;
}
