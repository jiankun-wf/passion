import hotkeys, { KeyHandler } from 'hotkeys-js';
import { onMounted, onUnmounted } from 'vue';
import { HotkeyEnum } from '../enums/editorEnum';

const useHotKey = (keys: string, callback: KeyHandler) => {
  onMounted(() => {
    hotkeys(keys, callback);
  });
  onUnmounted(() => {
    hotkeys.unbind(keys, callback);
  });
};

export { useHotKey, HotkeyEnum };
