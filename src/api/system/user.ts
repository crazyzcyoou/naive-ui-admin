import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return Alova.Get<InResult>('/v1/user/info', {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 用户登录
 */
export function login(params) {
  const body = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) =>
    body.append(key, String(value))
  );
  return Alova.Post<InResult>(
    '/v1/user/login',
    body,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params) {
  return Alova.Post('/v1/user/reset_password', { params });
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return Alova.Post('/v1/user/logout', {
    params,
  });
}
