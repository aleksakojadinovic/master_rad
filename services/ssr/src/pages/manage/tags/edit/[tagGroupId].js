import { useStoreUser } from '@/api/auth';
import {
  selectGetTicketTagGroupQueryResponse,
  ticketTagSystemSlice,
  useGetTicketTagGroupQuery,
} from '@/api/ticket-tag-system';
import ManageTagsLayout from '@/features/manage-tags/Layout';
import TicketTagGroupAdmin from '@/features/manage-tags/components/TicketTagGroupAdmin';
import { wrapper } from '@/redux/store';
import api from '@/services/api';
import { manageTagsMessages } from '@/translations/tags';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function EditTagGroupRoute({ id, tagGroup }) {
  const intl = useIntl();

  useGetTicketTagGroupQuery({
    id,
    includes: ['tags'],
  });

  return (
    <Fragment>
      <Head>
        <title>
          {intl.formatMessage(manageTagsMessages.editSingleTitle, {
            tagName: tagGroup.name,
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
    const { isAdministrator } = useStoreUser(store);

    if (!isAdministrator) {
      return {
        notFound: true,
      };
    }
    const {
      params: { tagGroupId: id },
    } = context;

    store.dispatch(
      ticketTagSystemSlice.endpoints.getTicketTagGroup.initiate({
        id,
        includes: ['tags'],
      }),
    );

    await Promise.all(store.dispatch(api.util.getRunningQueriesThunk()));

    const tagGroup = selectGetTicketTagGroupQueryResponse(store.getState(), {
      id,
      includes: ['tags'],
    });

    return {
      props: { id, isEditPage: true, tagGroup },
    };
  },
);
