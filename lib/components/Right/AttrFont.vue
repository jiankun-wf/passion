<template>
  <div class="editor-attr">
    <div class="editor-attr__title">{{ title }}</div>
    <div class="editor-attr__group">
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
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">保持字体原样</span>
          <div class="editor-attr__field-value right">
            <Switch
              checked-children="替换"
              un-checked-children="原样"
              v-model:checked="state.font.fontReplace"
              @change="handleChangeFontReplace"
            />
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">自动字号</span>
          <div class="editor-attr__field-value right">
            <Switch
              checked-children="自动"
              un-checked-children="原样"
              v-model:checked="state.cuAutoFontSize"
              @change="handleChangeAutoFontSize"
            />
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">字号</span>
          <Slider
            class="editor-attr__field-value"
            :value="state.fontSize"
            :min="6"
            :max="1000"
            @change="handleChangeFontSize($event, 'fontSize')"
          />
          <div class="editor-attr__field-number">
            <InputNumber
              :value="state.fontSize"
              :min="6"
              :max="1000"
              @change="handleChangeFontSize($event, 'fontSize')"
            />
          </div>
        </div>
      </div>
      <div class="editor-attr__group-box">
        <div
          class="editor-attr__group-box-item"
          v-for="(item, index) in baseList"
          :key="index"
          @click="handleChangeBase(item)"
        >
          <Tooltip :title="item.label">
            <Icon
              :icon="item.icon"
              size="16"
              :color="state[item.key] === item.value ? '#1890ff' : ''"
            />
          </Tooltip>
        </div>
      </div>
      <div class="editor-attr__group-box" v-if="state.type === 'textbox'">
        <div
          class="editor-attr__group-box-item"
          v-for="(item, index) in alignList"
          :key="index"
          @click="handleChangeAlign(item.value, item.key)"
        >
          <Tooltip :title="item.label">
            <Icon
              :icon="item.icon"
              size="16"
              :color="state[item.key] === item.value ? '#1890ff' : ''"
            />
          </Tooltip>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">字间距</span>
          <Slider
            class="editor-attr__field-value"
            :value="state.charSpacing"
            :min="-1000"
            :max="1000"
            @change="handleChangeCharSpacing($event)"
          />
          <div class="editor-attr__field-number">
            <InputNumber
              :value="state.charSpacing"
              :min="-1000"
              :max="1000"
              @change="handleChangeCharSpacing($event)"
            />
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">行间距</span>
          <Slider
            class="editor-attr__field-value"
            :value="state.lineHeight"
            :min="0.1"
            :max="10"
            :step="0.1"
            @change="handleChangeSet($event, 'lineHeight')"
          />
          <div class="editor-attr__field-number">
            <InputNumber
              :value="state.lineHeight"
              :min="0.1"
              :max="10"
              :step="0.1"
              @change="handleChangeSet($event, 'lineHeight')"
            />
          </div>
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
          <NColorPicker
            :value="state.fill"
            :on-update:value="handleChangeFill"
          />
          <span class="editor-attr__field-label">颜色</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorAttrFont">
import {
  inject,
  ref,
  toRaw,
  reactive,
  unref,
  watchEffect,
  onUnmounted,
  onMounted,
} from "vue";
import { NColorPicker } from "naive-ui";
import { Icon } from "/@/components/Icon";
import { Tooltip, InputNumber, Slider, Switch } from "ant-design-vue";
import { EditorFontSelect } from "../FontSelect";
// import { getFontSubsetSingle } from '../../editor/font';
import { IFontItem, IFontParams, IWebFontItem } from "../../editor/typings";
import debounce from "lodash-es/debounce";
import { FontSelectItem } from "../FontSelect/src/types";
import { useFontface } from "../../hooks/useFontface";

const { getFontSubsetSingle } = useFontface();

const { editor, editorPageHistoryUpdateDebounce, editorProps } =
  inject<any>("editor");

const props = defineProps({
  title: { type: String },
  activeObject: { type: Object },
});
interface IAttrItem {
  icon?: string;
  label?: string;
  key: string;
  value: any;
  checked?: boolean;
}
let state = reactive({
  type: "",
  fill: "#000",
  opacity: 100,
  fontSize: 0,
  fontFamily: "",
  lineHeight: 0,
  charSpacing: 0,
  fontWeight: "",
  textBackgroundColor: "#fff",
  textAlign: "",
  fontStyle: "",
  underline: false,
  linethrough: false,
  overline: false,
  cuAutoFontSize: false,
  font: {
    fontReplace: true,
    fontGNo: "",
    fontFamilyName: "",
    webFontUrl: "",
    fontSampleword: "",
  },
  fontFamilyName: "",
  fontFamilyItems: [] as FontSelectItem[],
  vertical: false,
});
// 字体属性
let baseList = ref<Array<IAttrItem>>([
  {
    icon: "ant-design:bold-outlined",
    label: "加粗",
    key: "fontWeight",
    value: "bold",
    checked: false,
  },
  {
    icon: "ant-design:italic-outlined",
    label: "斜体",
    key: "fontStyle",
    value: "italic",
    checked: false,
  },
  {
    icon: "ant-design:underline-outlined",
    label: "下划线",
    key: "underline",
    value: true,
    checked: false,
  },
  {
    icon: "ant-design:font-colors-outlined",
    label: "删除线",
    key: "linethrough",
    value: true,
    checked: false,
  },
]);
// 字体对齐
let alignList = ref<Array<IAttrItem>>([
  {
    icon: "material-symbols:format-align-left-rounded",
    label: "左对齐",
    value: "left",
    key: "textAlign",
    checked: false,
  },
  {
    icon: "material-symbols:format-align-center-rounded",
    label: "居中",
    value: "center",
    key: "textAlign",
    checked: false,
  },
  {
    icon: "material-symbols:format-align-right-rounded",
    label: "右对齐",
    value: "right",
    key: "textAlign",
    checked: false,
  },
  {
    icon: "material-symbols:format-align-justify-rounded",
    label: "两端对齐",
    value: "justify",
    key: "textAlign",
    checked: false,
  },
  {
    icon: "mdi:arrow-expand-vertical",
    label: "单字竖排",
    value: true,
    key: "vertical",
    checked: false,
  },
]);

