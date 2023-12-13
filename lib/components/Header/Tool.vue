<template>
  <div class="editor-tool">
    <div class="editor-tool__left">
      <Tooltip>
        <template #title>上一步<br />{{ HotkeyEnum.BACK }}</template>
        <button
          class="editor__btn-ico"
          @click="handleBack"
          :disabled="editorHistoryList.length <= 1"
        >
          <Icon icon="mingcute:back-2-line" size="24" />
        </button>
      </Tooltip>
      <Tooltip>
        <template #title>下一步<br />{{ HotkeyEnum.Forward }}</template>
        <button
          class="editor__btn-ico"
          @click="handleForward"
          :disabled="!editorHistoryDoList.length"
        >
          <Icon icon="mingcute:forward-2-line" size="24" />
        </button>
      </Tooltip>
      <Tooltip>
        <template #title>保存至云端工作台<br />{{ HotkeyEnum.SAVE }}</template>
        <button class="editor__btn" @click="handleSave">
          <Icon icon="ant-design:cloud-upload-outlined" size="16" />
          <span>保存</span>
        </button>
      </Tooltip>
      <span class="editor-tool-tip" v-if="saveTime">{{ saveTime }} 已保存</span>
    </div>
    <div class="editor-tool__right">
      <EditorPreview />
      <EditorExport />
      <button @click="handleCloseConfirm" class="editor__btn editor__btn-danger">
        <Icon icon="ant-design:close-outlined" size="16" />
        <span>关闭</span>
      </button>
    </div>
    <Modal v-model:visible="visible">
      <template #title>
        <div class="editor-tool__modal-title">
          <Icon icon="ant-design:warning-outlined" size="20" />
          <span>是否保存设计稿？</span>
        </div>
      </template>
      <div class="p-4">是否保存设计稿的更改?</div>
      <template #footer>
        <Button key="submit" type="primary" :loading="loading" @click="handleSaveClose">
          保存退出
        </Button>
        <Button key="back" @click="handleClose">直接退出</Button>
        <Button key="back" @click="visible = false">取消</Button>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup name="EditorTool">
  import { computed, inject, onMounted, onUnmounted, ref, toRaw } from 'vue';
  import { Tooltip, Modal, Button } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import EditorPreview from './Preview.vue';
  import EditorExport from './Export.vue';
  import { HotkeyEnum } from '../../hooks/useHotKey';
  import { IEditorPage } from '../../editor/typings';

  const visible = ref<boolean>(false);
  const loading = ref<boolean>(false);
  const emit = defineEmits(['save', 'close', 'saveclose']);

  const {
    editorPage,
    editorPageHistoryUpdate,
    editorHistoryList,
    editorHistoryDoList,
    editorHistoryBack,
    editorHistoryForward,
  } = inject<any>('editor');

  // 获取保存时间
  const saveTime = computed(() => {
    const list = editorHistoryList.value;
    const len = list.length || 0;
    if (len) {
      const unix = list[len - 1]?.saveTime;
      if (!unix) return '';
      return new Date(unix).toTimeString().substring(0, 8);
    } else {
      return '';
    }
  });

  // 后退
  function handleBack(e: Event) {
    e.preventDefault();
    editorHistoryBack();
  }
  // 前进
  function handleForward(e: Event) {
    e.preventDefault();
    editorHistoryForward();
  }
  // 保存
  function handleSave(e: Event) {
    e.preventDefault();
    editorPageHistoryUpdate();
    const params = toRaw(editorPage.value);
    params.forEach((item: IEditorPage, index: number) => {
      item.current = index + 1;
    });
    emit('save', params);
  }
  // 关闭
  function handleClose(e: Event) {
    e.preventDefault();
    emit('close');
  }
  // 关闭确认
  function handleCloseConfirm(e: Event) {
    e.preventDefault();
    visible.value = true;
    loading.value = false;
  }
  // 保存并关闭
  function handleSaveClose(e: Event) {
    e.preventDefault();
    loading.value = true;
    editorPageHistoryUpdate();
    const params = toRaw(editorPage.value);
    params.forEach((item: IEditorPage, index: number) => {
      item.current = index + 1;
    });
    emit('saveclose', params);
  }
  onUnmounted(() => {
    window.onbeforeunload = null;
    window.onpopstate = null;
  });
  onMounted(() => {
    window.onbeforeunload = () => {
      console.log('onbeforeunload');
      return 'Your work will be lost.';
    };
    history.pushState(null, '', document.URL);
    window.onpopstate = () => {
      history.pushState(null, '', document.URL);
    };
  });
</script>

<style lang="less" scoped>
  .editor-tool {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &__left {
      display: flex;
      align-items: center;
      flex: 1;
    }
    &__right {
      padding-right: 10px;
      display: flex;
      align-items: center;
    }
    &-tip {
      padding-left: 10px;
      color: #979797;
    }
    &__modal {
      &-title {
        display: flex;
        align-items: center;
        color: rgb(255, 166, 0);
      }
    }
  }
</style>
