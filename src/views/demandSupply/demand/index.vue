<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
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
  // 从后端获取数据
  const data = await getDemandList({ ...params, ...res });

  // 解构拿到必要字段，避免 data.xxx 重复书写
  const { items = [], page = 1, total = 0 } = data;

  // 拼装表格所需的数据结构
  return {
    list: items,
    page: page,
    itemCount: total,
    pageCount: Math.ceil(total / params.pageSize),
    pageSize: params.pageSize,
  };
};


function openAdd() {
  addRef.value.openModal();
}
</script>

<style scoped></style>
