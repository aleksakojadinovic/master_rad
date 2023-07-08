import { rolesSlice } from '@/api/roles';
import {
  ticketTagGroupsSlice,
  useGetTicketTagGroupQuery,
} from '@/api/ticket-tag-groups';
import TicketTagGroupAdmin from '@/features/manage-tags/components/TicketTagGroupAdmin';
import { wrapper } from '@/redux/store';
import api from '@/services/api';
import { manageTagsMessages } from '@/translations/tags';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function EditTagGroupRoute({ id }) {
  const intl = useIntl();
  const { data: tagGroup } = useGetTicketTagGroupQuery({
    id,
    includes: ['tags', 'role'],
  });
  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(manageTagsMessages.editSingleTitle)}</title>
      </Head>
      <TicketTagGroupAdmin group={tagGroup} />
    </Fragment>
  );
}

export default EditTagGroupRoute;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const {
      params: { tagGroupId: id },
    } = context;
    store.dispatch(
      ticketTagGroupsSlice.endpoints.getTicketTagGroup.initiate({
        id,
        includes: ['tags', 'role'],
      }),
    );

    store.dispatch(rolesSlice.endpoints.getRoles.initiate());

    await Promise.all(store.dispatch(api.util.getRunningQueriesThunk()));
    return {
      props: { id },
    };
  },
);