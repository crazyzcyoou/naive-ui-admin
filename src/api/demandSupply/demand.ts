import { Alova } from '@/utils/http/alova/index';

export interface DemandItem {
  id: number;
  name: string;
  status: number;
  progress: number;
  [key: string]: any;
}

export function getDemandList(params?) {
  return Alova.Get<{ list: DemandItem[] }>('/v1/demand/list', { params });
}

export function updateDemand(id: number, params: Partial<DemandItem>) {
  return Alova.Post(`/v1/demand/update/${id}`, { params });
}

export function toggleDemand(id: number) {
  return Alova.Post(`/v1/demand/toggle/${id}`);
}

export function uploadDemand(params: Record<string, any>) {
  return Alova.Post('/v1/demand/upload', { params });
}
