import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import UserChip from '../../../../../../components/User/UserChip';
import { formatDate } from '@/utils';
import { INTERNAL_TICKET_COLOR } from '@/features/ticket-view/constants';
import { useIntl } from 'react-intl';
import { ticketViewMessages } from '@/translations/ticket-view';

export default function Comment({ comment }) {
  const intl = useIntl();

  const styleProp = comment.isInternal
    ? { backgroundColor: INTERNAL_TICKET_COLOR }
    : {};

  return (
    <div id={comment.commentId ?? ''} style={styleProp}>
      <Card sx={styleProp}>
        <CardContent>
          <Box
            display="flex"
            sx={{
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'normal', md: 'center' },
            }}
          >
            <Box>
              <UserChip user={comment.user} includeRole />
            </Box>
            <Box sx={{ marginLeft: { xs: 0, md: '12px' } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {formatDate(comment.timestamp)}
              </Typography>
            </Box>
            {comment.isInternal && (
              <Tooltip
                title={intl.formatMessage(
                  ticketViewMessages.internalCommentNote,
                )}
                placement="top"
              >
                <Box
                  sx={{
                    marginLeft: { xs: 0, md: '12px' },
                    display: 'inline-block',
                  }}
                >
                  <Chip label="INTERNAL" color="warning" />
                </Box>
              </Tooltip>
            )}
          </Box>

          <Box marginTop="12px">
            <Typography variant="body2">{comment.body}</Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
