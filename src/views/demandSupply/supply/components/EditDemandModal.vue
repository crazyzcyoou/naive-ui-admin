<template>
  <n-modal
    v-model:show="showModal"
    :title="'编辑需求'"
    preset="dialog"
    :mask-closable="false"
    style="width: 600px"
  >
    <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="需求名称" path="name">
        <n-input v-model:value="formValue.name" placeholder="请输入需求名称" />
      </n-form-item>
      
      <n-form-item label="需求描述" path="description">
        <n-input
          v-model:value="formValue.description"
          type="textarea"
          placeholder="请输入需求描述"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </n-form-item>
      
      <n-form-item label="优先级" path="priority">
        <n-select
          v-model:value="formValue.priority"
          :options="priorityOptions"
          placeholder="请选择优先级"
        />
      </n-form-item>
      
      <n-form-item label="状态" path="status">
        <n-select
          v-model:value="formValue.status"
          :options="statusOptions"
          placeholder="请选择状态"
        />
      </n-form-item>
    </n-form>
    
    <template #action>
      <n-space>
        <n-button @click="closeModal">取消</n-button>
        <n-button type="primary" :loading="submitting" @click="handleSubmit">
          确认
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useMessage } from 'naive-ui';
import { updateDemand } from '@/api/demandSupply/demand';

const props = defineProps({
  demand: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(['success']);
const message = useMessage();
const showModal = ref(false);
const submitting = ref(false);
const formRef = ref(null);

const formValue = reactive({
  id: 0,
  name: '',
  description: '',
  priority: null,
  status: null
});

const priorityOptions = [
  { label: '高', value: 'high' },
  { label: '中', value: 'medium' },
  { label: '低', value: 'low' }
];

const statusOptions = [
  { label: '待处理', value: 'pending' },
  { label: '进行中', value: 'in_progress' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
];

const rules = {
  name: {
    required: true,
    message: '请输入需求名称',
    trigger: ['blur', 'input']
  },
  description: {
    required: true,
    message: '请输入需求描述',
    trigger: ['blur', 'input']
  },
  priority: {
    required: true,
    message: '请选择优先级',
    trigger: ['blur', 'change']
  },
  status: {
    required: true,
    message: '请选择状态',
    trigger: ['blur', 'change']
  }
};

// 监听需求数据变化
watch(() => props.demand, (newVal) => {
  if (newVal) {
    Object.assign(formValue, newVal);
  }
}, { deep: true });

function openModal() {
  if (!props.demand) {
    message.warning('需求信息不存在');
    return;
  }
  
  Object.assign(formValue, props.demand);
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function handleSubmit() {
  await formRef.value.validate();
  
  submitting.value = true;
  
  try {
    await updateDemand(formValue);
    message.success('需求更新成功');
    emit('success');
    closeModal();
  } catch (error) {
    message.error('更新失败：' + error.message);
  } finally {
    submitting.value = false;
  }
}

defineExpose({
  openModal
});
</script>