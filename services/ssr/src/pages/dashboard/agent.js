import { useStoreUser } from '@/api/auth';
import { wrapper } from '@/redux/store';
import React from 'react';

function AgentDashboardPage() {
  return <div>AgentDashboardPage</div>;
}

export default AgentDashboardPage;

export const getServerSideProps = wrapper.getServerSideProps((store) => () => {
  const { isAgent } = useStoreUser(store);

  if (!isAgent) {
    return {
      redirect: {
        destination: '/404',
      },
    };
  }
});
