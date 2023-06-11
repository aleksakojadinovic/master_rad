import {
  selectTicketTagGroups,
  useGetTicketTagGroupsQuery,
} from '@/api/ticket-tag-groups';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import TicketTagGroupAdmin from './components/TicketTagGroupAdmin';
import { Box } from '@mui/material';
import { useGetRolesQuery } from '@/api/roles';
import { getManageTagsParams } from './utils/params';

function ManageTags() {
  const { isLoading: isTagGroupsLoading, isFetching: isTagGroupsFetching } =
    useGetTicketTagGroupsQuery(getManageTagsParams());

  const { isLoading: isRolesLoading, isFetching: isRolesFetching } =
    useGetRolesQuery();

  const ticketTagGroups = useSelector((state) =>
    selectTicketTagGroups(state, getManageTagsParams()),
  );

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
          <TicketTagGroupAdmin group={group} />
        </Box>
      ))}
    </Fragment>
  );
}

export default ManageTags;
