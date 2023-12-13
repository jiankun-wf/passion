<template>
  <div class="editor-attr">
    <div class="editor-attr__title" v-if="title">{{ title }}</div>
    <div class="editor-attr__group">
      <!-- 翻转 -->
      <div class="editor-attr__row" v-if="types.includes('flip')">
        <div class="editor-attr__col">
          <div class="editor-attr__btn" @click="handleChangeFlip('X')">
            <Icon icon="ic:baseline-flip" />
            <span>横向翻转</span>
          </div>
        </div>
        <div class="editor-attr__col">
          <div class="editor-attr__btn" @click="handleChangeFlip('Y')">
            <Icon icon="mdi:flip-vertical" />
            <span>竖向翻转</span>
          </div>
        </div>
      </div>
      <!-- 填充 -->
      <div class="editor-attr__row" v-if="types.includes('fill')">
        <div class="editor-attr__field">
          <NColorPicker
            :actions="['confirm']"
            :value="state.fill"
            :on-update:value="(value) => handleChangeSet(value, 'fill')"
          />
          <span class="editor-attr__field-label">填充</span>
        </div>
      </div>
      <!-- 透明度 -->
      <div class="editor-attr__row" v-if="types.includes('opacity')">
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
      <!-- 名称 -->
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">名称</span>
          <Input
            v-model:value="state.name"
            @change="handleChangeSet(state.name, 'name')"
            style="width: 158px"
            placeholder="组件名称"
          />
        </div>
      </div>
    </div>
    <div class="editor-attr__group">
      <div class="editor-attr__group-title">尺寸</div>
      <div class="editor-attr__row">
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <InputNumber
              :value="state.width"
              @change="handleChangeSet($event, 'width')"
              :min="1"
              :max="10000"
            />
            <span class="editor-attr__field-label">宽</span>
          </div>
        </div>
        <div class="editor-attr__col">
          <div class="editor-attr__field">
            <InputNumber
              :value="state.height"
              @change="handleChangeSet($event, 'height')"
              :min="1"
              :max="10000"
            />
            <span class="editor-attr__field-label">高</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 边框样式 -->
    <div class="editor-attr__group" v-if="types.includes('stroke')">
      <div class="editor-attr__group-title">描边</div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <NColorPicker
            :actions="['confirm']"
            :value="state.stroke"
            :on-update:value="(value) => handleChangeSet(value, 'stroke')"
          />
          <span class="editor-attr__field-label">颜色</span>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">宽度</span>
          <Slider
            class="editor-attr__field-value"
            :value="state.strokeWidth"
            :min="0"
            :max="100"
            @change="handleChangeSet($event, 'strokeWidth')"
          />
          <div class="editor-attr__field-number">
            <InputNumber
              :value="Math.floor(state.strokeWidth)"
              :min="0"
              :max="100"
              @change="handleChangeSet($event, 'strokeWidth')"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 阴影样式 -->
    <div class="editor-attr__group" v-if="types.includes('shadow')">
      <div class="editor-attr__group-title">阴影</div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <NColorPicker
            :actions="['confirm']"
            :value="state.shadow.color"
            :on-update:value="(value) => handleChangeShadow(value, 'color')"
          />
          <span class="editor-attr__field-label">颜色</span>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">模糊</span>
          <Slider
            class="editor-attr__field-value"
            :value="state.shadow.blur"
            :min="0"
            :max="100"
            @change="handleChangeShadow($event, 'blur')"
          />
          <div class="editor-attr__field-number">
            <InputNumber
              :value="Math.floor(state.shadow.blur)"
              :min="0"
              :max="100"
              @change="handleChangeShadow($event, 'blur')"
            />
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">X轴</span>
          <Slider
            class="editor-attr__field-value"
            :value="state.shadow.offsetX"
            :min="0"
            :max="100"
            @change="handleChangeShadow($event, 'offsetX')"
          />
          <div class="editor-attr__field-number">
            <InputNumber
              :value="Math.floor(state.shadow.offsetX)"
              :min="0"
              :max="100"
              @change="handleChangeShadow($event, 'offsetX')"
            />
          </div>
        </div>
      </div>
      <div class="editor-attr__row">
        <div class="editor-attr__field">
          <span class="editor-attr__field-label">Y轴</span>
          <Slider
            class="editor-attr__field-value"
            :value="state.shadow.offsetY"
            :min="0"
            :max="100"
            @change="handleChangeShadow($event, 'offsetY')"
          />
          <div class="editor-attr__field-number">
            <InputNumber
              :value="Math.floor(state.shadow.offsetY)"
              :min="0"
              :max="100"
              @change="handleChangeShadow($event, 'offsetY')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="BaseStyle">
  import { inject, ref, toRaw, reactive, watchEffect } from 'vue';
  import { NColorPicker } from 'naive-ui';
  import { Icon } from '/@/components/Icon';
  import { InputNumber, Slider, Input } from 'ant-design-vue';
  const { editor, editorPageHistoryUpdateDebounce } = inject<any>('editor');

  interface Props {
    title?: String;
    activeObject: Object;
    types?: string[];
  }
  const props = withDefaults(defineProps<Props>(), {
    types: () => ['flip', 'fill', 'opacity', 'stroke', 'shadow'],
  });

  interface IAttrItem {
    icon?: string;
    label?: string;
    key: string;
    value: any;
    checked?: boolean;
  }
  let state = reactive({
    fill: 'rgba(255,255,255,1)',
    opacity: 100,
    stroke: 'rgba(255,255,255,1)',
    strokeWidth: 0,
    name: '',
    width: 0,
    height: 0,
    shadow: {
      color: 'rgba(0,0,0,1)',
      blur: 0,
      offsetX: 0,
      offsetY: 0,
    },
  });

  const activeObjectRef = ref();

  function getDefaultAttr() {
    const activeObject = activeObjectRef.value;
    state.fill = activeObject?.get('fill');
    state.opacity = activeObject?.get('opacity') * 100;
    state.stroke = activeObject?.get('stroke');
    state.strokeWidth = activeObject?.get('strokeWidth');
    state.name = activeObject?.get('name');
    state.width = activeObject?.get('width');
    state.height = activeObject?.get('height');
    state.shadow = { ...state.shadow, ...activeObject?.get('shadow') };
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
  // 通用设置
  function handleChangeSet(value: any, key: string) {
    console.log(value);
    const params = { key, value };
    setAttr(params);
  }
  // 设置透明
  function handleChangeOpacity(value: number) {
    state.opacity = Math.floor(state.opacity);
    const params = { key: 'opacity', value: value / 100 };
    setAttr(params);
  }
  // 设置翻转
  function handleChangeFlip(value: string) {
    const activeObject = activeObjectRef.value;
    const canvas = toRaw(editor.value.canvas);
    if (activeObject) {
      activeObject.set(`flip${value}`, !activeObject[`flip${value}`]).setCoords();
      canvas.renderAll();
      editorPageHistoryUpdateDebounce();
    }
  }
  // 设置阴影
  function handleChangeShadow(value: number, key: string) {
    state.shadow[key] = value;
    const params = { key: 'shadow', value: state.shadow };
    setAttr(params);
  }
  watchEffect(() => {
    activeObjectRef.value = props.activeObject;
    getDefaultAttr();
  });
</script>
