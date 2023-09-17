import ManageTagsLayout from '@/features/manage-tags/Layout';
import CreateOrEditTagGroups from '@/features/manage-tags/components/CreateOrEditTag';
import { wrapper } from '@/redux/store';
import api from '@/services/api';
import { manageTagsMessages } from '@/translations/tags';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function CreateTagRoute() {
  const intl = useIntl();
  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(manageTagsMessages.createTagTitle)}</title>
      </Head>
      <CreateOrEditTagGroups isCreate />
    </Fragment>
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
