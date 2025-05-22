<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable
      :title="isAdmin ? '所有用户数据' : '我的数据'"
      :columns="columns"
      :request="loadData"
      :row-key="(row) => row.id"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { reactive, computed } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { getUserDashboard } from '@/api/dashboard/user';
  import { useUserStore } from '@/store/modules/user';
  import { columns } from './columns';

  const userStore = useUserStore();
  const isAdmin = computed(() =>
    userStore.getPermissions.some((p) => p.value === 'system_user_manage')
  );

  const params = reactive({});

  const loadData = async (res) => {
    return await getUserDashboard({ ...params, ...res });
  };
</script>

<style scoped></style>
