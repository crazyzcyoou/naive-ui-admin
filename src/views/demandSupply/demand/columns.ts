import { h } from 'vue';
import router from '@/router';
import { NSwitch, NTag } from 'naive-ui'
import { BasicColumn } from '@/components/Table';
import { updateDemandCtive } from '@/api/demandSupply/demand';



const statusMap = {
  close: '已取消',
  refuse: '已拒绝',
  pass: '已通过',
};

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
  { title: '需求文', key: 'demand_txt', width: 120 },
  { title: '工作地点', key: 'work_location', width: 120 },
  { title: '出勤/(在宅+出勤)', key: 'work_percent' },
  { 
    title: '创建时间', 
    key: 'create_time', 
    width: 120,
    render(record) {
      // 取前 10 位就是日期
      return record.create_time?.slice(0, 10) || '';
    },
  },
  { 
    title: '更新时间', 
    key: 'update_time', 
    width: 120,
    render(record) {
      // 取前 10 位就是日期
      return record.update_time?.slice(0, 10) || '';
    },
  },
  { title: '简历数量', key: 'supply_count' },
  { title: '日语', key: 'japanese_level' },
  { title: '英语', key: 'english_level' },
  { title: '国籍', key: 'citizenship' },
  { title: '价格', key: 'price' },
  {
    title: '无效',
    key: 'active',          // 对应行数据里的字段名，可自行调整
    width: 80,
    align: 'center',
    render(row) {
      return h(NSwitch, {  
        'value': row.active,           // Naive UI 用 value / update:value
        'onUpdate:value': async (val: boolean) => {
          row.active = val;              // 本地立即变更
          try {
            console.log(row.id, val);
            await updateDemandCtive(row.id, val);
          } catch (e) {
            row.active = !val; 
          }
        },
      });
    },
  }
];
