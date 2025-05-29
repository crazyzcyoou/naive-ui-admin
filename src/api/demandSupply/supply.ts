import { Alova } from '@/utils/http/alova/index';

export interface SupplyItem {
  id: number;
  demandId: number;
  name: string;
  status: number;
  [key: string]: any;
}

export function getSupplyList(params?) {
    return Alova.Get<{ list: SupplyItem[] }>(`/v1/match/list_supply/${params.demandId}`, { params });
}

// 上传简历
export function uploadSupply(params?) {
  return Alova.Post(`/v1/match/upload_resume`);
}

// 更新简历
export function updateSupply(params?) {
  return Alova.Post(`/v1/match/supply/${params.id}`, { params });
}

// 删除简历
export function deleteSupply(id: number) {
  return Alova.Post(`/v1/match/delete_supply/${id}`, { });
}

