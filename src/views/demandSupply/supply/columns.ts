import { h } from 'vue';
import { NSwitch } from 'naive-ui';
import { BasicColumn } from '@/components/Table';
import type { SupplyItem } from '@/api/demandSupply/supply';
import { updateSupplyCtive, resumePreviewCode } from '@/api/demandSupply/supply';

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
          onClick: async () => {
            // 这里可以添加查看简历详情的逻辑
            const res = await resumePreviewCode(record.id);
            window.open(res.path, '_blank');
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
  { 
    title: '分数', 
    key: 'score',
    sorter: true,
    sortOrder: false,
    defaultSortOrder: false,
    render(record) {
      // 如果分数是数字字符串，转换为数字以便正确排序
      const scoreValue = record.score ? parseFloat(record.score) : 0;
      // 返回原始显示值
      return record.score || '0';
    },
  },
  { title: '错误', key: 'err_msg' },
  { title: '警告', key: 'warning_msg' },
  { title: '匹配警告', key: 'match_warning_msg' },
  {
    title: '无效',
    key: 'active',          // 对应行数据里的字段名，可自行调整
    width: 80,
    align: 'center',
    render(row) {
      return h(NSwitch, {
        'value': row.active,
        'onUpdate:value': async (val: boolean) => {
          row.active = val; 
          try {
            await updateSupplyCtive(row.id, val);
          } catch (e) {
            row.active = !val;   
          }
        },
      });
    },
  }
];
