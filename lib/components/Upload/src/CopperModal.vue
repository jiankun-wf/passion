<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="t('cuComponent.upload.cropper.modalTitle')"
    width="800px"
    :canFullscreen="false"
    @ok="handleOk"
    :ok-button-props="{ disabled: !src }"
    :okText="t('cuComponent.upload.cropper.okText')"
  >
    <div :class="prefixCls">
      <div :class="`${prefixCls}-left`">
        <div :class="`${prefixCls}-cropper`">
          <CropperImage
            v-if="src"
            :src="src"
            height="300px"
            :circled="circled"
            @cropend="handleCropend"
            @ready="handleReady"
            :options="options"
          />
        </div>

        <div :class="`${prefixCls}-toolbar`">
          <Upload :fileList="[]" accept="image/*" :beforeUpload="handleBeforeUpload">
            <Tooltip :title="t('component.cropper.selectImage')" placement="bottom">
              <a-button size="small" preIcon="ant-design:upload-outlined" type="primary" />
            </Tooltip>
          </Upload>
          <Space>
            <Tooltip :title="t('component.cropper.btn_reset')" placement="bottom">
              <a-button
                type="primary"
                preIcon="ant-design:reload-outlined"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('reset')"
              />
            </Tooltip>
            <Tooltip :title="t('component.cropper.btn_rotate_left')" placement="bottom">
              <a-button
                type="primary"
                preIcon="ant-design:rotate-left-outlined"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('rotate', -45)"
              />
            </Tooltip>
            <Tooltip :title="t('component.cropper.btn_rotate_right')" placement="bottom">
              <a-button
                type="primary"
                preIcon="ant-design:rotate-right-outlined"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('rotate', 45)"
              />
            </Tooltip>
            <Tooltip :title="t('component.cropper.btn_scale_x')" placement="bottom">
              <a-button
                type="primary"
                preIcon="vaadin:arrows-long-h"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('scaleX')"
              />
            </Tooltip>
            <Tooltip :title="t('component.cropper.btn_scale_y')" placement="bottom">
              <a-button
                type="primary"
                preIcon="vaadin:arrows-long-v"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('scaleY')"
              />
            </Tooltip>
            <Tooltip :title="t('component.cropper.btn_zoom_in')" placement="bottom">
              <a-button
                type="primary"
                preIcon="ant-design:zoom-in-outlined"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('zoom', 0.1)"
              />
            </Tooltip>
            <Tooltip :title="t('component.cropper.btn_zoom_out')" placement="bottom">
              <a-button
                type="primary"
                preIcon="ant-design:zoom-out-outlined"
                size="small"
                :disabled="!src"
                @click="handlerToolbar('zoom', -0.1)"
              />
            </Tooltip>
          </Space>
        </div>
      </div>
      <div :class="`${prefixCls}-right`">
        <div :class="`${prefixCls}-preview`">
          <img :src="previewSource" v-if="previewSource" :alt="t('component.cropper.preview')" />
        </div>
        <template v-if="previewSource">
          <div :class="`${prefixCls}-group`">
            <Avatar :src="previewSource" size="large" shape="square" />
            <Avatar :src="previewSource" :size="48" shape="square" />
            <Avatar :src="previewSource" :size="64" shape="square" />
            <Avatar :src="previewSource" :size="80" shape="square" />
          </div>
        </template>
      </div>
    </div>
    <template #appendFooter>
      <a-button type="primary" :disabled="!src" @click="handleUpload">{{
        t('cuComponent.upload.cropper.uploadText')
      }}</a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import type { CropendResult, Cropper } from '/@/components/Cropper/src/typing';
  import { defineComponent, ref } from 'vue';
  import { CropperImage } from '/@/components/Cropper';
  import { Space, Upload, Avatar, Tooltip } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage: msg } = useMessage();
  // type apiFunParams = { file: Blob; name: string; filename: string };
  type Options = Cropper.Options;
  const props = {
    circled: { type: Boolean, default: true },
    // uploadApi: {
    //   type: Function as PropType<(params: apiFunParams) => Promise<any>>,
    // },
    uploadApi: {
      type: Function as PropType<PromiseFn>,
      default: null,
      required: false,
    },
    options: { type: Object as PropType<Options>, default: () => ({}) },
    isDemo: { type: Boolean, default: true },
    uploadParams: {
      type: Object as PropType<any>,
      default: {},
    },
  };

  export default defineComponent({
    name: 'CropperModal',
    components: { BasicModal, Space, CropperImage, Upload, Avatar, Tooltip },
    props,
    emits: ['uploadSuccess', 'register'],
    setup(props, { emit }) {
      let filename = '';
      let fileData;
      let sourceData;
      const src = ref('');
      const previewSource = ref('');
      const cropper = ref<Cropper>();
      let scaleX = 1;
      let scaleY = 1;

      const { prefixCls } = useDesign('cropper-am');
      const [register, { closeModal }] = useModalInner();
      const { t } = useI18n();

      // Block upload
      function handleBeforeUpload(file: File) {
        fileData = file;
        sourceData = file;
        const type = file.type;
        if (!/^image\/(png|jpeg|jpg|bpm)$/.test(type)) {
          msg.error('仅支持上传：jpg、png、jpeg、bpm格式的图片');
          return false;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        src.value = '';
        previewSource.value = '';
        reader.onload = function (e) {
          src.value = (e.target?.result as string) ?? '';
          filename = file.name;
        };
        return false;
      }

      function handleCropend({ imgBase64 }: CropendResult) {
        previewSource.value = imgBase64;
        fileData = dataURLtoFile(imgBase64, filename);
      }
      function dataURLtoFile(dataurl, filename) {
        let arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      }

      function handleReady(cropperInstance: Cropper) {
        cropper.value = cropperInstance;
      }

      function handlerToolbar(event: string, arg?: number) {
        if (event === 'scaleX') {
          scaleX = arg = scaleX === -1 ? 1 : -1;
        }
        if (event === 'scaleY') {
          scaleY = arg = scaleY === -1 ? 1 : -1;
        }
        cropper?.value?.[event]?.(arg);
      }

      function handleOk(type = true) {
        // const uploadApi = props.uploadApi;
        // if (uploadApi && isFunction(uploadApi)) {
        // const blob = dataURLtoBlob(previewSource.value);
        // try {
        // setModalProps({ confirmLoading: true });
        if (props.isDemo) {
          // 演示数据
          emit('uploadSuccess', { source: previewSource.value, file: fileData });
        } else {
          // const result = await uploadApi({
          //   data: {
          // ...(props.uploadParams || {}),
          //   },
          //   name: 'file',
          //   file: blob,
          //   filename,
          // }).catch(() => {});
          if (!type) {
            fileData = sourceData;
          }
          emit('uploadSuccess', {
            source: previewSource.value,
            file: fileData,
          });
          // }
          closeModal();
          // } finally {
          //   setModalProps({ confirmLoading: false });
          // }
        }
      }
      // 不剪裁直接上传
      function handleUpload() {
        previewSource.value = src.value;
        handleOk(false);
      }

      return {
        t,
        prefixCls,
        src,
        register,
        previewSource,
        handleBeforeUpload,
        handleCropend,
        handleReady,
        handlerToolbar,
        handleOk,
        handleUpload,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-cropper-am';

  .@{prefix-cls} {
    display: flex;

    &-left,
    &-right {
      height: 340px;
    }

    &-left {
      width: 55%;
    }

    &-right {
      width: 45%;
    }

    &-cropper {
      height: 300px;
      background: #eee;
      background-image: linear-gradient(
          45deg,
          rgb(0 0 0 / 25%) 25%,
          transparent 0,
          transparent 75%,
          rgb(0 0 0 / 25%) 0
        ),
        linear-gradient(
          45deg,
          rgb(0 0 0 / 25%) 25%,
          transparent 0,
          transparent 75%,
          rgb(0 0 0 / 25%) 0
        );
      background-position: 0 0, 12px 12px;
      background-size: 24px 24px;
    }

    &-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
    }

    &-preview {
      width: 320px;
      height: 220px;
      margin: 0 auto;
      overflow: hidden;
      border: 1px solid @border-color-base;
      border-radius: 2px;

      img {
        width: 100%;
        object-fit: contain;
        // height: 100%;
      }
    }

    &-group {
      display: flex;
      padding-top: 8px;
      margin-top: 8px;
      border-top: 1px solid @border-color-base;
      justify-content: space-around;
      align-items: center;
    }
  }
</style>
