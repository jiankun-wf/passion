<template>
  <div class="editor-page">
    <div class="editor-page__add">
      <a-button
        block
        size="large"
        @click="handlePageAdd"
        type="primary"
        preIcon="ant-design:plus-outlined"
      >
        添加页面
      </a-button>
    </div>
    <div class="editor-page__list" ref="pageRef">
      <div v-for="(item, index) in editorPage" :key="item.id" class="handle">
        <Dropdown :trigger="['contextmenu']">
          <div
            class="editor-page__card"
            :class="{ active: item.id === editorPageId }"
            @click="handlePageChange(item)"
          >
            <div class="editor-page__card-page">{{ index + 1 }}</div>
            <div
              class="editor-page__card-item"
              :style="{ backgroundImage: `url(${item.thumb})` }"
            >
              <!-- <span v-if="!item.thumb">{{ `第${index + 1}页` }}</span> -->
            </div>
          </div>

          <template #overlay>
            <Menu>
              <MenuItem key="copy">
                <a-button type="text" size="small" @click="handleCopy(item)"
                  >复制页面</a-button
                >
              </MenuItem>
              <MenuItem key="cut">
                <a-button
                  type="text"
                  size="small"
                  @click="handleCut(item, index)"
                >
                  剪切页面
                </a-button>
              </MenuItem>
              <MenuItem key="add">
                <a-button type="text" size="small" @click="handleInsert(index)">
                  插入空白页
                </a-button>
              </MenuItem>
              <MenuItem key="paste">
                <a-button
                  type="text"
                  size="small"
                  @click="handlePaste(index)"
                  :disabled="!clonePage"
                >
                  粘贴页面
                </a-button>
              </MenuItem>
              <MenuItem key="delete">
                <a-button
                  type="link"
                  danger
                  size="small"
                  @click="handleDelete(index)"
                  :disabled="editorPage.length <= 1"
                >
                  删除页面
                </a-button>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorResPage">
import { inject, watch, ref, toRaw, nextTick } from "vue";
import { Dropdown, Menu, MenuItem } from "ant-design-vue";
import { buildUUID as uuid } from "../../editor/uuid";
import { IEditorPage } from "../../editor/typings";
import { cloneDeep } from "lodash-es";
import { useFontface } from "../../hooks/useFontface";
import { useSortable } from "@vueuse/integrations/useSortable";

const { getFontSubsetBatch } = useFontface();

const {
  editor,
  editorPage,
  editorPageId,
  editorPageLoading,
  editorHistoryAdd,
  editorPageHistoryUpdateDebounce,
} = inject<any>("editor");

const clonePage = ref<IEditorPage | null>();

