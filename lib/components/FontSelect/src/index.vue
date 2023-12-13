<template>
  <div class="editor-font-select">
    <Popover
      v-model:visible="visible"
      trigger="click"
      placement="bottom"
      overlayClassName="editor-font-select__popup"
      :overlayStyle="{ transform: 'scale(1)', transition: 'none' }"
    >
      <template #content>
        <div class="editor-font-select__header">
          <EditorFontSelectSeach @search="handleSearch" />
        </div>
        <div class="editor-font-select__content">
          <template v-if="multiple">
            <EditorFontSelectMultiple
              ref="fontSelectMultipleRef"
              :dataList="dataList"
              :childrenKey="childrenKey"
              @reload="fetchData"
              @change="handleChange"
            />
            <EditorFontSelectResult @change="handleChange" />
          </template>
          <EditorFontSelectSingle
            :childrenKey="childrenKey"
            :dataList="dataList"
            @reload="fetchData"
            @change="handleChange"
            v-else
          />
        </div>
        <div class="editor-font-select__footer">
          <a-button size="small" @click="handleCancel">取消</a-button>
          <a-button class="ml-2" @click="handleClear" size="small" danger>清除</a-button>
          <a-button class="ml-2" type="primary" @click="handleConfirm" size="small">确定</a-button>
        </div>
      </template>

      <div
        class="editor-font-select__selector"
        :class="{
          visible: visible,
          disabled: disabled,
        }"
      >
        <span v-if="!selectItems?.length" class="editor-font-select__selector-placeholder">
          {{ placeholder }}
        </span>
        <template v-else>
          <template v-if="multiple">
            <Tag>
              {{ selectItems[0]?.fontFamilyName || selectItems[0]?.fontFamilyNameCn }}
            </Tag>
            <Tag v-if="selectItems.length > 1">+{{ selectItems.length }}</Tag>
          </template>
          <template v-else>
            <Tag>{{ selectItems[0]?.fontFamilyName || selectItems[0]?.fontFamilyNameCn }}</Tag>
          </template>
        </template>
        <DownOutlined class="editor-font-select__selector-icon" />
      </div>
    </Popover>
  </div>
</template>

<script setup lang="ts" name="EditorFontSelect">
  import { provide, ref, unref, reactive, onMounted, watchEffect } from 'vue';
  import { Popover, Tag } from 'ant-design-vue';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { FontSelectItem } from './types';
  import EditorFontSelectMultiple from './Multiple.vue';
  import EditorFontSelectSingle from './Single.vue';
  import EditorFontSelectResult from './Result.vue';
  import EditorFontSelectSeach from './Search.vue';
  // import { useFontface } from '../../../hooks/useFontface';

  // const { getFontSubsetBatch } = useFontface();
  const props = withDefaults(
    defineProps<{
      placeholder?: string;
      value?: string[];
      multiple: boolean;
      items?: FontSelectItem[];
      disabled?: boolean;
      size?: number;
      api: (...args: any[]) => Promise<any>;
      childrenKey?: string;
    }>(),
    {
      placeholder: '请选择',
      multiple: false,
      disabled: false,
      childrenKey: 'children',
    },
  );

  const emit = defineEmits(['change', 'update:value', 'clear']);
  const visible = ref<boolean>(false);
  const selectValues = ref<string[]>([]);
  const selectItems = ref<FontSelectItem[]>([]);
  const fontSelectMultipleRef = ref();
  const page = reactive({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const dataList = ref<any>([]);
  provide('selectValues', selectValues);
  provide('selectItems', selectItems);
  provide('page', page);
  let searchParams = {};

  const fetchData = async () => {
    if (!props?.api) {
      return false;
    }
    const res = await props?.api({
      current: page.current,
      size: page.pageSize,
      ...searchParams,
    });
    const fontList = res.list.map((item) => {
      item.fontGNo = item.fontGNo || item.id;
      return item;
    });
    page.total = res.total;
    dataList.value = fontList;
    // dataList.value = await getFontSubsetBatch(fontList, {
    //   text: '0123456789 ',
    // }).catch(() => {
    //   dataList.value = fontList;
    // });
    // console.log('dataList.value', dataList.value);
  };
  const handleSearch = (values: any) => {
    searchParams = values;
    page.current = 1;
    fetchData();
  };
  // 点击关闭
  const handleCancel = () => {
    visible.value = false;
  };
  // 点击确认
  const handleConfirm = () => {
    const values = unref(selectValues);
    const items = unref(selectItems);
    emit('change', values, items);
    emit('update:value', values, items);
    visible.value = false;
  };
  // 动态改变
  const handleChange = () => {
    const values = unref(selectValues);
    const items = unref(selectItems);
    emit('change', values, items);
    emit('update:value', values, items);
  };
  // 点击清除
  const handleClear = () => {
    selectItems.value = [];
    selectValues.value = [];
    emit('clear');
  };
  watchEffect(() => {
    selectItems.value = props.items || [];
    selectValues.value = props.items?.map((item) => item.fontGNo) || [];
  });
  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less">
  .editor-font-select {
    &__selector {
      width: 100%;
      box-sizing: border-box;
      margin: 0;
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5715;
      list-style: none;
      font-feature-settings: tnum;
      position: relative;
      display: inline-flex;
      cursor: pointer;
      border: 1px solid #d9d9d9;
      min-height: 32px;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      padding: 4px 30px 4px 4px;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &.visible,
      &:hover {
        border-color: @primary-color;
      }
      &.visible {
        box-shadow: 0 0 0 2px fade(@primary-color, 20%);
      }
      &-icon {
        position: absolute;
        right: 11px;
        top: 16px;
        transform: translateY(-50%);
        font-size: 12px;
        color: rgba(0, 0, 0, 0.25);
      }
      &.disabled {
        color: #00000040;
        background-color: #f5f5f5;
        cursor: not-allowed;
        opacity: 1;
        pointer-events: none;
      }
      &-placeholder {
        color: #bfbfbf;
      }
      .ant-tag:first-child {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    &__popup {
      .ant-popover-inner-content {
        padding: 0;
      }
    }
    &__header {
      padding: 10px 10px 0 10px;
    }
    &__content {
      padding: 10px;
      display: flex;
      justify-content: space-between;
      // min-width: 750px;
      max-width: 100%;
    }
    &__footer {
      text-align: center;
      padding: 10px;
    }
  }
</style>
