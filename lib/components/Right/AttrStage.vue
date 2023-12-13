<template>
  <div class="editor-attr">
    <div class="editor-attr__title">{{ title }}</div>
    <div class="editor-attr__group">
      <div class="editor-attr__group-title">尺寸</div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <InputNumber
              v-model:value="state.width"
              @change="handleInputSize"
              :min="10"
              :max="10000"
            />
            <span class="editor-attr__field-label">宽</span>
          </div>
        </div>
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <InputNumber
              v-model:value="state.height"
              @change="handleInputSize"
              :min="10"
              :max="10000"
            />
            <span class="editor-attr__field-label">高</span>
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">预制</span>
            <Select
              placeholder="选择尺寸"
              :value="sizeActive"
              :options="sizeOptions"
              class="editor-attr__field-value"
              style="max-width: 148px"
              @change="handleSelectSize"
            />
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">自适应</span>
            <Select
              placeholder="选择自适应"
              v-model:value="state.cuFlex"
              :options="flexOptions"
              style="max-width: 148px"
              class="editor-attr__field-value"
              @change="handleChangeFlex"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="editor-attr__group">
      <div class="editor-attr__group-title">文件</div>
      <div class="editor-attr__row">
        <Select
          placeholder="输入或选择名称"
          mode="tags"
          :maxTagCount="10"
          v-model:value="state.fileNaming.content"
          :options="fileNameOptions"
          class="editor-attr__field-value"
          @change="handleChangeFileNaming"
        />
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <span class="editor-attr__field-label">类型</span>
            <Select
              placeholder="选择文件类型"
              v-model:value="state.fileNaming.fileType"
              :options="fileTypeOptions"
              style="max-width: 148px"
              class="editor-attr__field-value"
              @change="handleChangeFileNaming"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="editor-attr__group">
      <div class="editor-attr__group-title">背景</div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <NColorPicker
            :value="state.bgColor"
            :on-update:value="handleBgUpdate"
            :on-complete="handleBgComplete"
          />
          <span class="editor-attr__field-label">颜色</span>
        </div>
      </div>
      <!-- <div class="editor-attr__row">
        <div class="editor-attr__field">
          <NColorPicker v-model:value="state.bgColor" :on-update:value="handleBgUpdate" />
          <span class="editor-attr__field-label" @click="handleChangeBgImg">喷图</span>
        </div>
      </div> -->
      <div class="editor-attr__row">
        <!-- <a-button block color="success" size="large"> 替换背景图 </a-button> -->
        <ImgUpdate>
          <button class="editor__btn primary block xl"> 更换背景图 </button>
        </ImgUpdate>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorAttrStage">
  import { inject, ref, toRaw, reactive, computed, watchEffect } from 'vue';
  import { NColorPicker } from 'naive-ui';
  import { InputNumber, Select } from 'ant-design-vue';
  import ImgUpdate from '../ImgUpdate/index.vue';
  import { IEditorPage } from '../../editor/typings';

  defineProps({
    title: { type: String },
    activeObject: { type: Object },
  });

  const {
    editor,
    editorPageHistoryUpdate,
    editorPageHistoryUpdateDebounce,
    editorPage,
    editorPageId,
  } = inject<any>('editor');

  const state = reactive({
    width: 900,
    height: 1200,
    bgColor: 'rgba(255,255,255,1)',
    cuFlex: '',
    fileNaming: {
      content: [],
      fileType: 'png',
    },
  });
  const bgColor = ref();
  const sizeOptions = [
    {
      value: '900,1200',
      label: '默认',
    },
    {
      value: '2289,1325',
      label: '字样卡横版',
    },
    {
      value: '1242,1660',
      label: '字样卡竖版',
    },
    // {
    //   value: '1920,1357.58',
    //   label: 'A4横版',
    // },
    // {
    //   value: '1920,2715.4',
    //   label: 'A4竖版',
    // },
    {
      value: '794,1123',
      label: 'A4竖版打印',
    },
    {
      value: '1123,794',
      label: 'A4横版打印',
    },
    {
      value: '230,26',
      label: 'WPS小图',
    },
    {
      value: '280,74',
      label: 'WPS中图',
    },
    {
      value: '316,74',
      label: 'WPS大图',
    },
    {
      value: '290,30',
      label: 'WPS小框推荐图',
    },
    {
      value: '1000,50',
      label: 'WPS移动端字体列表图',
    },
    {
      value: '268,190',
      label: 'WPS稻壳商城云字体字体列表页',
    },
  ];
  const flexOptions = [
    {
      value: '',
      label: '不自适应',
    },
    {
      value: 'width',
      label: '宽度',
    },
    {
      value: 'height',
      label: '高度',
    },
    {
      value: 'all',
      label: '宽高',
    },
  ];
  const fileNameOptions = [
    {
      value: '${pageNum}',
      label: '页码',
    },
    {
      value: '${fontFamilyName}',
      label: '家族名',
    },
    {
      value: '${fontFamilyNameCn}',
      label: '中文名',
    },
    {
      value: '${fontFamilyNameEn}',
      label: '英文名',
    },
    {
      value: '${fontFamilyNamePinyin}',
      label: '拼音',
    },
  ];
  const fileTypeOptions = [
    {
      value: 'png',
      label: 'png',
    },
    {
      value: 'jpg',
      label: 'jpg',
    },
  ];

  const sizeActive = computed(() => {
    const currSize = sizeOptions.find((item) => item.value === `${state.width},${state.height}`);
    if (currSize) {
      return currSize.value;
    } else {
      return '';
    }
  });
  // 选择预制尺寸
  function handleSelectSize(val: string) {
    const sizeArr = val?.split(',');
    const width = Number(sizeArr[0]),
      height = Number(sizeArr[1]);
    state.width = width;
    state.height = height;
    const _editor = toRaw(editor.value);
    _editor.stage.setSize(width, height, true);
    editorPageHistoryUpdate();
  }
  // 输入宽高
  function handleInputSize() {
    const { width, height } = state;
    const _editor = toRaw(editor.value);
    _editor.stage.setSize(width, height, true);
    editorPageHistoryUpdateDebounce();
  }

  // 设置背景色
  function handleBgUpdate(value: string) {
    bgColor.value = value;
    const _editor = toRaw(editor.value);
    _editor.stage.setFill(value);
  }
  function handleBgComplete() {
    state.bgColor = bgColor.value;
    editorPageHistoryUpdate();
  }
  // 设置是否自适应画布
  function handleChangeFlex() {
    const _editor = toRaw(editor.value);
    _editor.stage.stageRect.set('cuFlex', state.cuFlex);
    editorPageHistoryUpdateDebounce();
  }
  // 设置页面文件名
  function handleChangeFileNaming() {
    const pageList = toRaw(editorPage.value);
    let currPage = pageList.find((item: IEditorPage) => item.id === editorPageId.value);
    if (currPage) {
      currPage.fileNaming = state.fileNaming;
    }
  }
  // 初始化页面文件名
  function setDefaultFileNaming() {
    const pageList = toRaw(editorPage.value);
    let currPage = pageList.find((item: IEditorPage) => item.id === editorPageId.value);
    if (currPage) {
      const fileNaming = {
        content: [],
        fileType: 'png',
        ...currPage.fileNaming,
      };

      state.fileNaming = fileNaming;
    }
  }

  // function getImageUrl(path: string) {
  //   return new URL(path, import.meta.url).href;
  // }
  // // 设置背景色
  // function handleChangeBgImg() {
  //   const url = getImageUrl(`../../editor/image/canvas-bg.png`);
  //   editor.value.stage.setFillPattern(url);
  // }
  watchEffect(() => {
    setDefaultStage();
    setDefaultFileNaming();
  });
  function setDefaultStage() {
    const stage = toRaw(editor.value?.stage?.stageRect);
    // console.log('setDefaultStage-stage', stage);
    if (stage) {
      state.width = stage.width;
      state.height = stage.height;
      state.bgColor = stage.fill;
      state.cuFlex = stage.cuFlex || '';
    }
  }
</script>
