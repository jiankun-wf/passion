import { cloneDeep, debounce } from 'lodash-es';
import { ref, Ref, toRaw } from 'vue';
import { IEditorPage } from '../editor/typings';
import { pageToThumb } from '../editor/utils';

/**
 * 编辑器动作方法
 * @param editor
 * @param editorPage
 * @param editorPageId
 * @param editorPageLoading
 * @returns
 */
export function useAction(
  editor: Ref<any>,
  editorPage: Ref<IEditorPage[]>,
  editorPageId: Ref<string>,
  editorPageLoading: Ref<boolean>,
) {
  const editorHistoryList = ref<Array<IEditorPage>>([]); // 历史记录
  const editorHistoryDoList = ref<Array<IEditorPage>>([]); // 历史操作记录
  const historyMaxLen = 100;
  // 历史记录最后一页
  const _lastPage = (arr: IEditorPage[]) => arr[arr.length - 1];
  // 历史记录更新
  function editorHistoryAdd(page: IEditorPage) {
    if (!page) return;
    const data = cloneDeep(page);
    data.saveTime = new Date().getTime();
    if (editorHistoryList.value.length > historyMaxLen) {
      editorHistoryList.value.shift();
    }
    editorHistoryList.value.push(data);
  }
  // 保存页面数据
  async function editorPageSave() {
    return new Promise<IEditorPage>(async (resolve) => {
      const _editor = toRaw(editor.value);
      const data = _editor.getJson();
      const pageId = editorPageId.value;
      const currItem: IEditorPage | undefined = editorPage.value.find(
        (item: IEditorPage) => item.id === pageId,
      );
      if (currItem) {
        currItem.data = data;
        currItem.thumb = await pageToThumb(currItem);
        resolve(currItem);
      }
    });
  }
  const editorPageHistoryUpdateDebounce = debounce(function () {
    editorPageHistoryUpdate();
  }, 1000);

  // 保存页面数据并更新历史记录
  async function editorPageHistoryUpdate() {
    if (editorPageLoading.value) return;
    const currItem: IEditorPage | undefined = await editorPageSave();
    if (currItem) {
      editorHistoryAdd(currItem);
    }
  }
  // 历史记录后退
  function editorHistoryBack() {
    if (editorHistoryList.value.length <= 1) return;
    const currData: IEditorPage | undefined = editorHistoryList.value.pop();
    if (currData) {
      editorHistoryDoList.value.push(currData);
      const lastData = _lastPage(editorHistoryList.value);
      _resetRender(lastData);
    }
  }
  // 历史记录前进
  async function editorHistoryForward() {
    if (!editorHistoryList.value.length) return;
    const currData: IEditorPage | undefined = editorHistoryDoList.value.pop();
    if (currData) {
      editorHistoryList.value.push(currData);
      const lastData = _lastPage(editorHistoryList.value);
      _resetRender(lastData);
    }
  }
  // 历史记录数据渲染
  function _resetRender(page: IEditorPage) {
    // console.log('page', page);
    editorPageLoading.value = true;
    editorPageId.value = page.id;
    const canvas = toRaw(editor.value.canvas);
    const stage = editor.value?.stage;
    canvas.clear();
    canvas.loadFromJSON(page.data, async () => {
      canvas.renderAll.bind(canvas);
      const currStage = canvas.getObjects().find((item) => item.id === 'stage');
      // // console.log('currStage', currStage, canvas.getObjects());
      currStage.set('selectable', false);
      currStage.set('hasControls', false);
      // // 设置画板
      stage.setSize(currStage.width, currStage.height, false);
      stage.setFill(currStage.fill);
      canvas.requestRenderAll();
      editorPageLoading.value = false;
      await editorPageSave();
    });
  }

  return {
    editorPageHistoryUpdate,
    editorPageHistoryUpdateDebounce,
    editorPageSave,
    editorHistoryList,
    editorHistoryDoList,
    editorHistoryAdd,
    editorHistoryBack,
    editorHistoryForward,
  };
}
