import React, { Fragment, useMemo, useState } from 'react';
import CommentEditor from '../components/CommentEditor';
import { useUpdateTicketMutation } from '@/api/tickets';
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

function TicketCommentSection({ ticket }) {
  const intl = useIntl();
  const { isSuperAdministrator } = useUser();

  const [isInternal, setIsInternal] = useState(false);

  const toggleInternal = () => setIsInternal((internal) => !internal);

  // TODO: this needs BE support
  const canAddComment = useMemo(() => {
    return ticket.status !== TicketStatus.CLOSED && !isSuperAdministrator;
  }, [ticket, isSuperAdministrator]);

  const [updateTicket, { isLoading, isSuccess }] = useUpdateTicketMutation({
    fixedCacheKey: 'ticket-view-page',
  });

  const handleSubmitComment = (comment) => {
    updateTicket({ id: ticket.id, comment, isCommentInternal: isInternal });
  };

  const sectionStyle = isInternal ? { backgroundColor: '#FFD1DC' } : {};

  return (
    <Box sx={sectionStyle}>
      {canAddComment && (
        <Fragment>
          <ToggleButtonGroup
            value={isInternal}
            exclusive
            onChange={toggleInternal}
          >
            <ToggleButton value={false} color="primary">
              {intl.formatMessage(ticketViewMessages.publicCommentButtonText)}
            </ToggleButton>
            <ToggleButton value={true} color="primary">
              {intl.formatMessage(ticketViewMessages.internalCommentButtonText)}
            </ToggleButton>
          </ToggleButtonGroup>
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
