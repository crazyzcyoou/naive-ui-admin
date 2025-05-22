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
    field: 'status',
    component: 'NSelect',
    label: '状态',
    componentProps: {
      options: [
        { label: '待联系', value: 0 },
        { label: '已联系', value: 1 },
      ],
    },
  },
];

const [registerForm, { submit, setFieldsValue }] = useForm({
  gridProps: { cols: 1 },
  labelWidth: 80,
  layout: 'horizontal',
  showActionButtonGroup: false,
  schemas,
});

const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
  title: '编辑简历',
  subBtuText: '保存',
});

function show(record: any) {
  openModal();
  setFieldsValue(record);
}

async function okModal() {
  const res = await submit();
  if (res) {
    closeModal();
  } else {
    setSubLoading(false);
  }
}

defineExpose({ show });
</script>

<style scoped></style>
