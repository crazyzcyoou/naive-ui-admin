import { defineMock } from '@alova/mock';
import { faker } from '@faker-js/faker';
import { doCustomTimes, resultSuccess } from '../_util';

function userList(pageSize: number) {
  const result: any[] = [];
  doCustomTimes(pageSize, () => {
    result.push({
      id: faker.string.numeric(4),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      status: faker.helpers.arrayElement([1, 0]),
    });
  });
  return result;
}

export default defineMock({
  '/v1/user/list': ({ query }) => {
    const { page = 1, pageSize = 10 } = query;
    const list = userList(Number(pageSize));
    const count = 60;
    return resultSuccess({
      page: Number(page),
      pageSize: Number(pageSize),
      pageCount: count,
      itemCount: count * Number(pageSize),
      list,
    });
  },
  '/v1/user/toggle/:id': () => {
    return resultSuccess(true);
  },
});
