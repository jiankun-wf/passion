<template>
  <div class="editor-attr__group" v-show="hasTemplateParams">
    <div class="editor-attr__group-title">参数</div>
    <Form class="editor__form" name="form" ref="formRef" :model="formData">
      <template v-for="(item, index) in formData.list">
        <FormItem
          :key="item.key"
          :name="['list', index, 'value']"
          :rules="item.rules"
          v-if="hasTypes(item)"
        >
          <component
            :is="item.component.name"
            :placeholder="item.component.placeholder"
            :allowClear="item.component.allowClear"
            :options="item.component.options"
            v-model:value="item.value"
            @change="handleSubmit"
          />
        </FormItem>
      </template>
      <!-- <FormItem style="text-align: center">
        <a-button type="primary" size="small" html-type="submit" @click="handleSubmit">
          保存参数
        </a-button>
        <a-button style="margin-left: 10px" size="small" @click="handleReset">重置参数</a-button>
      </FormItem> -->
    </Form>
  </div>
</template>

<script lang="ts" setup name="EditorBaseTemplate">
  import {
    inject,
    ref,
    reactive,
    shallowRef,
    watchEffect,
    nextTick,
    onUnmounted,
    computed,
  } from 'vue';
  import { Select, Form, FormItem } from 'ant-design-vue';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { UnwrapRef } from 'vue';

  const props = defineProps({
    title: { type: String },
    activeType: { type: String },
    editorType: { type: String },
    activeObject: { type: Object },
  });
  const activeObjectRef = ref();
  const activeTypeRef = ref<string>('stage');
  const editorTypeRef = ref<string>('');

  const { editorPageHistoryUpdateDebounce } = inject<any>('editor');
  const TextTemplateOptions = [
    {
      value: '${fontFamilyName}',
      label: '字体家族名',
    },
    {
      value: '${fontFamilyNameCn}',
      label: '字体中文名',
    },
    {
      value: '${fontFamilyNameEn}',
      label: '字体英文名',
    },
    {
      value: '${fontFamilyNamePinyin}',
      label: '字体拼音',
    },
  ];
  const TextDraftOptions = [
    {
      value: '${CharacterName}',
      label: '字体编码库',
    },
  ];
  const PageOptions = [
    {
      value: '${pageNum}',
      label: '页码',
    },
    {
      value: '${pageNum}-${pageTotal}',
      label: '页码-总页数',
    },
  ];

  interface IFormItem {
    key: string;
    value: string | number | boolean | null | undefined;
    language: string;
    editorTypes: string[];
    types: string[];
    rules?: any[];
    component: {
      name: any;
      placeholder: string;
      options?: any[];
      allowClear: boolean;
    };
  }
  const formData: UnwrapRef<{ list: IFormItem[] }> = reactive({
    list: [
      {
        key: 'text',
        value: null,
        language: 'void',
        editorTypes: ['template'],
        types: ['i-text', 'text', 'textbox'],
        rules: [{ required: false, trigger: 'change', message: '文本参数不能为空' }],
        component: {
          name: shallowRef(Select),
          placeholder: '请选择文本参数',
          options: TextTemplateOptions,
          allowClear: true,
        },
      },
      {
        key: 'text',
        value: null,
        language: 'void',
        editorTypes: ['draft'],
        types: ['i-text', 'text', 'textbox'],
        rules: [{ required: false, trigger: 'change', message: '文本参数不能为空' }],
        component: {
          name: shallowRef(Select),
          placeholder: '请选择文本参数',
          options: TextDraftOptions,
          allowClear: true,
        },
      },
      {
        key: 'text',
        value: null,
        language: 'void',
        editorTypes: ['template', 'draft'],
        types: ['pager-textbox'],
        rules: [{ required: false, trigger: 'change', message: '分页参数不能为空' }],
        component: {
          name: shallowRef(Select),
          placeholder: '请选择分页参数',
          options: PageOptions,
          allowClear: true,
        },
      },
      // {
      //   key: 'fontFamily',
      //   value: '',
      //   language: 'void',
      //   types: ['i-text', 'text', 'textbox'],
      //   rules: [{ required: false, message: '字体名称参数不能为空' }],
      //   component: {
      //     name: shallowRef(Input),
      //     placeholder: '请选择字体名称参数',
      //   },
      // },
      // {
      //   key: 'stroke',
      //   value: '',
      //   language: 'void',
      //   types: ['triangle', 'polygon', 'rect', 'circle'],
      //   rules: [{ required: false, message: '描边参数不能为空' }],
      //   component: {
      //     name: shallowRef(Input),
      //     placeholder: '请选择描边参数',
      //   },
      // },
    ],
  });
  function hasTypes(item: IFormItem) {
    return (
      item.editorTypes.includes(editorTypeRef.value) && item.types.includes(activeTypeRef.value)
    );
  }
  const formRef = ref();
  // 是否存在模板参数
  const hasTemplateParams = computed(() => {
    const res = formData?.list?.find((item) => hasTypes(item));
    return !!res;
  });
  const handleSubmit = () => {
    formRef.value
      .validate()
      .then(() => {
        const list = formData.list?.filter((item: IFormItem) => hasTypes(item));
        let data = list.map((item: IFormItem) => {
          const { key, value, language } = item;
          return { key, value, language };
        });

        const template = {
          data,
        };
        let activeObject = activeObjectRef.value;
        activeObject?.set('template', template);
        editorPageHistoryUpdateDebounce();
      })
      .catch((error: ValidateErrorEntity<any>) => {
        console.log('error', error);
      });
  };
  const handleReset = () => {
    formRef.value?.resetFields();
  };
  function getDefaultAttr() {
    const activeObject = activeObjectRef.value;
    const templateData = activeObject?.template?.data || [];
    if (templateData.length) {
      formData.list.forEach((item) => {
        const currItem = templateData.find((i: IFormItem) => i.key === item.key);
        if (currItem) {
          item.key = currItem.key;
          item.value = currItem.value;
        }
      });
    } else {
      formRef.value.resetFields();
    }
  }
  watchEffect(() => {
    activeObjectRef.value = props.activeObject;
    activeTypeRef.value = props.activeType || '';
    editorTypeRef.value = props.editorType || '';
    nextTick(() => {
      getDefaultAttr();
    });
  });
  onUnmounted(() => {
    handleReset();
  });
</script>
