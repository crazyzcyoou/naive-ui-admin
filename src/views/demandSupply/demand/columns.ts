import { h } from 'vue';
import { NProgress, NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';
import type { DemandItem } from '@/api/demandSupply/demand';
export const columns = [
  { title: 'ID',  key: 'id', width: 80 },
  { title: '需求内容', key: 'demand_txt', ellipsis: { tooltip: true } },
  { title: '工作地点', key: 'work_location', width: 120 },
];
// export const columns: BasicColumn<DemandItem>[] = [
//   {
//     title: 'ID',
//     key: 'id',
//     width: 80,
//   },
//   {
//     title: '创建时间',
//     key: 'create_time',
//     width: 800,
//   },
  // {
  //   title: '进度',
  //   key: 'progress',
  //   render(record) {
  //     return h(NProgress, {
  //       percentage: record.progress,
  //       showIndicator: true,
  //       height: 16,
  //     });
  //   },
  // },
  // {
  //   title: '状态',
  //   key: 'status',
  //   render(record) {
  //     return h(
  //       NTag,
  //       { type: record.status ? 'success' : 'default' },
  //       { default: () => (record.status ? '启用' : '停用') }
  //     );
  //   },
  // },
// ];
