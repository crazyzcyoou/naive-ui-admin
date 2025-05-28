<template>
  <n-modal
    v-model:show="showModal"
    :title="'上传简历'"
    preset="dialog"
    :mask-closable="false"
    :close-on-esc="false"
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
      <n-form-item label="简历文件" path="files">
        <n-upload
          ref="uploadRef"
          multiple
          :default-upload="false"
          :max="10"
          accept=".pdf,.doc,.docx"
          @change="handleUploadChange"
        >
        <n-button>选择文件</n-button>
        </n-upload>
        <!-- <n-text depth="3" style="margin-top: 8px; display: block">
          支持PDF、Word格式，最多可上传10个文件
        </n-text> -->
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="closeModal">取消</n-button>
        <n-button type="primary" :loading="uploading" @click="handleSubmit">
          {{ uploading ? '上传中...' : '确认上传' }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useMessage } from 'naive-ui';
import { uploadSupply } from '@/api/demandSupply/supply';

const props = defineProps({
  demandId: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['success']);
const message = useMessage();
const showModal = ref(false);
const uploading = ref(false);
const uploadRef = ref(null);
const formRef = ref(null);

const formValue = reactive({
  files: []
});

const rules = {
  files: {
    required: true,
    message: '请选择至少一个简历文件',
    trigger: ['blur', 'change']
  }
};

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  formValue.files = [];
}

function handleUploadChange(options) {
  formValue.files = options.fileList;
}

async function handleSubmit() {
  
  if (formValue.files.length === 0) {
    return message.warning('请选择至少一个简历文件');
  }
  
  uploading.value = true;
  
  try {
    const formData = new FormData();
    formValue.files.forEach(file => {
      formData.append('files', file.file);
    });
    formData.append('demandId', props.demandId.toString());
    
    await uploadSupply(formData);
    message.success('简历上传成功');
    emit('success');
    closeModal();
  } catch (error) {
    message.error('上传失败：' + error.message);
  } finally {
    uploading.value = false;
  }
}

defineExpose({
  openModal
});
</script>

<style scoped></style>

