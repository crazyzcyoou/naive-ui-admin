<template>
  <!-- 弹窗本体 -->
  <basicModal
    @register="modalRegister"
    @on-ok="handleOk"          
  >
    <div class="pt-2 space-y-4">
      <!-- 国籍 -->
      <n-form-item label="国籍" path="citizenship">
        <n-input
          v-model:value="formData.citizenship"
          placeholder="请输入国籍"
        />
      </n-form-item>
      <n-input
        v-model:value="formData.price"
        placeholder="请输入单价/万円"
      />
      <n-input
        v-model:value="formData.nearest_station"
        placeholder="最近车站"
      />
      <!-- 日语等级 -->
      <n-select
        v-model:value="formData.japanese_level"
        :options="japaneseLevelStatusOptions"
      />
      <!-- 英语等级 -->
      <n-select
        v-model:value="formData.english_level"
        :options="englishLevelStatusOptions"
      />
      <n-input
        v-model:value="formData.belonging_suppliers"
        placeholder="所属供应商"
      />
    </div>
  </basicModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useModal } from '@/components/Modal';
// import { updateResume } from '@/api/demandSupply/supply';

const japaneseLevelStatusOptions = [
  { label: 'ネイティプ(100%)', value: 'ネイティプ(100%)' },
  { label: 'ビジネスレベル(95%)', value: 'ビジネスレベル(95%)' },
  { label: 'かなり流暢(90%)', value: 'かなり流暢(90%)' },
  { label: '流暢(80%)', value: '流暢(80%)' },
  { label: '汪ぼ流畅(70%)', value: '汪ぼ流畅(70%)' },
  { label: 'たいてい流暢(60%)', value: 'たいてい流暢(60%)' },
  { label: '普通(50%)', value: '普通(50%)' },
  { label: '微妙(40%)', value: '微妙(40%)' },
  { label: '不得意(30%)', value: '不得意(30%)' },
  { label: '初心者(20%)', value: '初心者(20%)' },
];

const englishLevelStatusOptions = [
  { label: '英语A1', value: '英语A1' },
  { label: '英语A2', value: '英语A2' },
  { label: '英语B1', value: '英语B1' },
  { label: '英语B2', value: '英语B2' },
  { label: '英语C1', value: '英语C1' },
  { label: '英语C2', value: '英语C2' },
];

/* ---------------- 数据 & 校验 ---------------- */
const formData = reactive({
  id: undefined as number | undefined,
  citizenship: '',
  price: 0,
  nearest_station: 0,
  work_percent: 0,
  japanese_level: '',
  english_level: '',
  belonging_suppliers: '',
});


/* ---------------- Modal 逻辑 ---------------- */
const [
    modalRegister,
    { openModal: innerOpenModal, closeModal, setSubLoading },
  ] = useModal({
    title: '编辑',
    subBtuText: '保存',
});

// 暴露给父组件：带入当前行供回显
function openModal(record?: Record<string, any>) {
  Object.assign(formData, {
    id: record?.id,
    name: record?.name ?? '',
    status: record?.status ?? 0,
  });
  innerOpenModal();
}
defineExpose({ openModal });

/* ---------------- 保存 ---------------- */
async function handleOk() {

  setSubLoading(true);
  try {
    await updateResume(formData);       // ❷ 走 POST
    window.$message?.success('保存成功');
    closeModal();
  } catch (e) {
    window.$message?.error('保存失败');
    setSubLoading(false);
  }
}
</script>
