<template>
  <Upload
    class="editor-upload-image"
    v-model:fileist="fileList"
    :show-upload-list="false"
    accept="image/*"
    :before-upload="beforeUpload"
    :custom-request="startUpload"
    v-bind="bindValue"
    :disabled="loading || disabled"
  >
    <slot>
      <a-button block type="primary" size="large"> 上传图片 </a-button>
    </slot>
  </Upload>
</template>

<script setup lang="ts" name="EditorUploadImage">
  import { Upload } from 'ant-design-vue';
  import { ref, useAttrs } from 'vue';
  // import { doFontCoverUpload as uploadApi } from '/@/api/font/manage';
  // import { articleUploadImage as uploadApi } from '/@/api/content/article';
  // import { uploadApi } from '/@/api/sys/upload';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { omit } from 'lodash-es';
  import { getBase64WithFile } from './helper';
  // types
  interface FileItem {
    uid: string;
    name: string;
    size: number;
    type: string;
  }
  interface FileInfo extends FileItem {
    file: File | Blob;
  }

  // props
  const props = withDefaults(
    defineProps<{
      value?: string | Object;
      uploadText?: string;
      api?: (...args: any[]) => Promise<any>;
      uploadParams?: { [props: string]: any };
      disabled?: boolean;
      resultField?: string;
      urlField?: string;
      pathField?: string;
      isBase64?: boolean;
    }>(),
    {
      uploadText: '上传图片',
      // api: uploadApi,
      disabled: false,
      isBase64: false,
    },
  );
  const $attrs = useAttrs();
  const bindValue = omit({ ...props, ...$attrs }, 'onChange');
  // emits
  const emit = defineEmits<{
    (e: 'update:value', src: string);
    (e: 'change', src: string);
    (e: 'success', src: string, name: string);
  }>();
  // 变量
  const { createMessage: msg } = useMessage();
  const fileList = ref([]);
  const loading = ref(false);
  // 上传之前，判断一下文件类型和大小
  const beforeUpload = (file: File) => {
    const type = file.type;
    const size = file.size;
    if (!/^image\/(png|jpeg|jpg|bpm)$/.test(type)) {
      msg.error('仅支持上传：jpg、png、jpeg、bmp格式的图片');
      return false;
    }
    if (size / Math.pow(1024, 2) > 10) {
      msg.error('仅支持上传：10MB以内的图片');
      return false;
    }

    loading.value = true;
    return true;
  };
  // 开始上传
  const startUpload = async (file: FileInfo) => {
    const { file: uploadFile } = file;
    const { result } = await getBase64WithFile(uploadFile as File);
    if (props?.isBase64) {
      const url: string = result;
      emit('update:value', url);
      emit('change', url);
      loading.value = false;
      return false;
    }

    props
      ?.api?.(uploadFile)
      .then(({ data: res }) => {
        try {
          const data = (res as any).data;
          const url: string = data;
          emit('update:value', url);
          emit('change', url);
          emit('success', url, (uploadFile as any).name);
        } finally {
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };
</script>

<style lang="less" scoped>
  .editor-upload-image {
    display: block;
  }
  :deep(.ant-upload) {
    display: block;
  }
</style>