const pageRef = ref<HTMLElement | null>(null);
useSortable(pageRef, editorPage, {
  handle: ".handle",
  animation: 150,
  sort: true,
});
// 添加页面
function handlePageAdd() {
  const index =
    editorPage.value.findIndex(
      (item: IEditorPage) => item.id === editorPageId.value
    ) || 0;
  handleInsert(index);
}
// 切换页面
function handlePageChange(item: IEditorPage) {
  editorPageLoading.value = true;
  editorPageId.value = item.id;
  const canvas = toRaw(editor.value.canvas);
  const stage = editor.value?.stage;
  canvas.loadFromJSON(item.data, () => {
    canvas.renderAll.bind(canvas);
    const currStage = canvas.getObjects().find((item) => item.id === "stage");
    // console.log('currStage', currStage, canvas.getObjects());
    currStage.set("selectable", false);
    currStage.set("hasControls", false);
    // 设置画板
    stage.setSize(currStage.width, currStage.height, true);
    stage.setFill(currStage.fill);
    canvas.requestRenderAll();
    editorPageLoading.value = false;
    // 第一次加载画布也记录历史防止回退空白
    editorPageHistoryUpdateDebounce();
    resetFontAttr();
  });
}
// 解决字体某些字体选择失效问题
function resetFontAttr() {
  const canvas = toRaw(editor.value.canvas);
  canvas.forEachObject(function (obj) {
    if (obj?.type?.includes("text") && !obj.lockMovementX) {
      obj.set("selectable", true);
      obj.set("hasControls", true);
    }
  });
}
// 页面拷贝
function handleCopy(item: IEditorPage) {
  clonePage.value = cloneDeep(item);
  clonePage.value.id = uuid();
}
// 页面剪切
function handleCut(item: IEditorPage, index: number) {
  clonePage.value = cloneDeep(item);
  editorPage.value.splice(index, 1);
}
// 页面粘贴
function handlePaste(index: number) {
  const currClone = toRaw(clonePage.value);
  editorPage.value.splice(index + 1, 0, currClone);
  clonePage.value = null;
}
// 页面删除
function handleDelete(index: number) {
  editorPage.value.splice(index, 1);
}
// 页面插入空白页
function handleInsert(index: number) {
  editorPageLoading.value = true;
  const _editor = toRaw(editor.value);
  const canvas = toRaw(editor.value.canvas);
  _editor.clear();
  canvas.requestRenderAll();
  const stage = _editor?.stage;
  stage.setSize(900, 1200, true);
  stage.setFill("rgba(255,255,255,1)");
  stage?.stageRect?.set("cuFlex", "");

  const data = _editor.getJson();
  const currItem: IEditorPage = {
    id: uuid(),
    data,
  };
  editorPage.value.splice(index + 1, 0, currItem);
  // 更新历史记录
  editorHistoryAdd(currItem);
  handlePageChange(currItem);
}

// 页面初始化
function initPage() {
  const pageList = toRaw(editorPage.value);
  if (pageList.length) {
    let currItem = pageList.find(
      (item: IEditorPage) => item.id === editorPageId.value
    );
    if (!currItem) {
      currItem = pageList[0];
    }
    handlePageChange(currItem);
  } else {
    handlePageAdd();
  }
}
function getAllTextFont(list: any[]) {
  let results: any[] = [];
  for (let i = 0; i < list.length; i++) {
    const obj = list[i];
    if (obj.objects && obj.objects.length > 0) {
      results = results.concat(getAllTextFont(obj.objects));
    } else {
      if (obj?.type?.includes("text") && obj.font) {
        results.push({ ...obj.font, text: obj.text });
      }
    }
  }
  return results;
}
async function initFont() {
  const pageList = toRaw(editorPage.value);
  const canvas = toRaw(editor.value?.canvas);
  if (!canvas) return;
  if (!pageList?.length) {
    handlePageAdd();
    return false;
  }
  let objectList: any[] = [];
  pageList.map((page) => {
    objectList = [...objectList, ...page.data.objects];
  });
  const results = getAllTextFont(objectList);
  if (results?.length) {
    await getFontSubsetBatch(results, { textField: "text" });
  }
  initPage();
}
watch(
  () => editorPage.value,
  () => {
    nextTick(() => {
      initFont();
    });
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
.editor-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100%;
  &__add {
    width: 100%;
    // height: 40px;
    padding: 16px;
  }
  &__list {
    flex: 1;
    width: 100%;
    overflow: auto;
  }
  &__card {
    padding: 15px;
    display: flex;
    justify-content: center;
    transition: all 0.25s ease;
    position: relative;
    cursor: pointer;
    &-page {
      position: absolute;
      top: 12px;
      left: 12px;
      font-size: 12px;
    }
    &-item {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      background-color: #fff;
      border: 1px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: border-color 0.25s ease-in-out;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
    }
    &:hover {
      .editor-page__card-item {
        border-width: 2px;
        border-color: #1890ff;
      }
    }
    &.active,
    &.ant-dropdown-open {
      background-color: #e6f7ff;
      .editor-page__card-item {
        border-color: #e6f7ff;
      }
    }
  }
}
</style>
