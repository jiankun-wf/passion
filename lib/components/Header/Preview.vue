<template>
  <div class="editor-preview">
    <button class="editor__btn" @click="handlePreview">
      <Icon icon="mingcute:airplay-line" size="16" />
      <span>预览</span>
    </button>
    <Modal
      v-model:visible="visible"
      title="预览设计稿"
      width="70vw"
      :bodyStyle="{ padding: 0 }"
      style="top: 20px"
    >
      <div class="editor-preview__modal">
        <!-- <canvas id="preview-canvas"></canvas> -->
        <img :src="item.src" alt="" v-for="(item, index) in previewList" :key="index" />
      </div>
      <template #footer>
        <a-button @click="visible = false">关闭</a-button>
        <a-button type="primary" :loading="loading" @click="handleExportPDF">导出PDF</a-button>
        <a-button type="primary" :loading="loading" @click="handleExportImage">导出图片</a-button>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup name="EditorPreview">
  import { inject, ref, toRaw } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { Modal, message } from 'ant-design-vue';
  import { pageToImageBatch, exportPDF, exportZip } from '../../editor/utils';
  import { IEditorPageImage } from '../../editor/typings';
  const { editorPage } = inject<any>('editor');

  const loading = ref<boolean>(false);
  const visible = ref<boolean>(false);
  const previewList = ref<Array<IEditorPageImage>>([]);

  // 预览
  async function handlePreview() {
    visible.value = true;
    const pageList = toRaw(editorPage.value);
    previewList.value = await pageToImageBatch(pageList);
  }

  // 导出PDF
  function handleExportPDF() {
    const list = toRaw(previewList.value);
    loading.value = true;
    const key = 'pdf';
    message.loading({ content: '正在导出PDF...', key, duration: 0 });
    setTimeout(() => {
      exportPDF(list)
        .then(() => {
          message.success({ content: '导出成功!', key, duration: 2 });
        })
        .finally(() => {
          loading.value = false;
        });
    }, 300);
  }
  // 导出图片
  async function handleExportImage() {
    const list = toRaw(previewList.value);
    loading.value = true;
    const key = 'image';
    message.loading({ content: '正在导出图片...', key, duration: 0 });
    exportZip(list)
      .then(() => {
        message.success({ content: '导出成功!', key, duration: 2 });
      })
      .finally(() => {
        loading.value = false;
      });
  }
</script>

<style lang="less">
  .editor-preview {
    &__modal {
      height: calc(100vh - 150px);
      overflow-y: auto;
      text-align: center;
      background-color: #e6e6e6;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px;
      img {
        margin-bottom: 10px;
        max-width: 800px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>
