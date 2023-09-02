import { Box } from '@mui/material';
import React from 'react';
import TagForm from '../components/TagForm';
import { useUpdateTicketMutation } from '@/api/tickets';

function TicketTagSection({ ticket }) {
  const [updateTicket] = useUpdateTicketMutation({
    fixedCacheKey: 'ticket-view-page',
  });

  const handleAddTag = (tagId) => {
    updateTicket({ id: ticket.id, addTags: [tagId] });
  };

  const handleDeleteTag = (tagId) => {
    updateTicket({ id: ticket.id, removeTags: [tagId] });
  };

  return (
    <Box
      marginLeft="12px"
      marginTop="4px"
      marginBottom="4px"
      marginRight="12px"
      width="100%"
    >
      <TagForm
        ticketTags={ticket.tags}
        onSelect={handleAddTag}
        onDelete={handleDeleteTag}
      />
    </Box>
  );
}

export default TicketTagSection;
