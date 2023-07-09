import { rolesSlice } from '@/api/roles';
import {
  selectGetTicketTagGroupQueryResponse,
  ticketTagGroupsSlice,
  useGetTicketTagGroupQuery,
} from '@/api/ticket-tag-groups';
import ManageTagsLayout from '@/features/manage-tags/Layout';
import TicketTagGroupAdmin from '@/features/manage-tags/components/TicketTagGroupAdmin';
import { wrapper } from '@/redux/store';
import api from '@/services/api';
import { manageTagsMessages } from '@/translations/tags';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function EditTagGroupRoute({ id, tag }) {
  const intl = useIntl();
  const { data: tagGroup } = useGetTicketTagGroupQuery({
    id,
    includes: ['tags', 'role'],
  });
  return (
    <Fragment>
      <Head>
        <title>
          {intl.formatMessage(manageTagsMessages.editSingleTitle, {
            tagName: tag.name,
          })}
        </title>
      </Head>
      <TicketTagGroupAdmin group={tagGroup} isCreate={false} />
    </Fragment>
  );
}

export default EditTagGroupRoute;

EditTagGroupRoute.Layout = ManageTagsLayout;

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

    const tag = selectGetTicketTagGroupQueryResponse(store.getState(), {
      id,
      includes: ['tags', 'role'],
    });

    return {
      props: { id, isEditPage: true, tag },
    };
  },
);
