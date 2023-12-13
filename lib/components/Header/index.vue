<template>
  <div class="editor-header">
    <div class="editor-header__left">
      <span class="editor-header__title">在线模板设计</span>
    </div>
    <EditorTool v-bind="bindValue" />
  </div>
</template>
<script lang="ts" setup name="EditorHeader">
import EditorTool from "./Tool.vue";
import { computed, unref } from "vue";
import { useAttrs } from "../../hooks/useAttr";
const attrs = useAttrs();
const bindValue = computed(() => {
  const value = { ...unref(attrs) };
  return value;
});
</script>
<style lang="less" scoped>
.editor-header {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &__left {
    display: flex;
    align-items: center;
    color: #666;
    width: 340px;
  }
  &__logo {
    font-size: 16px;
    color: #1890ff;
    width: 60px;
    justify-content: center;
  }
  &__title {
    margin-left: 16px;
    font-size: 24px;
    color: #0072ff;
    font-family: GEETYPE-DSDADAGB;
    margin-bottom: 3px;
  }
}
</style>
