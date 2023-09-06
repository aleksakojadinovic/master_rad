import { useUpdateTicketMutation } from '@/api/tickets';
import { TICKET_STATUS_GRAPH } from '@/constants/status-map';
import useUser from '@/hooks/useUser';
import { globalMessages } from '@/translations/global';
import { ticketStatusMessages } from '@/translations/statuses';
import { Box, Button, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

function TicketStatusSection({ ticket }) {
  const intl = useIntl();
  const [isStatusListVisible, setIsStatusListVisible] = useState(false);
  const { hasAnyRole } = useUser();

  const statusChangesExplained = TICKET_STATUS_GRAPH[ticket.status].map(
    (entry) => {
      const isAllowed = hasAnyRole(entry.roles);
      return { ...entry, isAllowed };
    },
  );

  const [updateTicket] = useUpdateTicketMutation({
    fixedCacheKey: 'ticket-view-page',
  });

  const handleUpdateStatus = (targetStatus) => {
    updateTicket({ id: ticket.id, status: targetStatus }).then(() =>
      setIsStatusListVisible(false),
    );
  };

  return (
    <Box marginLeft="12px" marginTop="12px">
      {isStatusListVisible && (
        <Box>
          {statusChangesExplained.map(({ target, isAllowed, roles }) => {
            const wrap = isAllowed
              ? (x) => x
              : (x) => (
                  <Tooltip
                    title={intl.formatMessage(
                      ticketStatusMessages.notAllowedNote,
                      { roles: roles.join(', ') },
                    )}
                    placement="top"
                  >
                    {x}
                  </Tooltip>
                );
            return (
              <Box key={target} marginBottom="6px">
                {wrap(
                  <Box display="inline-block">
                    <Button
                      variant="contained"
                      disabled={!isAllowed}
                      onClick={() => handleUpdateStatus(target)}
                    >
                      {intl.formatMessage(ticketStatusMessages.moveTo, {
                        status: intl.formatMessage(
                          ticketStatusMessages[target],
                        ),
                      })}
                    </Button>
                  </Box>,
                )}
              </Box>
            );
          })}
        </Box>
      )}
      <Button onClick={() => setIsStatusListVisible((visible) => !visible)}>
        {isStatusListVisible
          ? intl.formatMessage(globalMessages.cancel)
          : intl.formatMessage(ticketStatusMessages.changeStatus)}
      </Button>
    </Box>
  );
}

export default TicketStatusSection;
