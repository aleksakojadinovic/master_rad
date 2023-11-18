import { Box } from '@mui/material';
import React from 'react';
import TagForm from '../components/TagForm';
import { useAddTagsMutation, useRemoveTagsMutation } from '@/api/tickets';

function TicketTagSection({ ticket }) {
  const [addTags] = useAddTagsMutation();
  const [removeTags] = useRemoveTagsMutation();

  const handleAddTag = (tagId) => {
    addTags({ id: ticket.id, tagIds: [tagId] });
  };

  const handleDeleteTag = (tagId) => {
    removeTags({ id: ticket.id, tagIds: [tagId] });
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
