import { useStoreUser } from '@/api/auth';
import { wrapper } from '@/redux/store';
import React from 'react';

function IndexPage() {
  return <div>TODO: unlogged users</div>;
}

export default IndexPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const { isLoggedIn, isAgent, isAdministrator, isCustomer } =
      useStoreUser(store);
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
    if (isAdministrator) {
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
