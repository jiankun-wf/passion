<template>
  <div class="editor-font-select-multiple">
    <div class="editor-font-select-multiple__header">
      <div>
        <Checkbox
          v-model:checked="selectAll.checked"
          :indeterminate="selectAll.indeterminate"
          @change="handleChangeAll"
        >
          全部
        </Checkbox>
      </div>
      <div>
        <span class="num"> 已选择{{ selectValues?.length || 0 }}项 </span>
        <span>，共{{ page.total }}项</span>
      </div>
    </div>
    <div class="editor-font-select-multiple__body">
      <div
        class="editor-font-select-multiple__item"
        v-for="(item, index) in dataList"
        :key="index"
        :class="{ fold: item.fold }"
      >
        <div class="editor-font-select-multiple__group">
          <span class="editor-font-select-multiple__group-ico">
            <CaretDownOutlined
              class="ico-fold"
              v-if="item.familyGrouped"
              @click="item.fold = !item.fold"
            />
          </span>

          <Checkbox
            v-model:checked="item.checked"
            :indeterminate="item.indeterminate"
            @change="handleChangeGroup($event, item)"
          >
            <span :style="{ fontFamily: item.webFontFamily }">
              {{ item.fontFamilyName || item.fontFamilyNameCn }}
            </span>
            <span v-if="item.familyGrouped">- 字体家族</span>
          </Checkbox>
        </div>

        <div v-if="item[childrenKey]">
          <div
            class="editor-font-select-multiple__child"
            :name="item.fontGNo"
            v-for="(itemC, indexC) in item[childrenKey]"
            :key="indexC"
          >
            <Checkbox
              v-model:checked="itemC.checked"
              @change="handleChangeChild($event, item, itemC)"
            >
              <span :style="{ fontFamily: itemC.webFontFamily }">
                {{ itemC.fontFamilyName || itemC.fontFamilyNameCn }}
              </span>
            </Checkbox>
          </div>
        </div>
      </div>
    </div>
    <div class="editor-font-select-multiple__footer">
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
  import { inject, reactive, toRaw, unref, watchEffect } from 'vue';
  import { Checkbox, Pagination, PaginationProps } from 'ant-design-vue';
  import { CaretDownOutlined } from '@ant-design/icons-vue';
  import { FontSelectItem } from './types';
  import { uniq, uniqBy } from 'lodash-es';
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
  const selectAll = reactive({
    checked: false,
    indeterminate: false,
  });

  const handlePageChange = () => {
    emit('reload');
  };
  // 全部选中
  const handleChangeAll = (e: { target: { checked: any } }) => {
    const { checked } = e.target;
    const list = props.dataList;
    selectAll.checked = checked;
    selectAll.indeterminate = false;
    list.forEach((item: FontSelectItem) => {
      item.indeterminate = false;
      item.checked = checked;
      if (item?.familyGrouped) {
        item[props.childrenKey]?.forEach((i) => {
          i.checked = checked;
        });
      }
    });
    emitChange();
  };
  // 选择组
  const handleChangeGroup = (e: { target: { checked: any } }, item: FontSelectItem) => {
    const { checked } = e.target;
    item.indeterminate = false;
    item.checked = checked;
    item[props.childrenKey]?.forEach((i) => {
      i.checked = checked;
    });
    emitChange();
  };
  // 选择子选项
  const handleChangeChild = (
    e: { target: { checked: any } },
    item: FontSelectItem,
    itemC: FontSelectItem,
  ) => {
    const { checked } = e.target;
    itemC.checked = checked;
    const checkList = item[props.childrenKey]?.filter((i) => i.checked) || [];
    const checkLen = checkList.length;
    const childLen = item[props.childrenKey]?.length;
    if (checkLen === childLen) {
      item.indeterminate = false;
      item.checked = true;
    } else if (checkLen === 0) {
      item.indeterminate = false;
      item.checked = false;
    } else {
      item.indeterminate = true;
    }
    emitChange();
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
        // 设置父级状态
        const checkList = item[props.childrenKey]?.filter((i) => i.checked) || [];
        const checkLen = checkList.length;
        const childLen = item[props.childrenKey]?.length;
        // console.log('childLen', childLen, 'checkLen', checkLen);
        if (checkLen === childLen) {
          item.indeterminate = false;
          item.checked = true;
        } else if (checkLen === 0) {
          item.indeterminate = false;
          item.checked = false;
        } else {
          item.indeterminate = true;
        }
      } else {
        // 普通字体设置选中
        item.checked = checkedList.includes(item.fontGNo);
      }
    });
    allCheckedState();
  };
  // 设置全选状态
  const allCheckedState = () => {
    const list = props.dataList;
    let noChecked = false;
    let hasChecked = false;
    list.map((item: FontSelectItem) => {
      if (item?.familyGrouped) {
        return item[props.childrenKey]?.map((i) => {
          if (!i.checked) {
            noChecked = true;
          } else {
            hasChecked = true;
          }
        });
      } else {
        if (!item.checked) {
          noChecked = true;
        } else {
          hasChecked = true;
        }
      }
    });
    selectAll.indeterminate = noChecked && hasChecked;
    selectAll.checked = !noChecked;
  };
  const emitChange = () => {
    const list = props.dataList;
    const values: string[] = [];
    const items: FontSelectItem[] = [];
    list.map((item: FontSelectItem) => {
      if (item?.familyGrouped) {
        // 字体家族选中处理
        item[props.childrenKey]?.map((i: FontSelectItem) => {
          const hasSelect = selectValues.value.includes(i.fontGNo);
          if (i.checked) {
            values.push(i.fontGNo);
            items.push(i);
          } else if (hasSelect) {
            selectItems.value = unref(selectItems).filter((v) => v.fontGNo !== i.fontGNo);
            selectValues.value = unref(selectValues).filter((v) => v !== i.fontGNo);
          }
        });
      } else {
        const hasSelect = selectValues.value.includes(item.fontGNo);
        if (item.checked) {
          // 普通字体设置选中
          values.push(item.fontGNo);
          items.push(item);
        } else if (hasSelect) {
          selectItems.value = unref(selectItems).filter((v) => v.fontGNo !== item.fontGNo);
          selectValues.value = unref(selectValues).filter((v) => v !== item.fontGNo);
        }
      }
    });
    const oldValues: string[] = toRaw(selectValues.value) || [];
    const oldItems: FontSelectItem[] = toRaw(selectItems.value) || [];

    selectValues.value = uniq([...oldValues, ...values]) || [];
    selectItems.value = uniqBy([...oldItems, ...items], 'fontGNo');
    allCheckedState();
    emit('change');
  };
  watchEffect(() => {
    initCheckedList();
  });
  defineExpose({
    initCheckedList,
  });
</script>

<style lang="less">
  .editor-font-select-multiple {
    border: 1px solid #eeeeee;
    padding: 10px;
    width: 360px;
    display: flex;
    flex-direction: column;
    height: 60vh;
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
      padding: 3px 5px;
      &-ico {
        display: inline-block;
        width: 20px;
      }
    }
    &__child {
      padding: 3px 5px 3px 45px;
      width: 100%;
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
