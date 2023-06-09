import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Divider, Grid, Typography } from '@mui/material';
import TicketStatusBadge from './TicketStatusBadge';
import Comment from '../Comment/Comment';
import { formatDate } from '@/utils';
import StatusChange from '../StatusChange/StatusChange';
import CommentEditor from './CommentEditor';
import { useUpdateTicketMutation } from '@/api/tickets';
import { TicketHistoryEntryType } from '@/enums/tickets';

export default function Ticket({ ticket }) {
  const [updateTicket, { isLoading, isSuccess }] = useUpdateTicketMutation();

  const canAddComment = true;

  const handleSubmitComment = (comment) => {
    updateTicket({ id: ticket.id, comment });
  };

  useEffect(() => {}, [isSuccess]);

  const renderChanges = () => {
    const wrap = (content, index) => (
      <Box key={index} sx={{ marginTop: '12px' }}>
        {content}
      </Box>
    );

    let previousStatus = null;

    return ticket.history.map((item, index) => {
      switch (item.type) {
        case TicketHistoryEntryType.COMMENT_ADDED:
          return wrap(
            <Comment
              comment={{
                ...item.payload,
                user: item.user,
                timestamp: item.timestamp,
              }}
            />,
            index,
          );

        case TicketHistoryEntryType.STATUS_CHANGED: {
          const status = item.payload.status;
          const prevStatus = previousStatus;
          previousStatus = status;
          return wrap(
            <Box
              display="flex"
              justifyContent="center"
              marginTop="20px"
              marginBottom="20px"
            >
              <Card>
                <CardContent>
                  <StatusChange
                    statusChange={{
                      user: item.user,
                      timestamp: item.timestamp,
                      statusFrom: prevStatus,
                      statusTo: status,
                    }}
                  />
                </CardContent>
              </Card>
            </Box>,
            index,
          );
        }
      }
    });
  };

  const renderAddComment = () => {
    if (!canAddComment) {
      return null;
    }
    return (
      <Card>
        <CardContent>
          <CommentEditor
            onSubmit={handleSubmitComment}
            isSubmitDisabled={isLoading}
            isSuccess={isSuccess}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container>
          <Grid item xs={12} md={9}>
            <Box display="flex" alignItems="center" height="100%">
              <Typography variant="h4">{ticket.title}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              height="100%"
            >
              <Typography component="div" sx={{ color: 'text.disabled' }}>
                {formatDate(ticket.createdAt)}
              </Typography>
              <Typography component="div" sx={{ color: 'secondary.main' }}>
                by {ticket.createdBy.firstName} {ticket.createdBy.lastName}
              </Typography>
              <TicketStatusBadge status={ticket.status} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography variant="body1">{ticket.body}</Typography>
      </CardContent>
      <CardContent>{renderChanges()}</CardContent>
      <Box sx={{ marginTop: '12px' }}>
        <Divider />
        {renderAddComment()}
      </Box>
    </Card>
  );
}
