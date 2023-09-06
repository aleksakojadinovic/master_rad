import { useStoreUser } from '@/api/auth';
import { wrapper } from '@/redux/store';
import React from 'react';

function CustomerDashboardPage() {
  return <div>DashboardPage</div>;
}

export default CustomerDashboardPage;

export const getServerSideProps = wrapper.getServerSideProps((store) => () => {
  const { isCustomer } = useStoreUser(store);

  if (!isCustomer) {
    return {
      redirect: {
        destination: '/404',
      },
    };
  }
});
