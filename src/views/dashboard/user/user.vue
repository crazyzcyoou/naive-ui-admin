<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable
      title="用户数据"
      :columns="columns"
      :request="loadData"
      :row-key="(row) => row.id"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { getUserDashboard } from '@/api/dashboard/user';
  import { columns } from './columns';

  const params = reactive({});

  const loadData = async (res) => {
    return await getUserDashboard({ ...params, ...res });
  };
</script>

<style scoped></style>
