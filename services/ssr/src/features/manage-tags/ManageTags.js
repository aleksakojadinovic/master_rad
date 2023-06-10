import {
  selectGetTicketTagGroupsQueryResponse,
  useGetTicketTagGroupsQuery,
} from '@/api/ticket-tag-groups';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import TicketTagGroup from './components/TicketTagGroup';

function ManageTags() {
  const { isLoading, isFetching } = useGetTicketTagGroupsQuery();
  const ticketTagGroups = useSelector(selectGetTicketTagGroupsQueryResponse);

  if (isLoading || isFetching) {
    return 'Loading...';
  }

  return (
    <Fragment>
      {ticketTagGroups.map((group) => (
        <TicketTagGroup key={group.id} {...group} />
      ))}
    </Fragment>
  );
}

export default ManageTags;
