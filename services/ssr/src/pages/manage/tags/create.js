import ManageTagsLayout from '@/features/manage-tags/Layout';
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

CreateTagRoute.Layout = ManageTagsLayout;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await Promise.all(store.dispatch(api.util.getRunningQueriesThunk()));

    return {
      props: {
        isCreatePage: true,
      },
    };
  },
);
