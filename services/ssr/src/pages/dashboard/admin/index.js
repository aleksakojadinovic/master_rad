import { useStoreUser } from '@/api/auth';
import { wrapper } from '@/redux/store';
import React from 'react';

function AdminDashboardPage() {
  return <div>AdminDashboardPage</div>;
}

export default AdminDashboardPage;

export const getServerSideProps = wrapper.getServerSideProps((store) => () => {
  const { isAdministator, isSuperAdministrator } = useStoreUser(store);

  if (!isAdministator && !isSuperAdministrator) {
    return {
      redirect: {
        destination: '/404',
      },
    };
  }

  return {};
});
