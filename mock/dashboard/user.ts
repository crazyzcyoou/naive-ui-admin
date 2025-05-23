import { defineMock } from '@alova/mock';
import { faker } from '@faker-js/faker';
import { resultSuccess } from '../_util';
import { adminToken } from '../user';

function makeUser() {
  return {
    id: faker.string.numeric(4),
    username: faker.internet.userName(),
    demandCount: faker.number.int({ min: 1, max: 20 }),
    resumeCount: faker.number.int({ min: 1, max: 50 }),
  };
}

export default defineMock({
  '/v1/user/dashboard': ({ headers }) => {
    const isAdmin = headers?.token === adminToken;
    const list = isAdmin ? Array.from({ length: 5 }, makeUser) : [makeUser()];
    return resultSuccess({ list });
  },
});
