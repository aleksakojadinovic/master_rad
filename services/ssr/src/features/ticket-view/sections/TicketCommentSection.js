import React from 'react';
import CommentEditor from '../components/CommentEditor';
import { useUpdateTicketMutation } from '@/api/tickets';

function TicketCommentSection({ ticket }) {
  const canAddComment = true;

  const [updateTicket, { isLoading, isSuccess }] = useUpdateTicketMutation({
    fixedCacheKey: 'ticket-view-page',
  });

  const handleSubmitComment = (comment) => {
    updateTicket({ id: ticket.id, comment });
  };

  if (!canAddComment) {
    return null;
  }

  return (
    <CommentEditor
      onSubmit={handleSubmitComment}
      isSubmitDisabled={isLoading}
      isSuccess={isSuccess}
    />
  );
}

export default TicketCommentSection;
