import {
  selectTicketTagGroups,
  useGetTicketTagGroupsQuery,
} from '@/api/ticket-tag-groups';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import TicketTagGroupAdmin from './components/TicketTagGroupAdmin';
import { Box } from '@mui/material';
import { useGetRolesQuery } from '@/api/roles';

function ManageTags() {
  const { isLoading: isTagGroupsLoading, isFetching: isTagGroupsFetching } =
    useGetTicketTagGroupsQuery();

  const { isLoading: isRolesLoading, isFetching: isRolesFetching } =
    useGetRolesQuery();

  const ticketTagGroups = useSelector(selectTicketTagGroups);

  if (
    isTagGroupsLoading ||
    isTagGroupsFetching ||
    isRolesLoading ||
    isRolesFetching
  ) {
    return 'Loading...';
  }

  return (
    <Fragment>
      {ticketTagGroups.map((group) => (
        <Box key={group.id} sx={{ marginTop: '12px' }}>
          <TicketTagGroupAdmin {...group} />
        </Box>
      ))}
    </Fragment>
  );
}

export default ManageTags;
