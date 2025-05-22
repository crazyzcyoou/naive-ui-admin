import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface UserItem {
  id: number;
  username: string;
  email: string;
  status: number;
}

export const columns: BasicColumn<UserItem>[] = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '用户名', key: 'username' },
  { title: '邮箱', key: 'email' },
  {
    title: '状态',
    key: 'status',
    render(row) {
      return h(
        NTag,
        { type: row.status ? 'success' : 'error' },
        { default: () => (row.status ? '启用' : '禁用') }
      );
    },
  },
];
