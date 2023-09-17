import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import { TICKET_HISTORY_ENTRY_TYPE } from '../constants';
import TicketChange from '../components/changes/TicketChange';

function TicketTimelineSection({ ticket }) {
  const timelineItems = useMemo(() => {
    const allItems = [
      ...ticket.comments.map((item) => ({
        ...item,
        type: TICKET_HISTORY_ENTRY_TYPE.COMMENT_ADDED,
      })),
      ...ticket.statusChanges.map((item) => ({
        ...item,
        type: TICKET_HISTORY_ENTRY_TYPE.STATUS_CHANGED,
      })),
      ...ticket.assigneeChanges.map((item) => ({
        ...item,
        type: TICKET_HISTORY_ENTRY_TYPE.ASSIGNEES_CHANGED,
      })),
    ];
    allItems.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return allItems;
  }, [ticket]);

  return timelineItems.map((item, index) => (
    <Box key={index} marginTop="12px">
      <TicketChange item={item} ticket={ticket} />
    </Box>
  ));
}

export default TicketTimelineSection;
