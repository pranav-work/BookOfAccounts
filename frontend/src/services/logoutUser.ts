import { privateApi } from './api';
import { getRefreshToken } from '../utils/token';

export const logoutUser = async () => {
  const refresh = getRefreshToken();

  if (!refresh) {
    return;
  }

  await privateApi.post('logout/', { refresh });
};
