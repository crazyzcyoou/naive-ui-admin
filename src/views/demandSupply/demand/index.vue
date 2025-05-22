<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable
      title="Demand 列表"
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :scroll-x="800"
    >
      <template #tableTitle>
        <n-button type="primary" @click="openAdd">
          新增需求
        </n-button>
      </template>
    </BasicTable>
  </n-card>
  <AddDemandModal ref="addRef" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { BasicTable } from '@/components/Table';
import { NButton } from 'naive-ui';
import { getDemandList } from '@/api/demandSupply/demand';
import { columns } from './columns';
import AddDemandModal from './components/AddDemandModal.vue';

const actionRef = ref();
const addRef = ref();

const params = reactive({
  pageSize: 10,
});

const loadDataTable = async (res) => {
  return await getDemandList({ ...params, ...res });
};

function openAdd() {
  addRef.value.openModal();
}
</script>

<style scoped></style>
