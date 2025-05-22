import Mock from 'mockjs';
import { resultSuccess } from '../_util';
import { defineMock } from '@alova/mock';

const Random = Mock.Random;

export const adminToken = Random.string('upper', 32, 32);
export const userToken = Random.string('upper', 32, 32);

export const adminInfo = {
  userId: '1',
  username: 'admin',
  realName: 'Admin',
  avatar: Random.image(),
  desc: 'manager',
  password: Random.string('upper', 4, 16),
  token: adminToken,
  permissions: [
    {
      label: '主控台',
      value: 'dashboard_console',
    },
    {
      label: '监控页',
      value: 'dashboard_monitor',
    },
    {
      label: '工作台',
      value: 'dashboard_workplace',
    },
    {
      label: '基础列表',
      value: 'basic_list',
    },
    {
      label: '基础列表删除',
      value: 'basic_list_delete',
    },
    {
      label: '用户仪表盘',
      value: 'user_dashboard',
    },
    {
      label: '后台用户管理',
      value: 'system_user_manage',
    },
  ],
};

export const userInfo = {
  userId: '2',
  username: 'user',
  realName: 'User',
  avatar: Random.image(),
  desc: 'member',
  password: Random.string('upper', 4, 16),
  token: userToken,
  permissions: [
    {
      label: '主控台',
      value: 'dashboard_console',
    },
    {
      label: '用户仪表盘',
      value: 'user_dashboard',
    },
  ],
};

export default defineMock({
  '[POST]/api/login': ({ body }) => {
    const { username } = body as { username: string };
    const token = username === 'admin' ? adminToken : userToken;
    return resultSuccess({ token });
  },
  '/api/admin_info': ({ headers }) => {
    const token = headers?.token;
    const info = token === adminToken ? adminInfo : userInfo;
    return resultSuccess(info);
  },
});
