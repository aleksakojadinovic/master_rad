import { useStoreUser } from '@/api/auth';
import { ticketTagSystemSlice } from '@/api/ticket-tag-system';
import ManageTagsLayout from '@/features/manage-tags/Layout';
import ManageTags from '@/features/manage-tags/ManageTags';
import { getManageTagsParams } from '@/features/manage-tags/utils/params';
import { wrapper } from '@/redux/store';
import api from '@/services/api';
import { manageTagsMessages } from '@/translations/tags';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function ManageTagsRoute() {
  const intl = useIntl();
  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(manageTagsMessages.title)}</title>
      </Head>
      <ManageTags />
    </Fragment>
  );
}

export default ManageTagsRoute;

ManageTagsRoute.Layout = ManageTagsLayout;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const { isAdministrator } = useStoreUser(store);
    if (!isAdministrator) {
      return {
        notFound: true,
      };
    }

    const params = getManageTagsParams();

    store.dispatch(
      ticketTagSystemSlice.endpoints.getTicketTagGroups.initiate(params),
    );

    await Promise.all(store.dispatch(api.util.getRunningQueriesThunk()));

    return {
      props: {
        isHomePage: true,
      },
    };
  },
);
