import {
  selectTicketTagGroups,
  useGetTicketTagGroupsQuery,
} from '@/api/ticket-tag-groups';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import { useGetRolesQuery } from '@/api/roles';
import { getManageTagsParams } from './utils/params';
import TicketTagGroupPreview from './components/TicketTagGroupPreview';
import { useIntl } from 'react-intl';
import { manageTagsMessages } from '@/translations/tags';

function ManageTags() {
  const intl = useIntl();
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
      <Box display="flex" width="100%" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={() => window.open('/manage/tags/create')}
        >
          {intl.formatMessage(manageTagsMessages.addNewText)}
        </Button>
      </Box>
      {ticketTagGroups.map((group) => (
        <Box key={group.id} sx={{ marginTop: '12px' }}>
          <TicketTagGroupPreview group={group} />
        </Box>
      ))}
    </Fragment>
  );
}

export default ManageTags;
