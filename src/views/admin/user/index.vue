<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable
      :columns="columns"
      :request="loadData"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
    />
  </n-card>
</template>

<script lang="ts" setup>
import { reactive, ref, h } from 'vue';
import { useMessage } from 'naive-ui';
import { BasicTable, TableAction } from '@/components/Table';
import { getUserList, toggleUser } from '@/api/system/sysUser';
import { columns } from '@/views/system/user/columns';

const message = useMessage();
const actionRef = ref();

const params = reactive({ pageSize: 10 });

const loadData = async (res) => {
  return await getUserList({ ...params, ...res });
};

function handleToggle(record) {
  toggleUser(record.id).then(() => {
    message.success('操作成功');
    actionRef.value.reload();
  });
}

const actionColumn = reactive({
  width: 120,
  title: '操作',
  key: 'action',
  fixed: 'right',
  render(record) {
    return h(TableAction, {
      actions: [
        {
          label: record.status ? '禁用' : '启用',
          onClick: handleToggle.bind(null, record),
        },
      ],
      style: 'text',
    });
  },
});
</script>

<style scoped></style>
