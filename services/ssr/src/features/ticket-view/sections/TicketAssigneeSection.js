import { selectGetMeQueryResponse } from '@/api/auth';
import { Box, Button } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import TicketAssignees from '../components/TicketAssignees';
import { useUpdateTicketMutation } from '@/api/tickets';
import { useIntl } from 'react-intl';
import { assignMessages } from '@/translations/assign';
import UserAssignForm from '../components/UserAssignForm';

function TicketAssigneeSection({ ticket }) {
  const intl = useIntl();
  const user = useSelector(selectGetMeQueryResponse);
  const isCustomer = user.roles.map(({ name }) => name).includes('customer');

  const [isVisible, setIsVisible] = useState(false);

  const [updateTicket] = useUpdateTicketMutation({
    fixedCacheKey: 'ticket-view-page',
  });

  const handleUnassignUser = (user) => {
    updateTicket({ id: ticket.id, removeAssignees: [user.id] });
  };

  const handleAssignUser = (user) => {
    updateTicket({ id: ticket.id, addAssignees: [user.id] });
  };

  if (isCustomer) {
    return null;
  }

  return (
    <Fragment>
      {isVisible && (
        <UserAssignForm
          onClose={() => setIsVisible(false)}
          onSelect={(user) => {
            handleAssignUser(user);
            setIsVisible(false);
          }}
        />
      )}
      <Box
        marginLeft="12px"
        marginTop="4px"
        marginBottom="4px"
        marginRight="12px"
        width="100%"
      >
        <TicketAssignees
          assignees={ticket.assignees}
          onDelete={handleUnassignUser}
        />
        <Button
          onClick={() => {
            setIsVisible(true);
          }}
        >
          {intl.formatMessage(assignMessages.formTitle)}
        </Button>
      </Box>
    </Fragment>
  );
}

export default TicketAssigneeSection;
