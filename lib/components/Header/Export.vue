<template>
  <div class="editor-preview">
    <NDropdown
      :options="exportOptions"
      trigger="hover"
      @select="handleSelectExport"
    >
      <NButton type="info">
        <template #icon>
          <NIcon size="16">
            <DocumentExport />
          </NIcon>
        </template>
        导出文件
      </NButton>
    </NDropdown>
  </div>
</template>

<script lang="ts" setup name="EditorExport">
import { inject, ref, toRaw } from "vue";
import {
  createDiscreteApi,
  NDropdown,
  NButton,
  NIcon,
  type DropdownOption,
} from "naive-ui";
import { DocumentExport } from "@vicons/carbon";
import {
  pageToImageBatch,
  exportPDF,
  exportZip,
  exportJSON,
} from "../../editor/utils";
import { IEditorPageImage } from "../../editor/typings";
const { editorPage } = inject<any>("editor");
const loading = ref<boolean>(false);

const exportOptions: DropdownOption[] = [
  {
    label: "Pdf",
    key: "pdf",
  },
  {
    type: "divider",
  },
  {
    label: "Image",
    key: "image",
  },
  {
    type: "divider",
  },
  {
    label: "Json",
    key: "json",
  },
];

const { message } = createDiscreteApi(["message"]);

const handleSelectExport = (key: string) => {
  switch (key) {
    case "pdf":
      handleExportPDF();
      break;
    case "image":
      handleExportImage();
      break;
    case "json":
      handleExportJSON();
      break;
  }
};
// 导出PDF
async function handleExportPDF() {
  loading.value = true;
  const msg = message.create("正在导出Pdf...", {
    type: "loading",
    duration: 0,
  });
  const pageList = toRaw(editorPage.value);
  const list = (await pageToImageBatch(pageList)) as Array<IEditorPageImage>;
  setTimeout(() => {
    exportPDF(list)
      .then(() => {
        //
        msg.type = "success";
        (msg.content = "导出成功！"), (msg.duration = 1000);
      })
      .finally(() => {
        loading.value = false;
      });
  }, 300);
}
// 导出图片
async function handleExportImage() {
  loading.value = true;
  const msg = message.create("正在导出图片...", {
    type: "loading",
    duration: 0,
  });
  const pageList = toRaw(editorPage.value);
  const list = (await pageToImageBatch(pageList)) as Array<IEditorPageImage>;
  exportZip(list)
    .then(() => {
      msg.type = "success";
      (msg.content = "导出成功！"), (msg.duration = 1000);
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
  const msg = message.create("正在导出JSON...", {
    type: "loading",
    duration: 0,
  });
  const params = toRaw(editorPage.value);
  exportJSON(params)
    .then(() => {
      //
      msg.type = "success";
      (msg.content = "导出成功！"), (msg.duration = 1000);
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
