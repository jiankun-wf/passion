<template>
  <div class="editor-attr">
    <div class="editor-attr__title">{{ title }}</div>
    <div class="editor-attr__group">
      <div class="editor-attr__row">
        <button class="editor-attr__btn" @click="handleGroup" v-if="activeType === 'multiple'">
          组合
        </button>
        <button class="editor-attr__btn" @click="handleUnGroup" v-else> 拆分 </button>
      </div>
      <!-- 透明度 -->
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
      <!-- 自定义组件 -->
      <div class="editor-attr__row" v-if="activeType === 'group'">
        <Popover title="自定义组件" trigger="click" v-model:visible="visible">
          <template #content>
            <p><Input v-model:value="state.groupName" size="small" placeholder="输入组件名" /></p>
            <p>
              <a-button @click="visible = false" size="small" class="mr-2">取消</a-button>
              <a-button type="primary" @click="handleSaveGroup" size="small">确定</a-button>
            </p>
          </template>
          <button class="editor__btn primary block xl"> 保存为组件 </button>
        </Popover>
      </div>
    </div>
    <!-- 文字设置 -->
    <div class="editor-attr__group" v-if="isAllText">
      <div class="editor-attr__group-title">文字</div>
      <div class="editor-attr__row">
        <EditorFontSelect
          v-bind="editorProps.fontProps"
          :multiple="false"
          :items="state.fontFamilyItems"
          style="width: 100%"
          @change="handleFontFamily"
          @clear="handleFontFamilyClear"
        />
      </div>
      <!-- 字号 -->
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">字号</span>
          <Slider
            class="editor-attr__field-value"
            :value="state.fontSize"
            :min="12"
            :max="1000"
            @change="handleChangeSet($event, 'fontSize')"
          />
          <div class="editor-attr__field-number">
            <InputNumber
              :value="state.fontSize"
              :min="12"
              :max="1000"
              @change="handleChangeSet($event, 'fontSize')"
            />
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <NColorPicker
            :actions="['confirm']"
            :value="state.fill"
            :on-update:value="(value) => handleChangeSet(value, 'fill')"
          />
          <span class="editor-attr__field-label">颜色</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorAttrGroup">
  import { inject, ref, reactive, toRaw, watchEffect, computed, unref } from 'vue';
  import { Popover, Input, InputNumber, Slider } from 'ant-design-vue';
  import { NColorPicker } from 'naive-ui';
  import { EditorFontSelect } from '../FontSelect';
  import { FontSelectItem } from '../FontSelect/src/types';
  import { IFontItem, IFontParams, IWebFontItem } from '../../editor/typings';
  import { useFontface } from '../../hooks/useFontface';

  const { getFontSubsetSingle } = useFontface();
  const props = defineProps({
    title: { type: String },
    activeType: { type: String },
    activeObject: { type: Object },
  });
  const { editor, editorPageHistoryUpdateDebounce, editorEleCustom, editorProps } =
    inject<any>('editor');
  const visible = ref<boolean>(false);
  const state = reactive({
    groupName: '',
    opacity: 100,
    fontSize: 12,
    fill: 'rgba(0,0,0,1)',
    font: {
      fontReplace: true,
      fontGNo: '',
      fontFamilyName: '',
      webFontUrl: '',
      fontSampleword: '',
    },
    fontFamilyName: '',
    fontFamilyItems: [] as FontSelectItem[],
  });
  interface IAttrItem {
    icon?: string;
    label?: string;
    key: string;
    value: any;
    checked?: boolean;
  }
  const activeObjectRef = ref();
  // 所选项全为文本
  const isAllText = computed(() => {
    const activeObject = activeObjectRef.value;
    let objects = activeObject.getObjects();
    const res = objects.find((object) => !['i-text', 'textbox'].includes(object.type));
    return !res;
  });
  function getDefaultAttr() {
    const activeObject = activeObjectRef.value;
    let objects = activeObject.getObjects();
    state.opacity = objects[0]?.get('opacity') * 100 || 100;
    state.fontSize = objects[0]?.get('fontSize') || 12;
    // state.fill = objects[0]?.get('fill') || 'rgba(0,0,0,1)';
  }
  // 拆分
  function handleUnGroup() {
    const _editor = toRaw(editor.value);
    _editor.unGroup();
    editorPageHistoryUpdateDebounce();
  }
  // 组合
  function handleGroup() {
    const _editor = toRaw(editor.value);
    _editor.group();
    editorPageHistoryUpdateDebounce();
  }
  //保存为组件
  function handleSaveGroup() {
    const activeObject = props.activeObject;
    if (activeObject) {
      let groupJSON = activeObject.toJSON();
      groupJSON.name = state.groupName || '组件';
      console.log('groupJSON', groupJSON);
      editorEleCustom.value.push(groupJSON);
      visible.value = false;
    }
  }
  // 设置透明
  function handleChangeOpacity(value: number) {
    state.opacity = Math.floor(state.opacity);
    const params = { key: 'opacity', value: value / 100 };
    setAttr(params);
  }
  // 通用设置
  function handleChangeSet(value: number, key: string) {
    const params = { key, value };
    setAttr(params);
  }
  // 设置字体family
  async function setFamily(params?: IFontParams) {
    const activeObject = activeObjectRef.value;
    const canvas = toRaw(editor.value.canvas);
    const fontGNo = params?.fontGNo;
    const fontFamilyName = params?.fontFamilyName;
    if (!fontGNo) return;
    let objects = activeObject.getObjects();
    const text = objects.reduce((prev, cur) => {
      return prev.text + cur.text;
    }, '');
    const res: IWebFontItem | any = await getFontSubsetSingle({ fontGNo }, { text });
    if (res) {
      objects.forEach((object) => {
        const webFontFamily = res.webFontFamily || '';
        // 输入完成如果没有点击空白失去交点，直接存储的话，切换页面不能再次选中
        object.set('selectable', true);
        object.set('hasControls', true);

        object.set('fontFamily', '');
        object.set('fontFamily', webFontFamily);
        const fontData = {
          ...state.font,
          fontFamilyName,
          fontGNo,
          webFontUrl: res.ttfPath,
          fontSampleword: res?.fontSampleword,
        };
        object.set('font', fontData);
      });

      canvas.renderAll();
      editorPageHistoryUpdateDebounce();
    }
  }
  // 选择字体
  async function handleFontFamily(_: any, items: IFontItem[]) {
    let currFont = unref(items[0]);
    if (currFont) {
      const fontGNo = currFont.fontGNo || '';
      const fontFamilyName = currFont.fontFamilyName || currFont.fontFamilyNameCn || '';
      setFamily({ fontGNo, fontFamilyName });
    }
  }
  // 取消选择所有字体
  function handleFontFamilyClear() {
    const activeObject = activeObjectRef.value;
    const canvas = toRaw(editor.value.canvas);
    let objects = activeObject.getObjects();
    objects.forEach((object) => {
      object.set('selectable', true);
      object.set('hasControls', true);

      object.set('fontFamily', '');
      const fontData = {
        ...state.font,
        fontFamilyName: '',
        fontGNo: '',
        webFontUrl: '',
        fontSampleword: '',
      };
      object.set('font', fontData);
    });
    canvas.renderAll();
    editorPageHistoryUpdateDebounce();
  }
  // 设置属性
  function setAttr(item: IAttrItem) {
    const activeObject = activeObjectRef.value;
    const canvas = toRaw(editor.value.canvas);
    activeObject.set(item.key, item.value);
    let objects = activeObject.getObjects();
    objects.forEach((object) => {
      object.set(item.key, item.value);
    });
    canvas.renderAll();
    editorPageHistoryUpdateDebounce();
  }
  watchEffect(() => {
    activeObjectRef.value = props.activeObject;
    getDefaultAttr();
  });
</script>
