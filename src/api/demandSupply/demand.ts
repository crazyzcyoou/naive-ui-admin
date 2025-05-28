import { Alova } from '@/utils/http/alova/index';

export interface DemandItem {
  id: number;
  demand_txt: string;
  work_location: string;
  attendance?: string;
  create_time?: string;
  update_time?: string;
  resume_count?: number;
  japanese_level?: string;
  english_level?: string;
  citizenship?: string;
  price?: string | number;
  toggle?: number | boolean;
  [key: string]: any;
}

export function getDemandList(params?) {
  return Alova.Get<{ list: DemandItem[] }>('/v1/match/list_demand', { params });
}

export function getDemandInfo(id: number) {
  
}

export function updateDemand(id: number, params: Partial<DemandItem>) {
  return Alova.Post(`/demand/update/${id}`, { params });
}

export function toggleDemand(id: number) {
  return Alova.Post(`/demand/toggle/${id}`);
}

export function uploadDemand(params: Record<string, any>) {
  return Alova.Post('/demand/upload', { params });
}
