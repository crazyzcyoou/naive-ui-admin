import { Alova } from '@/utils/http/alova/index';

export interface UserDashboardItem {
  id: number;
  username: string;
  demandCount: number;
  resumeCount: number;
}

export function getUserDashboard(params?) {
  return Alova.Get<{ list: UserDashboardItem[] }>('/dashboard/user', { params });
}
