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
import { addDemand } from '@/api/demandSupply/demand';
import { useMessage } from 'naive-ui';

const message = useMessage();
const emit = defineEmits(['success']);

const MAX = 2000;
const schemas: FormSchema[] = [
  {
    field: 'demand_txt',
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


const [registerForm, { submit, resetFields }] = useForm({
  gridProps: { cols: 1 },
  labelWidth: 80,
  layout: 'horizontal',
  showActionButtonGroup: false,
  schemas,
});

const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
  title: '新建需求',
  subBtuText: '保存',
});


async function okModal() {
  try {
    // 获取表单数据
    const formRes = await submit();
    if (!formRes.demand_txt) {
      setSubLoading(false);
      return;
    }
    await addDemand(formRes)
    message.success('需求保存成功');
    resetFields();
    closeModal();
    
    // 通知父组件刷新列表
    emit('success');
  } catch (error) {
    // 错误处理
    message.error(`保存失败: 请联系管理员！`);
    setSubLoading(false);
  }
}

function show() {
  resetFields();
  openModal();
}

defineExpose({
  openModal: show,
});
</script>

<style scoped></style>
