import { selectGetMeQueryResponse } from '@/api/auth';
import { wrapper } from '@/redux/store';
import React from 'react';

function IndexPage() {
  return <div>IndexPage</div>;
}

export default IndexPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const user = selectGetMeQueryResponse(store.getState());
    if (user != null) {
      return {
        redirect: {
          destination: '/dashboard',
        },
      };
    }
    return {};
  },
);
