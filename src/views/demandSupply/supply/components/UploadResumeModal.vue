<template>
  <basicModal @register="modalRegister" ref="modalRef" @on-ok="okModal">
    <div class="pt-8">
      <BasicForm @register="registerForm" />
    </div>
  </basicModal>
</template>

<script lang="ts" setup>
import { FormSchema, useForm } from '@/components/Form';
import { basicModal, useModal } from '@/components/Modal';

const schemas: FormSchema[] = [
  {
    field: 'name',
    component: 'NInput',
    label: '姓名',
    rules: [{ required: true, message: '请输入姓名', trigger: ['blur'] }],
  },
  {
    field: 'file',
    component: 'NUpload',
    label: '简历文件',
    componentProps: {
      'list-type': 'text',
    },
  },
];

const [registerForm, { submit }] = useForm({
  gridProps: { cols: 1 },
  labelWidth: 80,
  layout: 'horizontal',
  showActionButtonGroup: false,
  schemas,
});

const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
  title: '上传简历',
  subBtuText: '上传',
});

async function okModal() {
  const res = await submit();
  if (res) {
    closeModal();
  } else {
    setSubLoading(false);
  }
}

defineExpose({ openModal });
</script>

<style scoped></style>
