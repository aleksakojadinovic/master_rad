import { Box, IconButton, Tooltip } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { ticketViewMessages } from '@/translations/ticket-view';
import ArrowCircleUpTwoToneIcon from '@mui/icons-material/ArrowCircleUpTwoTone';
import ArrowCircleDownTwoToneIcon from '@mui/icons-material/ArrowCircleDownTwoTone';
function StickyPanel() {
  const intl = useIntl();
  const ref = useRef();

  useEffect(() => {
    ref.current = document.getElementById('ticket-view');
  }, []);

  const handleGoToTop = () => {
    ref?.current?.scrollIntoView({
      behaviour: 'smooth',
      block: 'start',
    });
  };

  const handleGoToEnd = () => {
    ref?.current?.scrollIntoView({
      behaviour: 'smooth',
      block: 'end',
    });
  };

  return (
    <Box
      position="fixed"
      right="0"
      top="50%"
      width="40px"
      borderRadius="3px"
      display="flex"
      flexDirection="column"
      padding="3px"
      sx={{ backgroundColor: 'rgba(33, 33, 33, 0.3)' }}
    >
      <Box marginBottom="6px">
        <Tooltip
          title={intl.formatMessage(ticketViewMessages.goToTop)}
          placement="top-start"
        >
          <IconButton onClick={handleGoToTop}>
            <ArrowCircleUpTwoToneIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Box>
      <Tooltip title={intl.formatMessage(ticketViewMessages.goToBottom)}>
        <Box marginBottom="6px">
          <IconButton onClick={handleGoToEnd}>
            <ArrowCircleDownTwoToneIcon color="primary" />
          </IconButton>
        </Box>
      </Tooltip>
    </Box>
  );
}

export default StickyPanel;
