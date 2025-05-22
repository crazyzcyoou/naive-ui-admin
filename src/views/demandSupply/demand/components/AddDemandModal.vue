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
    label: '需求名称',
    rules: [{ required: true, message: '请输入需求名称', trigger: ['blur'] }],
    componentProps: { placeholder: '请输入需求名称' },
  },
  {
    field: 'desc',
    component: 'NInput',
    label: '描述',
    componentProps: { type: 'textarea', placeholder: '请输入描述' },
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
  title: '新增需求',
  subBtuText: '保存',
});

async function okModal() {
  const formRes = await submit();
  if (formRes) {
    closeModal();
  } else {
    setSubLoading(false);
  }
}

defineExpose({
  openModal,
});
</script>

<style scoped></style>
