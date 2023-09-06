import { useStoreUser } from '@/api/auth';
import { wrapper } from '@/redux/store';
import React from 'react';

function IndexPage() {
  return <div>TODO: unlogged users</div>;
}

export default IndexPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const {
      isLoggedIn,
      isAgent,
      isAdministator,
      isSuperAdministrator,
      isCustomer,
    } = useStoreUser(store);
    if (!isLoggedIn) {
      return {};
    }
    if (isAgent) {
      return {
        redirect: {
          destination: '/dashboard/agent',
        },
      };
    }
    if (isAdministator || isSuperAdministrator) {
      return {
        redirect: {
          destination: '/dashboard/admin',
        },
      };
    }
    if (isCustomer) {
      return {
        redirect: {
          destination: '/dashboard/customer',
        },
      };
    }
  },
);
