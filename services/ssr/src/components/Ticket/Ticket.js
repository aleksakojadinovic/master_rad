import React, { Fragment, useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import TicketStatusBadge from './TicketStatusBadge';
import Comment from '../Comment/Comment';
import { formatDate } from '@/utils';
import StatusChange from '../StatusChange/StatusChange';
import CommentEditor from './CommentEditor';
import { useUpdateTicketMutation } from '@/api/tickets';
import { TicketHistoryEntryType } from '@/enums/tickets';
import TagForm from './TagForm';
import { useSelector } from 'react-redux';
import { selectGetMeQueryResponse } from '@/api/auth';
import { useIntl } from 'react-intl';
import { assignMessages } from '@/translations/assign';
import UserAssignForm from '../User/UserAssignForm';
import UserChip from '../User/UserChip';

export default function Ticket({ ticket }) {
  const intl = useIntl();
  const user = useSelector(selectGetMeQueryResponse);
  const isCustomer = user.roles.map(({ name }) => name).includes('customer');
  const [updateTicket, { isLoading, isSuccess }] = useUpdateTicketMutation();
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);

  const canAddComment = true;

  const handleSubmitComment = (comment) => {
    updateTicket({ id: ticket.id, comment });
  };

  const handleAddTag = (tagId) => {
    updateTicket({ id: ticket.id, addTags: [tagId] });
  };

  const handleDeleteTag = (tagId) => {
    updateTicket({ id: ticket.id, removeTags: [tagId] });
  };

  const handleAssignUser = (user) => {
    updateTicket({ id: ticket.id, addAssignees: [user.id] });
  };

  const handleUnassignUser = (user) => {
    updateTicket({ id: ticket.id, removeAssignees: [user.id] });
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

  const renderAssignButton = () => {
    return (
      <Button
        onClick={() => {
          setIsAssignModalVisible(true);
        }}
      >
        {intl.formatMessage(assignMessages.formTitle)}
      </Button>
    );
  };

  const renderAssigneeSection = () => {
    const hasAssignees = ticket.assignees.length > 0;
    const hasForm = !isCustomer;
    if (!hasAssignees && !hasForm) {
      return null;
    }
    return (
      <Box
        marginLeft="12px"
        marginTop="4px"
        marginBottom="4px"
        marginRight="12px"
        width="100%"
      >
        {hasAssignees && (
          <Box display="flex" flexWrap="wrap">
            {ticket.assignees.map((user) => (
              <Box key={user.id} marginRight="6px">
                <UserChip
                  user={user}
                  onDelete={() => {
                    handleUnassignUser(user);
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
        {hasForm && renderAssignButton()}
      </Box>
    );
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
    <Fragment>
      {isAssignModalVisible && (
        <UserAssignForm
          onClose={() => setIsAssignModalVisible(false)}
          onSelect={(user) => {
            handleAssignUser(user);
            setIsAssignModalVisible(false);
          }}
        />
      )}
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
        {renderAssigneeSection()}
        <Divider />
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
    </Fragment>
  );
}
