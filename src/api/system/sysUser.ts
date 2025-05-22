import { Alova } from '@/utils/http/alova/index';

export interface SysUserItem {
  id: number;
  username: string;
  email: string;
  status: number;
  [key: string]: any;
}

export function getUserList(params?) {
  return Alova.Get<{ list: SysUserItem[] }>('/user/list', { params });
}

export function toggleUser(id: number) {
  return Alova.Post(`/user/toggle/${id}`);
}
