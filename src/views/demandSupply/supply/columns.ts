import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';
import type { ResumeItem } from '@/api/demandSupply/supply';

export const resumeColumns: BasicColumn<ResumeItem>[] = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  {
    title: '状态',
    key: 'status',
    render(record) {
      return h(
        NTag,
        { type: record.status ? 'success' : 'warning' },
        { default: () => (record.status ? '已联系' : '待联系') }
      );
    },
  },
];
