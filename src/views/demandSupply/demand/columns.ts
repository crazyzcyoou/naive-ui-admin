import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';
import type { DemandItem } from '@/api/demandSupply/demand';
import router from '@/router';

export const demandColumns: BasicColumn[] = [
  { 
    title: 'ID', 
    key: 'id', 
    width: 80,
    render(row) {
      return h(
        'a',
        {
          href: 'javascript:void(0)',
          onClick: () => {
            router.push({
              path: '/demand-supply/supply',
              query: { demandId: row.id }
            });
          },
        },
        { default: () => row.id }
      );
    }
  },
  { title: '需求名称', key: 'name' },
  { title: '需求描述', key: 'description' },
  { title: '工作地点', key: 'work_location', width: 120 },
  { title: '出勤/(在宅+出勤)', key: 'attendance' },
  { title: '创建时间', key: 'create_time', width: 180 },
  { title: '更新时间', key: 'update_time', width: 180 },
  { title: '简历数量', key: 'resume_count' },
  { title: '日语', key: 'japanese_level' },
  { title: '英语', key: 'english_level' },
  { title: '国籍', key: 'citizenship' },
  { title: '价格', key: 'price' },
  { title: '无效', key: 'toggle' },
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
