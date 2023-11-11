import { selectGetMeQueryResponse } from '@/api/auth';
import { wrapper } from '@/redux/store';
import React from 'react';

function IndexPage() {
  return <div>IndexPage</div>;
}

export default IndexPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const user = selectGetMeQueryResponse(store.getState());
    if (user == null) {
      return {};
    }
    if (user.roles.map(({ name }) => name).includes('agent')) {
      return {
        redirect: {
          destination: '/dashboard',
        },
      };
    }
    if (user.roles.map(({ name }) => name).includes('customer')) {
      return {
        redirect: {
          destination: '/customer',
        },
      };
    }
  },
);
