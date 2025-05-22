import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { UserOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/admin',
    name: 'Admin',
    redirect: '/admin/user',
    component: Layout,
    meta: {
      title: '后台管理',
      icon: renderIcon(UserOutlined),
      sort: 99,
    },
    children: [
      {
        path: 'user',
        name: 'admin_user',
        meta: {
          title: '后台用户管理',
          permissions: ['system_user_manage'],
        },
        component: () => import('@/views/admin/user/index.vue'),
      },
    ],
  },
];

export default routes;
