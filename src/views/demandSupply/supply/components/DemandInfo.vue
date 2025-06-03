<template>
  <n-grid cols="2 s:2 m:2 l:3 xl:3 2xl:3" responsive="screen">
    <n-grid-item>
      <BasicForm @register="registerForm" />
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
  import { FormSchema, useForm } from '@/components/Form';
  import { basicModal, useModal } from '@/components/Modal';
  import { watchEffect } from 'vue'

  const props = defineProps<{
    params: Record<string, any>
  }>();
  const schemas: FormSchema[] = [
    {
      field: 'proposal_document',
      component: 'NInput',
      label: '联络文',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入联络文......',
      },
    },
    {
      field: 'role',
      component: 'NInput',
      label: '角色',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'specialty',
      component: 'NInput',
      label: '得意分野',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'citizenship',
      component: 'NInput',
      label: '国籍',
      componentProps: {
        placeholder: '',
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'price',
      component: 'NInput',
      label: '单价/万円',
      componentProps: {
        placeholder: '',
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'nearest_station',
      component: 'NInput',
      label: '最近车站',
      componentProps: {
        placeholder: '',
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'work_percent',
      component: 'NInput',
      label: '工作占比',
      componentProps: {
        placeholder: '',
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'japanese_level',
      component: 'NInput',
      label: '日语等级',
      componentProps: {
        placeholder: '',
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'english_level',
      component: 'NInput',
      label: '英语等级',
      componentProps: {
        placeholder: '',
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'belonging_suppliers',
      component: 'NInput',
      label: '所属供应商',
      componentProps: {
        placeholder: '',
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
  ];

  const [registerForm, { submit, setFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 80,
    layout: 'horizontal',
    submitButtonText: '保存',
    showActionButtonGroup: false,
    schemas,
    model: props.params,
  });

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '编辑',
    subBtuText: '保存',
  });

  async function okModal() {
    const formRes = await submit();
    console.log(props)
    console.log(formRes)
    if (formRes) {
      closeModal();
      console.log('formRes', formRes);
    } else {
      setSubLoading(false);
    }
  }

  watchEffect(() => {
    if (props.params) {
      setFieldsValue(props.params);
    }
  });
  defineExpose({
    openModal,
  });
</script>
