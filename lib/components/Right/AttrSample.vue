<template>
  <div class="editor-attr">
    <div class="editor-attr__title">{{ title }}</div>
    <div class="editor-attr__group">
      <div class="editor-attr__row">
        <EditorFontSelect
          v-bind="editorProps?.fontProps"
          :multiple="true"
          :items="state.fontFamilyItems"
          style="width: 100%"
          @change="handleFontFamily"
        />
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">序号</span>
          <div class="editor-attr__field-value">
            <InputNumber :value="state.custom.sn" :min="0" @change="handleChangeSn" />
          </div>
        </div>
      </div>
      <div class="editor-attr__title">样式</div>
      <div class="editor-attr__group">
        <div class="editor-attr__row">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">透明度</span>
            <Slider
              class="editor-attr__field-value"
              :value="state.opacity"
              :min="0"
              :max="100"
              @change="handleChangeOpacity"
            />
            <div class="editor-attr__field-number">
              <InputNumber
                :value="Math.floor(state.opacity)"
                :min="0"
                :max="100"
                @change="handleChangeOpacity"
              />
            </div>
          </div>
        </div>
        <div class="editor-attr__row">
          <div class="editor-attr__field">
            <NColorPicker :value="state.fill" :on-update:value="handleChangeFill" />
            <span class="editor-attr__field-label">颜色</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorAttrSample">
  import { inject, ref, toRaw, reactive, watchEffect } from 'vue';
  import { IFontItem } from '../../editor/typings';
  import { EditorFontSelect } from '../FontSelect';
  import { FontSelectItem } from '../FontSelect/src/types';
  import { useFontface } from '../../hooks/useFontface';
  import { message, InputNumber, Slider } from 'ant-design-vue';
  import { NColorPicker } from 'naive-ui';

  const { getFontSubsetBatch } = useFontface();
  const props = defineProps({
    title: { type: String },
    activeType: { type: String },
    activeObject: { type: Object },
  });
  interface IAttrItem {
    icon?: string;
    label?: string;
    key: string;
    value: any;
    checked?: boolean;
  }
  const { editor, editorPageHistoryUpdateDebounce, editorProps } = inject<any>('editor');
  const state = reactive({
    groupName: '',
    fontFamilyItems: [] as FontSelectItem[],
    custom: {
      sn: 0,
    },
    opacity: 100,
    fill: '#000',
  });
  const activeObjectRef = ref();

  function getDefaultAttr() {
    const activeObject = activeObjectRef.value;
    state.opacity = activeObject?.get('opacity') * 100;
    state.fill = activeObject?.get('fill');
    state.custom = { ...state.custom, ...activeObject?.custom };
    let objects = activeObject.getObjects();
    let fontList: any[] = [];
    objects.forEach((object) => {
      let sampleObj = object.getObjects()[0];
      const font = sampleObj?.font;
      if (font) {
        fontList.push(font);
      }
    });
    if (fontList?.length) {
      state.fontFamilyItems = fontList;
    }
  }
  // 选择字体
  async function handleFontFamily(_: any, items: IFontItem[]) {
    const list = (await getFontSubsetBatch(items, { text: '0123456789 ' })) as IFontItem[];
    if (!list || !list.length) {
      message.error('至少选择一种字体');
      return false;
    }
    const canvas = toRaw(editor.value.canvas);
    let activeObject = activeObjectRef.value;
    let objects = activeObject.getObjects();
    let sampleItem = objects[0];
    let itemH = sampleItem.height;
    let groupH = items.length * itemH;
    activeObject.set('height', groupH);
    sampleItem.set('top', -groupH / 2);
    // console.log('list', list);
    objects.forEach((object) => {
      activeObject.remove(object);
    });
    list.map(async (font, index) => {
      await sampleItem?.clone((cloned: any) => {
        // canvas.discardActiveObject();
        if (cloned.left === undefined || cloned.top === undefined) return;
        // 间距设置
        const grid = itemH * index;
        const sn = (index + 1).toString().padStart(2, '0') + ' ';
        // activeObject.height += grid;
        cloned.set({
          left: cloned.left,
          top: cloned.top + grid,
          name: activeObject.name,
        });
        const fontFamilyName = font?.fontFamilyName || font?.fontFamilyNameCn;
        const fontSampleword = font?.fontSampleword || fontFamilyName;
        const webFontFamily = font?.webFontFamily || '';
        const fontInfo = {
          fontFamilyName: fontFamilyName,
          fontGNo: font?.fontGNo,
          webFontUrl: font?.ttfPath,
          fontSampleword: fontSampleword,
        };
        let clonedObjects = cloned?.getObjects();
        clonedObjects[0].text = sn + fontFamilyName;
        clonedObjects[0].fontFamily = webFontFamily;
        clonedObjects[0].font = fontInfo;
        clonedObjects[1].text = fontSampleword;
        clonedObjects[1].fontFamily = webFontFamily;
        clonedObjects[1].font = fontInfo;
        activeObject.add(cloned);

        canvas.renderAll();
      });
    });
    editorPageHistoryUpdateDebounce();
  }
  // 设置背景色
  function handleChangeFill(value: string) {
    const params = { key: 'fill', value };
    setTextAttr(params);
  }
  // 设置透明
  function handleChangeOpacity(value: number) {
    state.opacity = Math.floor(state.opacity);
    const params = { key: 'opacity', value: value / 100 };
    setAttr(params);
  }
  // 设置序号
  function handleChangeSn(value: number) {
    const activeObject = activeObjectRef.value;
    const canvas = toRaw(editor.value.canvas);
    state.custom = { ...state.custom, sn: value };
    activeObject.set('custom', state.custom);
    let objects = activeObject.getObjects();
    objects.forEach((object, index) => {
      let sampleObj = object.getObjects()[0];
      let sn = index + value;
      sn = sn.toString().padStart(2, '0') + ' ';
      sampleObj?.set('text', sn + sampleObj?.font?.fontFamilyName);
    });
    canvas.renderAll();
    editorPageHistoryUpdateDebounce();
  }
  // 设置属性
  function setAttr(item: IAttrItem) {
    const activeObject = activeObjectRef.value;
    const canvas = toRaw(editor.value.canvas);
    if (activeObject) {
      activeObject.set(item.key, item.value);
      canvas.renderAll();
      editorPageHistoryUpdateDebounce();
    }
  }
  // 设置文本属性
  function setTextAttr(item: IAttrItem) {
    const activeObject = activeObjectRef.value;
    const canvas = toRaw(editor.value.canvas);
    activeObject.set(item.key, item.value);
    let objects = activeObject.getObjects();
    objects.forEach((object) => {
      let sampleObjects = object.getObjects();
      sampleObjects.forEach((sample) => {
        sample.set(item.key, item.value);
      });
    });
    canvas.renderAll();
    editorPageHistoryUpdateDebounce();
  }
  watchEffect(() => {
    activeObjectRef.value = props.activeObject;
    getDefaultAttr();
  });
</script>
