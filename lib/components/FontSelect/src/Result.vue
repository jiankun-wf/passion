<template>
  <div class="editor-font-select-result">
    <div class="editor-font-select-result__header">
      <span>共{{ selectItems.length || 0 }}项</span>
    </div>

    <div class="editor-font-select-result__body">
      <template v-if="selectItems.length">
        <Draggable
          v-model="selectItems"
          item-key="fontGNo"
          animation="150"
          handle=".cursor-move"
          @change="handleChange"
        >
          <template #item="{ element }">
            <div class="editor-font-select-result__item">
              <div class="editor-font-select-result__item-name">
                {{ element.fontFamilyName || element.fontFamilyNameCn }}
              </div>
              <span
                @click.stop="handleDelete(element)"
                class="editor-font-select-result__item-delete"
                >删除</span
              >
              <Icon icon="ph:dots-six-vertical-bold" size="18" class="ml-1 cursor-move" />
            </div>
          </template>
        </Draggable>
      </template>
      <Empty v-else description="暂未选择任何字体" class="editor-font-select-result__empty" />
    </div>
    <div class="editor-font-select-result__footer"> </div>
  </div>
</template>

<script lang="ts" setup name="EditorFontSelectResult">
  import { inject, unref } from 'vue';
  import { Empty } from 'ant-design-vue';
  import { Ref } from 'vue';
  import { FontSelectItem } from './types';
  import Draggable from 'vuedraggable';
  import { Icon } from '/@/components/Icon';
  const emit = defineEmits(['change']);

  const selectValues = inject('selectValues') as Ref<string[]>;
  const selectItems = inject('selectItems') as Ref<FontSelectItem[]>;

  const handleChange = () => {
    selectValues.value = unref(selectItems)?.map((item) => item.fontGNo) || [];
    emit('change');
  };
  const handleDelete = ({ fontGNo }) => {
    selectItems.value = unref(selectItems).filter((item) => item.fontGNo !== fontGNo);
    selectValues.value = unref(selectValues).filter((item) => item !== fontGNo);
    emit('change');
  };
  // const handleClear = () => {
  //   selectItems.value = [];
  //   selectValues.value = [];
  // };
</script>

<script lang="ts"></script>
<style lang="less">
  .editor-font-select-result {
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
      padding: 5px;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .selected-count {
        color: @primary-color;
      }
      .btn-clear {
        font-size: 12px;
      }
    }
    &__body {
      font-size: 14px;
      color: #333;
      overflow-y: auto;
      flex: 1;
      padding-top: 5px;
    }
    &__item {
      background-color: #f7f7f7;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      height: 36px;
      margin-bottom: 5px;
      user-select: none;
      &-name {
        flex: 1;
      }
      &-delete {
        color: #ed6f6f;
        margin: 0 10px;
        cursor: pointer;
      }
    }
    &__empty {
      position: relative;
      top: 30%;
    }
  }
</style>
