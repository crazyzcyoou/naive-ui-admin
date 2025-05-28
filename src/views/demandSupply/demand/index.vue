<template>
  <n-card :bordered="false" class="proCard full-height-table">
    <BasicTable
      ref="resumeRef"
      :columns="demandColumns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      :striped="true"
    >
      <template #tableTitle>
        <n-button type="primary" @click="openAdd">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </template>
    </BasicTable>
  </n-card>
</template>

<script lang="ts" setup>
import { getDemandList } from '@/api/demandSupply/demand';
import { BasicTable } from '@/components/Table';
import { reactive, ref, onMounted } from 'vue';
import { PlusOutlined } from '@vicons/antd';
import { demandColumns } from './columns';
import { NButton } from 'naive-ui';

const resumeRef = ref();
const params = reactive({
  pageSize: 10,
});
const addRef = ref();

const loadDataTable = async (res) => {
  const data = await getDemandList({ ...params, ...res });
  const { items = [], page = 1, total = 0 } = data;
  return {
    list: items,
    page,
    itemCount: total,
    pageCount: Math.ceil(total / params.pageSize),
    pageSize: params.pageSize,
  };
};

function openAdd() {
  addRef.value.openModal();
}

function reloadTable() {
  resumeRef.value?.reload();
}

onMounted(() => {
  reloadTable();
});
</script>

<!-- 把路径指向上一级目录 -->
<style scoped src="./demand-supply.css"></style>
