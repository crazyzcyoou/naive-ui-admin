<template>
  <basicModal @register="modalRegister" ref="modalRef" @on-ok="okModal">
    <div class="pt-2">
      <BasicForm @register="registerForm" />
    </div>
  </basicModal>
</template>

<script lang="ts" setup>
import { FormSchema, useForm } from '@/components/Form';
import { basicModal, useModal } from '@/components/Modal';

const MAX = 200;
const schemas: FormSchema[] = [
  {
    field: 'desc',
    component: 'NInput',
    label: '需求文',
    componentProps: { 
      type: 'textarea', 
      autosize: { minRows: 6 },
      placeholder: '请输入需求文......',
      maxlength: MAX,
      showCount: true, 
    },
    rules: [
      {
        max: MAX,
        message: `最多输入 ${MAX} 个字符`,
        trigger: ['input', 'blur'],
      },
    ],
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
  title: '新建',
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
