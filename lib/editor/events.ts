import { fabric } from 'fabric';
import { useEventBus } from '@vueuse/core';
const bus = useEventBus<string>('editor');

// 自定义事件
function listener(canvas: fabric.Canvas) {
  const actives = canvas.getActiveObjects();
  if (actives && actives.length === 1) {
    bus.emit('select-single');
  } else if (actives && actives.length > 1) {
    bus.emit('select-multiple');
  } else {
    bus.emit('select-cancle');
  }
}

// 侦听画布事件
function events(canvas: fabric.Canvas) {
  canvas.on('selection:created', () => listener(canvas));
  canvas.on('selection:updated', () => listener(canvas));
  canvas.on('selection:cleared', () => listener(canvas));
}

export default events;
