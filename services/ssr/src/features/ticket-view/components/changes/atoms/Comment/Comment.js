import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/material';
import { INTERNAL_TICKET_COLOR } from '@/features/ticket-view/constants';
import useUser from '@/hooks/useUser';
import CommentHead from './CommentHead';
import CommentBody from './CommentBody/CommentBody';
import CommentActions from './CommentActions';
import { useUpdateCommentMutation } from '@/api/tickets';
import ServerActionSnackbar from '@/components/ServerActionSnackbar/ServerActionSnackbar';
import { useIntl } from 'react-intl';
import { queryStatusMessages } from '@/translations/query-statuses';
import { globalMessages } from '@/translations/global';
import AreYouSureDialog from '@/components/AreYouSure/AreYouSureDialog';
import { ticketViewMessages } from '@/translations/ticket-view';

export default function Comment({ item: comment, ticket }) {
  const intl = useIntl();
  const { id } = useUser();
  const isCommentOwner = id === comment.user.id;

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const styleProp = comment.isInternal
    ? { backgroundColor: INTERNAL_TICKET_COLOR }
    : {};

  const [updateComment, { isLoading, isSuccess, isError, error }] =
    useUpdateCommentMutation();

  useEffect(() => {
    if (isSuccess || isError) {
      setIsEditing(false);
    }
  }, [isSuccess, isError]);

  const handleUpdateComment = (newBody) => {
    updateComment({
      id: ticket.id,
      commentId: comment.commentId,
      body: newBody,
    });
  };

  return (
    <div id={comment.commentId ?? ''} style={styleProp}>
      <AreYouSureDialog
        open={isDeleting}
        title={intl.formatMessage(
          ticketViewMessages.areYouSureDeleteCommentTitle,
        )}
        body={intl.formatMessage(
          ticketViewMessages.areYouSureDeleteCommentBody,
        )}
        onClose={() => setIsDeleting(false)}
        onYes={() => {}}
      />
      <ServerActionSnackbar
        error={error}
        isLoading={isLoading}
        isError={isError}
        isSuccess={isSuccess}
        successMessage={intl.formatMessage(
          queryStatusMessages.updateSuccessfulX,
          { x: intl.formatMessage(globalMessages.comment) },
        )}
      />
      <Card sx={styleProp}>
        {isCommentOwner && (
          <CommentActions
            onEditClick={() => setIsEditing(true)}
            onDeleteClick={() => setIsDeleting(true)}
          />
        )}
        <CardContent>
          <CommentHead comment={comment} />

          <Box marginTop="12px">
            <CommentBody
              comment={comment}
              isEditing={isEditing}
              onSave={handleUpdateComment}
              onCancel={() => setIsEditing(false)}
            />
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
