<template>
  <Form layout="inline">
    <FormItem>
      <Input
        v-model:value="formState.fontFamilyName"
        placeholder="请输入关键字"
        @press-enter="handleSubmit"
      />
    </FormItem>

    <FormItem>
      <a-button style="margin-right: 10px" @click="handleReset">重置</a-button>
      <a-button type="primary" @click.prevent="handleSubmit">查询</a-button>
    </FormItem>
  </Form>
</template>
<script setup lang="ts">
  import { Form, FormItem, Input } from 'ant-design-vue';
  import { UnwrapRef, reactive } from 'vue';

  const emit = defineEmits(['search']);

  const useForm = Form.useForm;

  interface FormState {
    fontFamilyName: string;
  }

  const formState: UnwrapRef<FormState> = reactive({
    fontFamilyName: '',
  });

  const ruleState = reactive({
    fontFamilyName: [
      {
        required: true,
        message: '请输入关键字',
      },
    ],
  });

  const { resetFields, validate } = useForm(formState, ruleState);
  async function handleSubmit() {
    try {
      const values = await validate();
      emit('search', values);
    } catch {
    } finally {
    }
  }
  function handleReset() {
    emit('search');
    resetFields();
  }
</script>

<style scoped lang="less"></style>
