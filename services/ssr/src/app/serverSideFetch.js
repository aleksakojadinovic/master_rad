import iFetch from '@/utils/iFetch';
import { cookies } from 'next/headers';

export const useServerSideFetch = async (url, options = {}) => {
  const cookieList = cookies();
  const accessToken = cookieList.get('access_token')?.value ?? null;
  return await iFetch(url, options, accessToken, true);
};
