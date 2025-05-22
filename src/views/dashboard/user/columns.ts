import { BasicColumn } from '@/components/Table';
import type { UserDashboardItem } from '@/api/dashboard/user';

export const columns: BasicColumn<UserDashboardItem>[] = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '用户名', key: 'username' },
  { title: '需求数量', key: 'demandCount' },
  { title: '简历数量', key: 'resumeCount' },
];