const activeObjectRef = ref();

function getDefaultAttr() {
  const activeObject = activeObjectRef.value;
  state.type = activeObject?.get("type");
  state.fill = activeObject?.get("fill");
  state.opacity = activeObject?.get("opacity") * 100;
  state.fontSize = activeObject?.get("fontSize");
  state.fontFamily = activeObject?.get("fontFamily");
  state.lineHeight = activeObject?.get("lineHeight");
  state.textAlign = activeObject?.get("textAlign");
  state.underline = activeObject?.get("underline");
  state.linethrough = activeObject?.get("linethrough");
  state.charSpacing = activeObject?.get("charSpacing") / 10;
  state.overline = activeObject?.get("overline");
  state.fontStyle = activeObject?.get("fontStyle");
  state.textBackgroundColor = activeObject?.get("textBackgroundColor");
  state.fontWeight = activeObject?.get("fontWeight");
  state.vertical = activeObject?.get("vertical");
  state.cuAutoFontSize = activeObject?.cuAutoFontSize || false;
  state.font = { ...state.font, ...activeObject?.font };
  // activeObject.set('selectable', true);
  // activeObject.set('hasControls', true);
  if (!activeObject?.font) {
    activeObject.set("font", state.font);
  }
  // console.log('state.font', state.font, 'activeObject', activeObject?.font);
  // 初始化字体选择器
  if (state.font?.fontGNo) {
    state.fontFamilyItems = [state.font];
  }
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
// 响应设置字间距
function setSharSpacing(value?: number) {
  const fontSize = value || state.fontSize;
  // 如果当前对齐方式是两边对齐，设置字体大小对应调整字间距
  if (state.textAlign === "justify") {
    const activeObject = activeObjectRef.value;
    const charSpacing = Math.floor((fontSize * 10) / 2) || 0;
    activeObject.set("charSpacing", -charSpacing);
  }
}
// 设置通用
function handleChangeSet(value: any, key: string) {
  const params = { key, value };
  setAttr(params);
}
// 设置字号
function handleChangeFontSize(value: any, key: string) {
  const params = { key, value };
  setSharSpacing(value);
  setAttr(params);
}
// 设置对齐方式
function handleChangeAlign(value: any, key: string) {
  const params = { key, value };
  const activeObject = activeObjectRef.value;
  // 取消单字换行
  if (state.vertical) {
    const text = activeObject.text;
    activeObject.set("vertical", false);
    state.vertical = false;
    activeObject.set("width", text.length * state.fontSize * 1.5);
  }
  // 取消两端对齐空格
  if (state.textAlign === "justify") {
    const text = activeObject?.text?.replace(/\x20/g, "");
    activeObject.set("charSpacing", 0);
    activeObject.set("text", text);
  }

  switch (key) {
    case "vertical":
      handleChangeVertical();
      break;
    case "textAlign":
      if (value === "justify") {
        handleChangeJustify();
      } else {
        setAttr(params);
      }
      break;
    default:
      break;
  }
}
// 设置单行竖排
function handleChangeVertical() {
  let key = "vertical";
  let value: any = !state.vertical;
  const activeObject = activeObjectRef.value;
  activeObject.set("vertical", value);
  state[key] = value;
  activeObject.set("textAlign", "");
  state.textAlign = "";
  const text = activeObject.text;
  const params = { key, value };
  params.key = "width";
  params.value = value ? 0 : text.length * state.fontSize * 1.5;
  setAttr(params);
}
// 设置两边对齐
function handleChangeJustify() {
  const activeObject = activeObjectRef.value;
  const charSpacing = Math.floor((state.fontSize * 10) / 2) || 0;
  const text = activeObject.text
    ?.split("")
    ?.join(" ")
    ?.replace(/(\x20\n\x20)/g, "\n");
  activeObject.set("charSpacing", -charSpacing);
  activeObject.set("text", text);
  const params = { key: "textAlign", value: "justify" };
  setAttr(params);
}

// 设置基础属性
function handleChangeBase(item: IAttrItem) {
  let value: any = "";
  switch (item.key) {
    case "fontWeight":
      value = state.fontWeight === "normal" ? "bold" : "normal";
      break;
    case "fontStyle":
      value = state.fontStyle === "normal" ? "italic" : "normal";
      break;
    case "underline":
      value = !state.underline;
      break;
    case "linethrough":
      value = !state.linethrough;
      break;

    default:
      break;
  }
  state[item.key] = value;
  const params = {
    key: item.key,
    value,
  };
  setAttr(params);
}

// 设置字体family
async function setFamily(params?: IFontParams) {
  const activeObject = activeObjectRef.value;
  const canvas = toRaw(editor.value.canvas);
  // 没有选中
  if (!activeObject) return;
  const fontGNo = params?.fontGNo || activeObject?.font?.fontGNo;
  const fontFamilyName =
    params?.fontFamilyName || activeObject?.font?.fontFamilyName;
  const text = activeObject.text;
  // console.log('fontFamilyName', fontFamilyName);
  // 没有选择字体
  if (!fontGNo) return;
  const res: IWebFontItem | any = await getFontSubsetSingle(
    { fontGNo },
    { text }
  );
  if (res && activeObject) {
    const webFontFamily = res.webFontFamily || "";
    // 输入完成如果没有点击空白失去交点，直接存储的话，切换页面不能再次选中
    activeObject.set("selectable", true);
    activeObject.set("hasControls", true);

    activeObject.set("fontFamily", "");
    activeObject.set("fontFamily", webFontFamily);
    const fontData = {
      ...state.font,
      fontFamilyName,
      fontGNo,
      webFontUrl: res.ttfPath,
      fontSampleword: res?.fontSampleword,
    };
    activeObject.set("font", fontData);

    canvas.renderAll();
    editorPageHistoryUpdateDebounce();
  }
}
// 选择字体
async function handleFontFamily(_: any, items: IFontItem[]) {
  let currFont = unref(items[0]);
  if (currFont) {
    const fontGNo = currFont.fontGNo || "";
    const fontFamilyName =
      currFont.fontFamilyName || currFont.fontFamilyNameCn || "";
    setFamily({ fontGNo, fontFamilyName });
  }
}
// 取消选择所有字体
function handleFontFamilyClear() {
  const activeObject = activeObjectRef.value;
  const canvas = toRaw(editor.value.canvas);
  // 没有选中
  if (!activeObject) return;
  activeObject.set("selectable", true);
  activeObject.set("hasControls", true);

  activeObject.set("fontFamily", "");
  const fontData = {
    ...state.font,
    fontFamilyName: "",
    fontGNo: "",
    webFontUrl: "",
    fontSampleword: "",
  };
  activeObject.set("font", fontData);

  canvas.renderAll();
  editorPageHistoryUpdateDebounce();
}
// 文字改变
const textChange = debounce(function () {
  setFamily();
}, 1000);
// 输入框改变
function handleTextChange() {
  const activeObject = activeObjectRef.value;
  const canvas = toRaw(editor.value.canvas);
  // 没有选中
  if (!activeObject) return;
  activeObject.set("styles", []);
  canvas.renderAll();
  textChange();
}
// 设置是否替换字体
function handleChangeFontReplace(checked: boolean) {
  state.font = { ...state.font, fontReplace: checked };
  const activeObject = activeObjectRef.value;
  if (!activeObject) return;
  activeObject.set("font", state.font);
  editorPageHistoryUpdateDebounce();
}
// 设置自动字号
function handleChangeAutoFontSize(value: string) {
  const params = { key: "cuAutoFontSize", value };
  setAttr(params);
}
// 设置背景色
function handleChangeFill(value: string) {
  const params = { key: "fill", value };
  setAttr(params);
}
// 设置透明
function handleChangeOpacity(value: number) {
  state.opacity = Math.floor(state.opacity);
  const params = { key: "opacity", value: value / 100 };
  setAttr(params);
}
// 设置字间距
function handleChangeCharSpacing(value: number) {
  const params = { key: "charSpacing", value: value * 10 };
  setAttr(params);
}
// 初始化事件
function initEvent() {
  destroyEvent();
  const activeObject = activeObjectRef.value;
  if (activeObject) {
    activeObject.on("changed", handleTextChange);
  }
}
// 销毁事件
function destroyEvent() {
  const activeObject = activeObjectRef.value;
  if (activeObject) {
    activeObject.off("changed", handleTextChange);
  }
}
watchEffect(() => {
  destroyEvent();
  activeObjectRef.value = props.activeObject;
  initEvent();
  getDefaultAttr();
});
onUnmounted(() => {
  destroyEvent();
});
onMounted(() => {
  initEvent();
});
</script>

<style lang="less" scoped>
.editor-attr {
  &-title {
    align-items: center;
    color: #000;
    display: flex;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    margin-bottom: 10px;
  }
  &-card {
    background: #f7f7f7;
    border-radius: 10px;
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    margin-bottom: 10px;
  }
  &-item {
    cursor: pointer;
  }
}
</style>
