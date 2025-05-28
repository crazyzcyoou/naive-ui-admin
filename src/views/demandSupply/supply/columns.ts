import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';
import type { SupplyItem } from '@/api/demandSupply/supply';

export const resumeColumns: BasicColumn<SupplyItem>[] = [
  { title: 'ID', key: 'id', width: 80 },
  { 
    title: '简历', 
    key: 'name',
    render(record) {
      return h(
        'a',
        {
          href: 'javascript:void(0)',
          onClick: () => {
            // 这里可以添加查看简历详情的逻辑
            window.open(record.fileUrl, '_blank');
          },
        },
        { default: () => record.name }
      );
    }
  },
  {
    title: '创建日期',
    key: 'create_time',
    width: 120,
    render(record) {
      // 取前 10 位就是日期
      return record.create_time?.slice(0, 10) || '';
    },
  },
  { title: '分析', key: 'analyse' },
  { title: '角色', key: 'role' },
  { title: '得意分野', key: 'specialty' },
  { title: '分数', key: 'score' },
  { title: '错误', key: 'error' },
  { title: '警告', key: 'warning' },
  { title: '匹配警告', key: 'matchWarning' }
];
