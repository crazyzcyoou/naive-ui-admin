import { Alova } from '@/utils/http/alova/index';

export interface ResumeItem {
  id: number;
  demandId: number;
  name: string;
  status: number;
  [key: string]: any;
}

export function getSupplyList(params?) {
  return Alova.Get<{ list: ResumeItem[] }>('/v1/supply/list', { params });
}

export function updateResume(id: number, params: Partial<ResumeItem>) {
  return Alova.Post(`/supply/update/${id}`, { params });
}

export function toggleResume(id: number) {
  return Alova.Post(`/supply/toggle/${id}`);
}

export function uploadResume(params: Record<string, any>) {
  return Alova.Post('/supply/upload', { params });
}
