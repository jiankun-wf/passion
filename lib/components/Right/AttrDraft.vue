<template>
  <div class="editor-attr">
    <div class="editor-attr__title">{{ title }}</div>
    <div class="editor-attr__group">
      <div class="editor-attr__group-title">表格</div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <InputNumber
              v-model:value="state.custom.row"
              @change="handleInputSize"
              :min="1"
              :max="100"
            />
            <span class="editor-attr__field-label">行</span>
          </div>
        </div>
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <InputNumber
              v-model:value="state.custom.col"
              @change="handleInputSize"
              :min="1"
              :max="100"
            />
            <span class="editor-attr__field-label">列</span>
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">表格自适应</span>
            <Select
              placeholder="选择适应方式"
              :options="autoOptions"
              class="editor-attr__field-value"
              style="flex: 1"
              v-model:value="state.autoActive"
              @change="handleSelectSize"
            />
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">预制单元格</span>
            <Select
              placeholder="选择尺寸"
              :options="sizeOptions"
              class="editor-attr__field-value"
              style="flex: 1"
              v-model:value="state.sizeActive"
              @change="handleSelectSize"
            />
          </div>
        </div>
      </div>
      <!-- 刻度 -->
      <div class="editor-attr__group-title">单元格（刻度）</div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">宽度</span>
            <InputNumber
              v-model:value="state.custom.cellLine.width"
              @change="handleCellSize"
              :min="0"
              :max="10000"
            />
            <span class="editor-attr__field-label">mm</span>
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">粗细</span>
            <InputNumber
              v-model:value="state.custom.cellLine.height"
              @change="handleCellSize"
              :min="0"
              :max="10000"
            />
            <span class="editor-attr__field-label">mm</span>
          </div>
        </div>
      </div>
      <!-- 外边框 -->
      <div class="editor-attr__group-title">单元格（外框）</div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">宽度</span>
            <InputNumber
              v-model:value="state.custom.cellOut.width"
              @change="handleCellSize"
              :min="0"
              :max="10000"
            />
            <span class="editor-attr__field-label">mm</span>
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">线宽</span>
            <InputNumber
              v-model:value="state.custom.cellOut.strokeWidth"
              @change="handleCellSize"
              :min="0"
              :max="10000"
            />
            <span class="editor-attr__field-label">mm</span>
          </div>
        </div>
      </div>
      <!-- 内边框 -->
      <div class="editor-attr__group-title">单元格（内框）</div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">宽度</span>
            <InputNumber
              v-model:value="state.custom.cellInner.width"
              @change="handleCellSize"
              :min="0"
              :max="10000"
            />
            <span class="editor-attr__field-label">mm</span>
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">线宽</span>
            <InputNumber
              v-model:value="state.custom.cellInner.strokeWidth"
              @change="handleCellSize"
              :min="0"
              :max="10000"
            />
            <span class="editor-attr__field-label">mm</span>
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <NColorPicker v-model:value="state.custom.cellInner.fill" @complete="handleCellSize" />
          <span class="editor-attr__field-label">颜色</span>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">字号</span>
          <InputNumber
            v-model:value="state.custom.cellInner.fontSize"
            @change="handleCellSize"
            :min="0"
            :max="state.custom.cellInner.width"
          />
          <span class="editor-attr__field-label">mm</span>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">参数</span>
          <Select
            placeholder="请选择字体参数"
            :options="TextOptions"
            :allowClear="true"
            style="flex: 1"
            v-model:value="state.custom.cellInner.arg"
            @change="handleCellSize"
          />
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">字体</span>
          <EditorFontSelect
            v-bind="editorProps.fontProps"
            :multiple="false"
            placeholder="请选择字体"
            :items="state.fontFamilyItems"
            style="flex: 1; text-align: center"
            @change="handleFontFamily"
            @clear="handleFontFamilyClear"
          />
        </div>
      </div>
      <!-- 上边框 -->
      <div class="editor-attr__group-title">单元格（上框）</div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">高度</span>
            <InputNumber
              v-model:value="state.custom.cellTop.height"
              @change="handleCellSize"
              :min="0"
              :max="100"
            />
            <span class="editor-attr__field-label">mm</span>
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">线宽</span>
            <InputNumber
              v-model:value="state.custom.cellTop.strokeWidth"
              @change="handleCellSize"
              :min="0"
              :max="100"
            />
            <span class="editor-attr__field-label">mm</span>
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <NColorPicker v-model:value="state.custom.cellTop.fill" @complete="handleCellSize" />
          <span class="editor-attr__field-label">颜色</span>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">字号</span>
          <InputNumber
            v-model:value="state.custom.cellTop.fontSize"
            @change="handleCellSize"
            :min="0"
            :max="state.custom.cellTop.height"
          />
          <span class="editor-attr__field-label">mm</span>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <Select
            placeholder="请选择字体参数"
            :options="TextOptions"
            :allowClear="true"
            style="flex: 1"
            v-model:value="state.custom.cellTop.arg"
            @change="handleCellSize"
          />
          <span class="editor-attr__field-label">参数</span>
        </div>
      </div>
      <!-- 下边框 -->
      <div class="editor-attr__group-title">单元格（下框）</div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">高度</span>
            <InputNumber
              v-model:value="state.custom.cellBottom.height"
              @change="handleCellSize"
              :min="0"
              :max="100"
            />
            <span class="editor-attr__field-label">mm</span>
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">线宽</span>
            <InputNumber
              v-model:value="state.custom.cellBottom.strokeWidth"
              @change="handleCellSize"
              :min="0"
              :max="100"
            />
            <span class="editor-attr__field-label">mm</span>
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <NColorPicker v-model:value="state.custom.cellBottom.fill" @complete="handleCellSize" />
          <span class="editor-attr__field-label">颜色</span>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">字号</span>
          <InputNumber
            v-model:value="state.custom.cellBottom.fontSize"
            @change="handleCellSize"
            :min="0"
            :max="state.custom.cellBottom.height"
          />
          <span class="editor-attr__field-label">mm</span>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <Select
            placeholder="请选择字体参数"
            :options="TextOptions"
            :allowClear="true"
            style="flex: 1"
            v-model:value="state.custom.cellBottom.arg"
            @change="handleCellSize"
          />
          <span class="editor-attr__field-label">参数</span>
        </div>
      </div>
      <!-- 左边框 -->
      <div class="editor-attr__group-title">单元格（左框）</div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">宽度</span>
            <InputNumber
              v-model:value="state.custom.cellLeft.width"
              @change="handleCellSize"
              :min="0"
              :max="100"
            />
            <span class="editor-attr__field-label">mm</span>
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">线宽</span>
            <InputNumber
              v-model:value="state.custom.cellLeft.strokeWidth"
              @change="handleCellSize"
              :min="0"
              :max="100"
            />
            <span class="editor-attr__field-label">mm</span>
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <NColorPicker v-model:value="state.custom.cellLeft.fill" @complete="handleCellSize" />
          <span class="editor-attr__field-label">颜色</span>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">字号</span>
          <InputNumber
            v-model:value="state.custom.cellLeft.fontSize"
            @change="handleCellSize"
            :min="0"
            :max="state.custom.cellLeft.width"
          />
          <span class="editor-attr__field-label">mm</span>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <Select
            placeholder="请选择字体参数"
            :options="TextOptions"
            :allowClear="true"
            style="flex: 1"
            v-model:value="state.custom.cellLeft.arg"
            @change="handleCellSize"
          />
          <span class="editor-attr__field-label">参数</span>
        </div>
      </div>
      <!-- 右边框 -->
      <div class="editor-attr__group-title">单元格（右框）</div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">宽度</span>
            <InputNumber
              v-model:value="state.custom.cellRight.width"
              @change="handleCellSize"
              :min="0"
              :max="100"
            />
            <span class="editor-attr__field-label">mm</span>
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">线宽</span>
            <InputNumber
              v-model:value="state.custom.cellRight.strokeWidth"
              @change="handleCellSize"
              :min="0"
              :max="100"
            />
            <span class="editor-attr__field-label">mm</span>
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <NColorPicker v-model:value="state.custom.cellRight.fill" @complete="handleCellSize" />
          <span class="editor-attr__field-label">颜色</span>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">字号</span>
          <InputNumber
            v-model:value="state.custom.cellRight.fontSize"
            @change="handleCellSize"
            :min="0"
            :max="state.custom.cellRight.width"
          />
          <span class="editor-attr__field-label">mm</span>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <Select
            placeholder="请选择字体参数"
            :options="TextOptions"
            :allowClear="true"
            style="flex: 1"
            v-model:value="state.custom.cellRight.arg"
            @change="handleCellSize"
          />
          <span class="editor-attr__field-label">参数</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorAttrSample">
  import { inject, ref, toRaw, reactive, watchEffect, onMounted, unref } from 'vue';
  import { IFontItem, IWebFontItem } from '../../editor/typings';
  import { EditorFontSelect } from '../FontSelect';
  import { FontSelectItem } from '../FontSelect/src/types';
  import { useFontface } from '../../hooks/useFontface';
  import { InputNumber, Select } from 'ant-design-vue';
  import { NColorPicker } from 'naive-ui';
  import { sizeConfig } from '../data/draff-config';

  const { getFontSubsetSingle } = useFontface();
  const props = defineProps({
    title: { type: String },
    activeType: { type: String },
    activeObject: { type: Object },
  });
  const { editor, editorPageHistoryUpdateDebounce, editorProps } = inject<any>('editor');
  const state = reactive({
    groupName: '',
    fontFamilyItems: [] as FontSelectItem[],
    font: {
      fontReplace: true,
      fontGNo: '',
      fontFamilyName: '',
      webFontUrl: '',
      fontSampleword: '',
    },
    custom: {
      row: 1,
      col: 2,
      ...sizeConfig['4cm'],
    },
    opacity: 100,
    sizeActive: '4cm',
    autoActive: 'fixed',
  });
  const activeObjectRef = ref();

  const autoOptions = [
    {
      value: 'fit',
      label: '自适应画布',
    },
    {
      value: 'fixed',
      label: '固定尺寸',
    },
  ];
  const TextOptions = [
    {
      value: '${n}',
      label: '单元格标题',
    },
    {
      value: '${x}',
      label: '单元格样例',
    },
  ];

  const sizeOptions = [
    {
      label: '1.7厘米',
      value: '1.7cm',
    },
    {
      label: '2.5厘米',
      value: '2.5cm',
    },
    {
      label: '4厘米',
      value: '4cm',
    },
    {
      label: '6厘米',
      value: '6cm',
    },
    {
      label: '8厘米',
      value: '8cm',
    },
    {
      label: '9厘米',
      value: '9cm',
    },
    {
      label: '14厘米',
      value: '14cm',
    },
  ];

  // 选择预制尺寸
  function handleSelectSize(val: string) {
    const data = sizeConfig[val];
    state.custom = { ...state.custom, ...data };
    setCell();
  }

  // function cmToPx(cm: number, dpi?: number) {
  //   dpi = dpi || 96;
  //   return cm * (dpi / 2.54);
  // }
  function mmToPx(mm: number, dpi?: number) {
    dpi = dpi || 96;
    return (mm / 10) * (dpi / 2.54);
  }
  // function pxToMm(px: number, dpi?: number) {
  //   dpi = dpi || 96;
  //   return Math.round(((px * 10) / dpi) * 2.54);
  // }

  function getDefaultAttr() {
    const activeObject = activeObjectRef.value;
    state.opacity = activeObject?.get('opacity') * 100;
    // state.fill = activeObject?.get('fill');
    state.custom = { ...state.custom, ...activeObject?.custom };
    let { cellInner, cellOut, cellTop, cellBottom, cellLeft, cellRight } = state.custom;
    let objects = activeObject.getObjects();
    let fontList: any[] = [];
    objects.forEach((object) => {
      if (Reflect.has(object, 'getObjects')) {
        let cellObjects = object?.getObjects();
        cellObjects.forEach((obj) => {
          if (['i-text', 'textbox'].includes(obj.type)) {
            const arg = obj?.template?.data ? obj?.template?.data[0]?.value : null;
            if (obj.id === 'text-n-top') {
              cellTop.arg = arg;
            }
            if (obj.id === 'text-n-bottom') {
              cellBottom.arg = arg;
            }
            if (obj.id === 'text-n-left') {
              cellLeft.arg = arg;
            }
            if (obj.id === 'text-n-right') {
              cellRight.arg = arg;
            }
            if (obj.id === 'text-x') {
              cellInner.arg = arg;
              obj.set('width', mmToPx(cellOut.width + cellOut.strokeWidth));
            }
            const font = obj?.font;
            if (font?.fontGNo) {
              fontList.push(font);
            }
          }
        });
      }
    });
    if (fontList?.length) {
      state.fontFamilyItems = fontList;
    }
  }
  // 选择字体
  async function handleFontFamily(_: any, items: IFontItem[]) {
    let font = unref(items[0]);
    if (font) {
      const fontGNo = font?.fontGNo || '';
      const fontFamilyName = font?.fontFamilyName || font?.fontFamilyNameCn;
      const fontSampleword = font?.fontSampleword || fontFamilyName;
      const text = '样';

      const res: IWebFontItem | any = await getFontSubsetSingle({ fontGNo }, { text });
      if (res) {
        const webFontFamily = res.webFontFamily || '';
        const fontData = {
          fontFamilyName: fontFamilyName,
          fontGNo: font?.fontGNo,
          webFontUrl: font?.ttfPath,
          fontSampleword: fontSampleword,
          webFontFamily: webFontFamily,
        };
        setTextFamily(fontData);
      }
    }
  }
  // 取消选择所有字体
  function handleFontFamilyClear() {
    const activeObject = activeObjectRef.value;
    // 没有选中
    if (!activeObject) return;
    activeObject.set('selectable', true);
    activeObject.set('hasControls', true);

    const fontData = {
      ...state.font,
      fontFamilyName: '',
      fontGNo: '',
      webFontUrl: '',
      fontSampleword: '',
      webFontFamily: '',
    };
    setTextFamily(fontData);
  }

  function handleInputSize() {
    setTable();
  }
  // 设置单元格元素宽度
  function handleCellSize(val: number) {
    // 防止canvas报错
    if (val.toString() === '0.') return;
    setCell();
  }
  // 设置文本模板参数
  function setTextTemplate(obj: any, value: string) {
    if (!value) return;
    const params = {
      data: [
        {
          key: 'text',
          value,
          language: 'void',
        },
      ],
    };
    obj.set('template', params);
  }
  function setVisible(obj: any, value: number) {
    if (value) {
      obj.set('opacity', 1);
      obj.set('visible', true);
    } else {
      obj.set('opacity', 0);
      obj.set('visible', false);
    }
  }
  // 设置单元格宽度
  async function setTable() {
    const activeObject = activeObjectRef.value;
    const canvas = toRaw(editor.value.canvas);
    state.custom = { ...state.custom };
    // let { row, col, cellCmW, cellRate } = state.custom;
    let { row, col } = state.custom;
    let objects = activeObject.getObjects();
    let tableBg = objects[0];
    let sample = objects[objects.length - 1];
    let cellW = sample.width;
    let cellH = sample.height;
    let tableW = col * cellW;
    let tableH = row * cellH;
    sample.set('left', -tableW / 2);
    sample.set('top', -tableH / 2);
    tableBg.set('width', tableW);
    tableBg.set('height', tableH);
    tableBg.set('left', -tableW / 2);
    tableBg.set('top', -tableH / 2);
    activeObject.set('width', tableW);
    activeObject.set('height', tableH);
    activeObject.set('custom', state.custom);

    objects.forEach((object) => {
      if (object.type === 'draft-cell') {
        activeObject.remove(object);
      }
    });
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        await sample?.clone(
          (cloned: any) => {
            if (cloned.left === undefined || cloned.top === undefined) return;
            const gridT = cellH * i;
            const gridL = cellW * j;
            cloned.set({
              left: cloned.left + gridL,
              top: cloned.top + gridT,
              name: activeObject.name,
            });

            activeObject.add(cloned);
          },
          ['id', 'name', 'template', 'font'],
        );
      }
    }
    // 指定单元格尺寸
    // let maxW = (cmToPx(cellCmW) / cellRate) * col;
    // let wRatio = maxW / tableW;
    // activeObject.set('scaleX', wRatio);
    // activeObject.set('scaleY', wRatio);
    // 自适应宽度
    if (state.autoActive === 'fit') {
      const padding = 0;
      const stageW = canvas.clipPath?.width - padding;
      const stageH = canvas.clipPath?.height - padding;
      if (tableW > stageW || tableH > stageH) {
        let wRatio = stageW / tableW;
        let hRatio = stageH / tableH;
        let fitRatio = hRatio < wRatio ? hRatio : wRatio;
        activeObject.set('scaleX', fitRatio);
        activeObject.set('scaleY', fitRatio);
        canvas.viewportCenterObject(activeObject);
      }
    }

    canvas.renderAll();
    editorPageHistoryUpdateDebounce();
  }

  function setCell() {
    const { cellInner, cellOut, cellLine, cellTop, cellBottom, cellLeft, cellRight } = state.custom;
    const activeObject = activeObjectRef.value;
    // const canvas = toRaw(editor.value.canvas);
    // 边框总宽度
    const cellWidthStroke = cellLeft.strokeWidth + cellRight.strokeWidth;
    // 边框总高度
    const cellHeigthStroke = cellTop.strokeWidth + cellBottom.strokeWidth;
    // 单元格宽
    const cellWidth = cellOut.width + cellLeft.width + cellRight.width + cellWidthStroke;
    // 单元格高
    const cellHeight = cellOut.width + cellTop.height + cellBottom.height + cellHeigthStroke;
    // 上边距
    const marginTop = cellTop.strokeWidth;
    const marginLeft = cellLeft.strokeWidth;
    // let tableW = mmToPx(col * cellWidth + cellOut.strokeWidth);
    // let tableH = mmToPx(row * cellHeight + cellOut.strokeWidth);
    // activeObject.set('width', tableW);
    // activeObject.set('height', tableH);
    let objects = activeObject.getObjects();
    objects.forEach((object) => {
      if (Reflect.has(object, 'getObjects')) {
        object.set('width', mmToPx(cellWidth));
        // 上下框需要与外框线重叠，因此要减去这个高度
        const adjustH = cellTop.height + cellBottom.height === 0 ? 0 : cellOut.strokeWidth;
        object.set('height', mmToPx(cellHeight - adjustH));
        object.set('top', -mmToPx(cellHeight / 2));

        let cellObjects = object?.getObjects();
        cellObjects.forEach((obj) => {
          let padding = mmToPx(
            (cellOut.width - cellInner.width - cellInner.strokeWidth - cellOut.strokeWidth) / 2 +
              cellOut.strokeWidth,
          );
          switch (obj.id) {
            case 'cell-out':
              obj.set('width', mmToPx(cellOut.width));
              obj.set('height', mmToPx(cellOut.width));
              obj.set('strokeWidth', mmToPx(cellOut.strokeWidth));
              // obj.set('stroke', 'rgba(255,0,0,1)');
              obj.set('top', -mmToPx(cellHeight / 2 - cellTop.height) + mmToPx(marginTop));
              obj.set('left', -mmToPx(cellWidth / 2 - cellLeft.width) + mmToPx(marginLeft));
              break;
            case 'cell-inner':
              obj.set('width', mmToPx(cellInner.width));
              obj.set('height', mmToPx(cellInner.width));
              obj.set('strokeWidth', mmToPx(cellInner.strokeWidth));
              // obj.set('stroke', 'rgba(0,255,0,1)');
              obj.set(
                'top',
                -mmToPx(cellHeight / 2 - cellTop.height) + mmToPx(marginTop) + padding,
              );
              obj.set(
                'left',
                -mmToPx(cellWidth / 2 - cellLeft.width) + mmToPx(marginLeft) + padding,
              );
              break;
            // 文字{样}
            case 'text-x':
              let fontSizeX = cellInner.fontSize || cellInner.width / 2;
              // obj.set('backgroundColor', 'rgba(127,255,0,0.2)');
              obj.set('width', mmToPx(cellOut.width + cellOut.strokeWidth));
              obj.set('fontSize', mmToPx(fontSizeX));
              obj.set('fill', cellInner.fill);
              setTextTemplate(obj, cellInner.arg);
              obj.set(
                'top',
                -mmToPx(cellHeight / 2 - cellTop.height) +
                  mmToPx(marginTop) +
                  padding +
                  mmToPx((cellInner.width - fontSizeX) / 2),
              );
              obj.set('left', -mmToPx(cellWidth / 2 - cellLeft.width - cellLeft.strokeWidth));
              obj.set('opacity', 1);
              obj.set('font', state.font);
              break;
            // 刻度线左
            case 'cell-line-left':
              obj.set('width', mmToPx(cellLine.width));
              obj.set('height', mmToPx(cellLine.height));
              obj.set(
                'top',
                -mmToPx(cellHeight / 2 - cellTop.height) +
                  mmToPx(marginTop) +
                  mmToPx((cellOut.width - cellLine.height) / 2),
              );
              obj.set(
                'left',
                -mmToPx(
                  cellWidth / 2 - cellOut.strokeWidth - cellLeft.width - cellLeft.strokeWidth,
                ),
              );
              // obj.set('fill', 'rgba(255,0,255,1)');
              break;
            // 刻度线右
            case 'cell-line-right':
              obj.set('width', mmToPx(cellLine.width));
              obj.set('height', mmToPx(cellLine.height));
              obj.set(
                'top',
                -mmToPx(cellHeight / 2 - cellTop.height) +
                  mmToPx(marginTop) +
                  mmToPx((cellOut.width - cellLine.height) / 2),
              );
              obj.set(
                'left',
                mmToPx(cellWidth / 2 - cellLine.width - cellRight.width - cellRight.strokeWidth),
              );
              // obj.set('fill', 'rgba(255,0,255,1)');
              break;
            case 'cell-top':
              if (cellTop.height === 0) cellTop.strokeWidth = 0;
              obj.set('width', mmToPx(cellOut.width + cellOut.strokeWidth - cellTop.strokeWidth));
              obj.set('height', mmToPx(cellTop.height));
              obj.set('strokeWidth', mmToPx(cellTop.strokeWidth));
              // obj.set('stroke', 'rgba(0,0,255,1)');
              // obj.set('fill', 'rgba(255,255,255,1)');
              obj.set('top', -mmToPx(cellHeight / 2) + mmToPx(cellOut.strokeWidth));
              obj.set('left', -mmToPx(cellWidth / 2 - cellLeft.width) + mmToPx(marginLeft));
              break;
            case 'cell-bottom':
              if (cellBottom.height === 0) cellBottom.strokeWidth = 0;
              obj.set(
                'width',
                mmToPx(cellOut.width + cellOut.strokeWidth - cellBottom.strokeWidth),
              );
              obj.set('height', mmToPx(cellBottom.height));
              obj.set('strokeWidth', mmToPx(cellBottom.strokeWidth));
              // obj.set('stroke', 'rgba(0,0,255,1)');
              // obj.set('fill', 'rgba(255,255,255,1)');
              obj.set(
                'top',
                mmToPx(cellHeight / 2 - cellBottom.height) - mmToPx(cellBottom.strokeWidth),
              );
              obj.set('left', -mmToPx(cellWidth / 2 - cellLeft.width) + mmToPx(marginLeft));
              break;
            case 'cell-left':
              if (cellLeft.width === 0) cellLeft.strokeWidth = 0;
              obj.set('width', mmToPx(cellLeft.width));
              obj.set('height', mmToPx(cellOut.width + cellOut.strokeWidth - cellLeft.strokeWidth));
              obj.set('strokeWidth', mmToPx(cellLeft.strokeWidth));
              // obj.set('stroke', 'rgba(0,0,255,1)');
              // obj.set('fill', 'rgba(255,255,255,1)');
              obj.set('top', -mmToPx(cellHeight / 2 - cellTop.height) + mmToPx(marginTop));
              obj.set('left', -mmToPx(cellWidth / 2) + mmToPx(cellOut.strokeWidth));
              break;
            case 'cell-right':
              if (cellRight.width === 0) cellRight.strokeWidth = 0;
              obj.set('width', mmToPx(cellRight.width));
              obj.set(
                'height',
                mmToPx(cellOut.width + cellOut.strokeWidth - cellRight.strokeWidth),
              );
              obj.set('strokeWidth', mmToPx(cellRight.strokeWidth));
              // obj.set('stroke', 'rgba(0,0,255,1)');
              // obj.set('fill', 'rgba(255,255,255,1)');
              obj.set('top', -mmToPx(cellHeight / 2 - cellTop.height) + mmToPx(marginTop));
              obj.set(
                'left',
                mmToPx(cellWidth / 2 - cellRight.width) - mmToPx(cellRight.strokeWidth),
              );
              break;
            // 文字-上
            case 'text-n-top':
              let fontSizeT = cellTop.fontSize || cellTop.height / 2;
              obj.set('width', mmToPx(cellOut.width + cellOut.strokeWidth));
              obj.set('fontSize', mmToPx(fontSizeT));
              obj.set('text', '字');
              obj.set('fill', cellTop.fill);
              setTextTemplate(obj, cellTop.arg);
              obj.set(
                'top',
                -mmToPx(cellHeight / 2) +
                  mmToPx(
                    (cellTop.height - fontSizeT + cellTop.strokeWidth + cellOut.strokeWidth) / 2,
                  ),
              );
              obj.set('left', -mmToPx(cellWidth / 2 - cellLeft.width));
              setVisible(obj, fontSizeT);
              break;
            // 文字-下
            case 'text-n-bottom':
              let fontSizeB = cellBottom.fontSize || cellBottom.height / 2;
              obj.set('width', mmToPx(cellOut.width + cellOut.strokeWidth));
              obj.set('fontSize', mmToPx(fontSizeB));
              obj.set('text', '字');
              obj.set('fill', cellBottom.fill);
              setTextTemplate(obj, cellBottom.arg);
              obj.set(
                'top',
                mmToPx(cellHeight / 2 - cellBottom.height) +
                  mmToPx((cellBottom.height - fontSizeB + cellBottom.strokeWidth) / 2) -
                  mmToPx(cellBottom.strokeWidth),
              );
              obj.set('left', -mmToPx(cellWidth / 2 - cellLeft.width));
              setVisible(obj, fontSizeB);
              break;
            // 文字-左
            case 'text-n-left':
              let fontSizeL = cellLeft.fontSize || cellLeft.width / 2;
              obj.set('fontSize', mmToPx(fontSizeL));
              obj.set('width', mmToPx(cellLeft.width + cellLeft.strokeWidth));
              obj.set('text', '字');
              obj.set('text', '字');
              obj.set('fill', cellLeft.fill);
              setTextTemplate(obj, cellLeft.arg);
              // obj.set('backgroundColor', 'rgba(255,0,0,1)');
              obj.set(
                'top',
                -mmToPx(cellHeight / 2 - cellTop.height) +
                  mmToPx(marginTop) +
                  mmToPx((cellOut.width + cellOut.strokeWidth - fontSizeL) / 2),
              );
              obj.set('left', -mmToPx(cellWidth / 2) + mmToPx(cellOut.strokeWidth));
              setVisible(obj, fontSizeL);
              break;
            // 文字-右
            case 'text-n-right':
              let fontSizeR = cellRight.fontSize || cellRight.width / 2;
              obj.set('fontSize', mmToPx(fontSizeR));
              obj.set('width', mmToPx(cellLeft.width));
              obj.set('text', '字');
              obj.set('fill', cellRight.fill);
              setTextTemplate(obj, cellRight.arg);
              obj.set(
                'top',
                -mmToPx(cellHeight / 2 - cellTop.height) +
                  mmToPx(marginTop) +
                  mmToPx((cellOut.width + cellOut.strokeWidth - fontSizeR) / 2),
              );
              obj.set('left', mmToPx(cellWidth / 2 - cellRight.width));
              setVisible(obj, fontSizeR);
              break;
            default:
              break;
          }
        });
      }
    });

    setTable();
    // canvas.renderAll();
    // editorPageHistoryUpdateDebounce();
  }
  // 设置
  function setTextFamily(params: any) {
    const activeObject = activeObjectRef.value;
    const canvas = toRaw(editor.value.canvas);
    let objects = activeObject.getObjects();
    objects.forEach((object) => {
      if (Reflect.has(object, 'getObjects')) {
        let cellObjects = object?.getObjects();
        cellObjects.forEach((obj) => {
          if (['i-text', 'textbox'].includes(obj.type) && obj.id === 'text-x') {
            obj.set('fontFamily', '');
            obj.set('fontFamily', params.webFontFamily);
            obj.set('font', params);
          }
        });
      }
    });
    canvas.renderAll();
    editorPageHistoryUpdateDebounce();
  }

  watchEffect(() => {
    activeObjectRef.value = props.activeObject;
    getDefaultAttr();
  });
  onMounted(() => {
    setCell();
  });
</script>
<style lang="less" scoped>
  .editor-attr__group-title {
    color: #1474fc;
  }
</style>
