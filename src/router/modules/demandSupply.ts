import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { TableOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/demand-supply',
    name: 'DemandSupply',
    component: Layout,
    redirect: '/demand-supply/demand',
    meta: {
      title: '需求供给',
      icon: renderIcon(TableOutlined),
      sort: 9,
    },
    children: [
      {
        path: 'demand',
        name: 'demand-list',
        meta: { title: 'Demand 列表' },
        component: () => import('@/views/demandSupply/demand/index.vue'),
      },
      {
        path: 'supply',
        name: 'supply-list',
        meta: { title: 'Supply 列表' },
        component: () => import('@/views/demandSupply/supply/index.vue'),
      },
    ],
  },
];

export default routes;
