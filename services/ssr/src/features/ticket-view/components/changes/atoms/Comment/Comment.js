import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import UserChip from '../../../../../../components/User/UserChip';
import { formatDate } from '@/utils';
import { INTERNAL_TICKET_COLOR } from '@/features/ticket-view/constants';
import { useIntl } from 'react-intl';
import { ticketViewMessages } from '@/translations/ticket-view';

export default function Comment({ item }) {
  console.log({ item });
  const intl = useIntl();

  const styleProp = item.isInternal
    ? { backgroundColor: INTERNAL_TICKET_COLOR }
    : {};

  return (
    <div id={item.commentId ?? ''} style={styleProp}>
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
              <UserChip user={item.user} includeRole />
            </Box>
            <Box sx={{ marginLeft: { xs: 0, md: '12px' } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {formatDate(item.timestamp)}
              </Typography>
            </Box>
            {item.isInternal && (
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
            <Typography variant="body2">{item.body}</Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
