import { useStoreUser } from '@/api/auth';
import ManageUsers from '@/features/manage-users/ManageUsers';
import { wrapper } from '@/redux/store';
import React from 'react';

function ManageUsersPage() {
  return <ManageUsers />;
}

export default ManageUsersPage;

export const getServerSideProps = wrapper.getServerSideProps((store) => () => {
  const { isAdministrator } = useStoreUser(store);

  if (!isAdministrator) {
    return {
      redirect: {
        destination: '/404',
      },
    };
  }
});
