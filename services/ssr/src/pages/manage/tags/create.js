import { rolesSlice } from '@/api/roles';
import CreateOrEditTagGroups from '@/features/manage-tags/components/CreateOrEditTag';
import { wrapper } from '@/redux/store';
import api from '@/services/api';
import React from 'react';

function CreateTagRoute() {
  return (
    <div>
      <CreateOrEditTagGroups isCreate />
    </div>
  );
}

export default CreateTagRoute;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    store.dispatch(rolesSlice.endpoints.getRoles.initiate());

    await Promise.all(store.dispatch(api.util.getRunningQueriesThunk()));
  },
);
