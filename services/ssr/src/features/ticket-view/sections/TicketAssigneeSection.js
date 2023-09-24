import { Box, Button, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import TicketAssignees from '../components/TicketAssignees';
import {
  useAddAssigneesMutation,
  useRemoveAssigneesMutation,
} from '@/api/tickets';
import { useIntl } from 'react-intl';
import { assignMessages } from '@/translations/assign';
import UserPicker from '../components/UserPicker';
import useUser from '@/hooks/useUser';
import { ticketViewMessages } from '@/translations/ticket-view';

function TicketAssigneeSection({ ticket }) {
  const intl = useIntl();
  const { isCustomer } = useUser();

  const [isVisible, setIsVisible] = useState(false);

  // const [updateTicket] = useUpdateTicketMutation({
  //   fixedCacheKey: 'ticket-view-page',
  // });

  const [addAssignees] = useAddAssigneesMutation();
  const [removeAssignees] = useRemoveAssigneesMutation();

  const handleUnassignUser = (assignedUser) => {
    removeAssignees({ id: ticket.id, assigneeIds: [assignedUser.id] });
    // updateTicket({ id: ticket.id, removeAssignees: [assignedUser.id] });
  };

  const handleAssignUser = (newUser) => {
    addAssignees({ id: ticket.id, assigneeIds: [newUser.id] });
    // updateTicket({ id: ticket.id, addAssignees: [newUser.id] });
  };

  return (
    <Fragment>
      {isVisible && !isCustomer && (
        <UserPicker
          onClose={() => setIsVisible(false)}
          onSelect={(selectedUser) => {
            handleAssignUser(selectedUser);
            setIsVisible(false);
          }}
          formTitle={intl.formatMessage(assignMessages.formTitle)}
        />
      )}
      <Box
        marginLeft="12px"
        marginTop="4px"
        marginBottom="4px"
        marginRight="12px"
        width="100%"
      >
        {isCustomer && (
          <Typography variant="body1">
            {intl.formatMessage(
              ticketViewMessages.ticketAssigneesCustomerNote,
              { count: ticket.assignees.length },
            )}
          </Typography>
        )}
        <TicketAssignees
          assignees={ticket.assignees}
          onDelete={handleUnassignUser}
        />

        {!isCustomer && (
          <Button
            onClick={() => {
              setIsVisible(true);
            }}
          >
            {intl.formatMessage(assignMessages.formTitle)}
          </Button>
        )}
      </Box>
    </Fragment>
  );
}

export default TicketAssigneeSection;
