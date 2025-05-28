<template>
  <n-card :bordered="false" class="proCard">
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

// 重新加载表格
function reloadTable() {
  resumeRef.value?.reload();
}

onMounted(() => {
  reloadTable();
});
</script>

<style scoped></style>
