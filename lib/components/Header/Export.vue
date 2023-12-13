<template>
  <div class="editor-preview">
    <Dropdown>
      <button class="editor__btn" @click.prevent>
        <Icon icon="mingcute:pdf-line" size="16" />
        <span>导出</span>
      </button>
      <template #overlay>
        <Menu>
          <MenuItem>
            <span @click="handleExportPDF">导出PDF</span>
          </MenuItem>
          <MenuItem>
            <span @click="handleExportImage">导出图片</span>
          </MenuItem>
          <!-- <MenuItem>
            <span @click="handleExportSVG">导出SVG</span>
          </MenuItem> -->
          <MenuItem>
            <span @click="handleExportJSON">导出JSON</span>
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
    <!-- <button class="editor__btn" @click="handleExportPDF">
      <Icon icon="mingcute:pdf-line" size="16" />
      <span>导出</span>
    </button> -->
  </div>
</template>

<script lang="ts" setup name="EditorExport">
import { inject, ref, toRaw } from "vue";
import { Icon } from "/@/components/Icon";
import { message, Dropdown, Menu, MenuItem } from "ant-design-vue";
import {
  pageToImageBatch,
  exportPDF,
  exportZip,
  exportJSON,
} from "../../editor/utils";
import { IEditorPageImage } from "../../editor/typings";
const { editorPage } = inject<any>("editor");
const loading = ref<boolean>(false);

// 导出PDF
async function handleExportPDF() {
  loading.value = true;
  const key = "pdf";
  message.loading({ content: "正在导出PDF...", key, duration: 0 });
  const pageList = toRaw(editorPage.value);
  const list = (await pageToImageBatch(pageList)) as Array<IEditorPageImage>;
  setTimeout(() => {
    exportPDF(list)
      .then(() => {
        message.success({ content: "导出成功!", key, duration: 2 });
      })
      .finally(() => {
        loading.value = false;
      });
  }, 300);
}
// 导出图片
async function handleExportImage() {
  loading.value = true;
  const key = "image";
  message.loading({ content: "正在导出图片...", key, duration: 0 });
  const pageList = toRaw(editorPage.value);
  const list = (await pageToImageBatch(pageList)) as Array<IEditorPageImage>;
  exportZip(list)
    .then(() => {
      message.success({ content: "导出成功!", key, duration: 2 });
    })
    .finally(() => {
      loading.value = false;
    });
}
// 导出SVG
// async function handleExportSVG() {
//   loading.value = true;
//   const key = 'image';
//   message.loading({ content: '正在导出SVG...', key, duration: 0 });
//   const pageList = toRaw(editorPage.value);
//   const list = (await pageToSvgBatch(pageList)) as Array<IEditorPageImage>;
//   // console.log('list', list);
//   exportZip(list, '.svg')
//     .then(() => {
//       message.success({ content: '导出成功!', key, duration: 2 });
//     })
//     .finally(() => {
//       loading.value = false;
//     });
// }
// 导出JSON
async function handleExportJSON() {
  loading.value = true;
  const key = "json";
  message.loading({ content: "正在导出JSON...", key, duration: 0 });
  const params = toRaw(editorPage.value);
  exportJSON(params)
    .then(() => {
      message.success({ content: "导出成功!", key, duration: 2 });
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<style lang="less">
@media print {
  .ant-modal-footer,
  .ant-modal-header {
    display: none;
  }
  .ant-modal {
    width: 100%;
    img {
      width: 100%;
    }
  }
}
.editor-preview {
  &__modal {
    height: calc(100vh - 150px);
    overflow-y: auto;
    text-align: center;
    background-color: #f7f7f7;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0;
    img {
      margin-bottom: 10px;
    }
  }
}
</style>
