<template>
  <div class="editor-font-select-single">
    <div class="editor-font-select-single__header">
      共{{ page.total }}项
      <span class="num"> 已选择{{ selectValues?.length || 0 }}项 </span>
    </div>
    <div class="editor-font-select-single__body">
      <div
        class="editor-font-select-single__item"
        v-for="(item, index) in dataList"
        :key="index"
        :class="{ fold: item.fold }"
      >
        <div class="editor-font-select-single__group" :class="{ checked: item.checked }">
          <span class="editor-font-select-single__group-ico">
            <CaretDownOutlined
              class="ico-fold"
              v-if="item.familyGrouped"
              @click="item.fold = !item.fold"
            />
          </span>

          <span v-if="item.familyGrouped" @click="item.fold = !item.fold">
            {{ item.fontFamilyName || item.fontFamilyNameCn }}
            <span>- 字体家族</span>
          </span>

          <span v-else @click="handleChangeChild(item)">
            {{ item.fontFamilyName || item.fontFamilyNameCn }}
          </span>
        </div>

        <div v-if="item[childrenKey]">
          <div
            class="editor-font-select-single__child"
            :name="item.fontGNo"
            v-for="(itemC, indexC) in item[childrenKey]"
            :key="indexC"
            :class="{ checked: itemC.checked }"
            @click="handleChangeChild(itemC)"
          >
            {{ itemC.fontFamilyName || itemC.fontFamilyNameCn }}
          </div>
        </div>
      </div>
    </div>
    <div class="editor-font-select-single__footer">
      <Pagination
        v-model:current="page.current"
        :total="page.total"
        :page-size="page.pageSize"
        @change="handlePageChange"
        size="small"
      />
    </div>
  </div>
</template>

<script lang="ts" setup name="EditorFontSelectList">
  import { inject, unref, watchEffect } from 'vue';
  import { Pagination, PaginationProps } from 'ant-design-vue';
  import { CaretDownOutlined } from '@ant-design/icons-vue';
  import { FontSelectItem } from './types';
  import { Ref } from 'vue';

  const props = withDefaults(
    defineProps<{
      dataList: FontSelectItem[];
      childrenKey: string;
    }>(),
    {},
  );

  const emit = defineEmits(['change', 'reload']);

  const selectValues = inject('selectValues') as Ref<string[]>;
  const selectItems = inject('selectItems') as Ref<FontSelectItem[]>;
  const page = inject('page') as Ref<PaginationProps>;

  const handlePageChange = () => {
    emit('reload');
  };
  // 选择子选项
  const handleChangeChild = (selectItem: FontSelectItem) => {
    const list = props.dataList;
    list.forEach((item: FontSelectItem) => {
      if (item?.familyGrouped) {
        // 字体家族选中处理
        item[props.childrenKey]?.forEach((i: FontSelectItem) => {
          i.checked = false;
          if (i.fontGNo === selectItem.fontGNo) {
            i.checked = true;
          }
        });
      } else {
        item.checked = false;
        if (item.fontGNo === selectItem.fontGNo) {
          item.checked = true;
        }
      }
    });
    const items: FontSelectItem[] = [unref(selectItem)];
    const values = [selectItem.fontGNo];
    selectItems.value = items;
    selectValues.value = values;
    emit('change');
  };
  // 初始化选中状态
  const initCheckedList = () => {
    const checkedList: string[] = unref(selectValues) || [];
    const list = props.dataList;
    list.forEach((item: FontSelectItem) => {
      if (item?.familyGrouped) {
        // 字体家族初始选中
        item[props.childrenKey]?.forEach((i: FontSelectItem) => {
          i.checked = checkedList.includes(i.fontGNo);
        });
      } else {
        // 普通字体设置选中
        item.checked = checkedList.includes(item.fontGNo);
      }
    });
  };
  watchEffect(() => {
    initCheckedList();
  });
  defineExpose({
    initCheckedList,
  });
</script>

<style lang="less">
  .editor-font-select-single {
    border: 1px solid #eeeeee;
    padding: 10px;
    width: 360px;
    display: flex;
    flex-direction: column;
    height: 45vh;
    &__header {
      background-color: #f2f2f2;
      color: #333;
      font-size: 14px;
      padding: 5px 10px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      .num {
        color: @primary-color;
        font-size: 12px;
      }
    }
    &__body {
      font-size: 14px;
      color: #333;
      overflow-y: auto;
      flex: 1;
      padding: 10px 0;
    }
    &__item {
      max-height: 100vh;
      .ico-fold {
        font-size: 12px;
        color: rgba(0, 0, 0, 1);
        margin-right: 5px;
        display: inline-block;
        transition: all 0.15s;
      }
      &.fold {
        max-height: 28px;
        overflow: hidden;
        .ico-fold {
          transform: rotate(-90deg);
        }
      }
    }
    &__group {
      cursor: pointer;
      padding: 3px 5px;
      &-ico {
        display: inline-block;
        width: 20px;
      }
      &.checked {
        background-color: #e6f7ff;
        font-weight: 700;
      }
    }
    &__child {
      padding: 3px 5px 3px 45px;
      width: 100%;
      cursor: pointer;
      &.checked {
        background-color: #e6f7ff;
        font-weight: 700;
      }
    }
    &__footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 10px;
      border-top: 1px solid #eee;
      .ant-pagination-disabled {
        display: inline-block !important;
      }
    }
  }
</style>
