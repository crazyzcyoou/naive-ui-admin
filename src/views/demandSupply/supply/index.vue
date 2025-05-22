<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable
      title="Demand 列表"
      :columns="demandColumns"
      :request="loadDemand"
      :row-key="(row) => row.id"
      @row-click="showDrawer"
    />
  </n-card>

  <n-drawer v-model:show="drawer" :width="600" placement="right">
    <n-drawer-content title="需求详情" closable>
      <BasicForm @register="registerForm" />
      <n-divider />
      <BasicTable
        title="简历列表"
        :columns="resumeColumns"
        :request="loadResume"
        :row-key="(row) => row.id"
        ref="resumeRef"
      >
        <template #tableTitle>
          <n-button type="primary" @click="openUpload">上传简历</n-button>
        </template>
        <template #action="{ record }">
          <n-button text type="primary" @click="editResume(record)">编辑</n-button>
        </template>
      </BasicTable>
    </n-drawer-content>
  </n-drawer>

  <UploadResumeModal ref="uploadRef" />
  <EditResumeModal ref="editRef" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { BasicTable } from '@/components/Table';
import { BasicForm, FormSchema, useForm } from '@/components/Form';
import { NButton } from 'naive-ui';
import { getDemandList } from '@/api/demandSupply/demand';
import { getSupplyList } from '@/api/demandSupply/supply';
import { columns as demandColumns } from '../demand/columns';
import { resumeColumns } from './columns';
import UploadResumeModal from './components/UploadResumeModal.vue';
import EditResumeModal from './components/EditResumeModal.vue';

const drawer = ref(false);
const currentDemand = ref<any>();
const resumeRef = ref();
const uploadRef = ref();
const editRef = ref();

const [registerForm] = useForm({
  gridProps: { cols: 1 },
  labelWidth: 80,
  layout: 'horizontal',
  showActionButtonGroup: false,
  schemas: [
    { field: 'name', component: 'NInput', label: '需求名称' },
    { field: 'desc', component: 'NInput', label: '描述', componentProps: { type: 'textarea' } },
    { field: 'status', component: 'NSwitch', label: '启用' },
  ] as FormSchema[],
});

const demandParams = reactive({ pageSize: 10 });
const resumeParams = reactive({ demandId: 0, pageSize: 10 });

const loadDemand = async (res) => {
  return await getDemandList({ ...demandParams, ...res });
};

const loadResume = async (res) => {
  return await getSupplyList({ ...resumeParams, ...res, demandId: resumeParams.demandId });
};

function showDrawer(row) {
  currentDemand.value = row;
  resumeParams.demandId = row.id;
  drawer.value = true;
}

function openUpload() {
  uploadRef.value.openModal();
}

function editResume(record) {
  editRef.value.show(record);
}
</script>

<style scoped></style>
