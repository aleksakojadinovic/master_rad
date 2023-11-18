import React, { Fragment, useMemo, useState } from 'react';
import CommentEditor from '../components/CommentEditor';
import { useAddCommentMutation } from '@/api/tickets';
import { TicketStatus } from '@/enums/tickets';
import useUser from '@/hooks/useUser';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useIntl } from 'react-intl';
import { ticketViewMessages } from '@/translations/ticket-view';
import { INTERNAL_TICKET_COLOR } from '../constants';

function TicketCommentSection({ ticket }) {
  const { isCustomer } = useUser();
  const intl = useIntl();

  const [isInternal, setIsInternal] = useState(false);

  const toggleInternal = () => setIsInternal((internal) => !internal);

  // TODO: this needs BE support
  const canAddComment = useMemo(() => {
    return (
      ticket.status !== TicketStatus.CLOSED &&
      ticket.status !== TicketStatus.RESOLVED
    );
  }, [ticket]);

  // const [updateTicket, { isLoading, isSuccess }] = useUpdateTicketMutation({
  //   fixedCacheKey: 'ticket-view-page',
  // });

  const [addComment, { isLoading, isSuccess }] = useAddCommentMutation();

  const handleSubmitComment = (comment) => {
    addComment({ id: ticket.id, body: comment, isInternal });
    // updateTicket({ id: ticket.id, comment, isCommentInternal: isInternal });
  };

  const sectionStyle = useMemo(() => {
    if (isCustomer) {
      return {};
    }
    return isInternal ? { backgroundColor: INTERNAL_TICKET_COLOR } : {};
  }, [isInternal, isCustomer]);

  const renderInternalPicker = () => {
    if (isCustomer) {
      return null;
    }
    return (
      <ToggleButtonGroup value={isInternal} exclusive onChange={toggleInternal}>
        <ToggleButton value={false} color="primary">
          {intl.formatMessage(ticketViewMessages.publicCommentButtonText)}
        </ToggleButton>
        <ToggleButton value={true} color="primary">
          {intl.formatMessage(ticketViewMessages.internalCommentButtonText)}
        </ToggleButton>
      </ToggleButtonGroup>
    );
  };

  return (
    <Box sx={sectionStyle}>
      {canAddComment && (
        <Fragment>
          {renderInternalPicker()}
          <CommentEditor
            onSubmit={handleSubmitComment}
            isSubmitDisabled={isLoading}
            isSuccess={isSuccess}
            isInternal={isInternal}
          />
        </Fragment>
      )}
      {!canAddComment && (
        <Box>
          <Typography variant="body1">
            {intl.formatMessage(ticketViewMessages.cannotCommentOnThisTicket)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default TicketCommentSection;
