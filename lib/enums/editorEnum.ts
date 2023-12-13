// 键盘快捷键
export enum HotkeyEnum {
  // 方向
  DIRECTION = 'left,right,down,up,shift+left,shift+right,shift+down,shift+up',
  // 保存
  SAVE = 'ctrl+s',
  // 上一步
  BACK = 'ctrl+z',
  // 下一步
  Forward = 'ctrl+y',
  // 复制
  COPY = 'ctrl+c',
  // 剪切
  CUT = 'ctrl+x',
  // 粘贴
  PASTE = 'ctrl+v',
  // 标尺
  RULER = 'ctrl+r',
  // 删除
  DELETE = 'delete',
  // 置顶
  STACK_FRONT = 'ctrl+shift+]',
  // 置底
  STACK_BACK = 'ctrl+shift+[',
  // 上移一层
  STACK_FORWARD = 'ctrl+]',
  // 下移一层
  STACK_BACKWARD = 'ctrl+[',
  // 中心缩放
  CENTERED_SCALING = 'alt',
  // 画布拖拽
  CANVAS_DRING = 'space',
}

// 组件元素icon
export enum EleIconEnum {
  GROUP = 'carbon:group-objects',
  TEXTBOX = 'fluent:textbox-16-regular',
  ITEXT = 'mdi:format-text-variant',
  IMAGE = 'mdi:image-outline',
  RECT = 'iconoir:3d-rect-corner-to-corner',
  CIRCLE = 'material-symbols:circle-outline',
  TRIANGLE = 'ph:triangle',
  POLYGON = 'uil:polygon',
  CASE = 'ant-design:insert-row-left-outlined',
  SAMPLE = 'ant-design:insert-row-below-outlined',
  INTRODUCTION = 'ant-design:file-text-outlined',
}
