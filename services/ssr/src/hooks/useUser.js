import { selectGetMeQueryResponse } from '@/api/auth';
import { wrapUser } from '@/utils';
import { useSelector } from 'react-redux';

function useUser() {
  const user = useSelector(selectGetMeQueryResponse);
  const wrappedUser = wrapUser(user);
  return wrappedUser;
}

export default useUser;
