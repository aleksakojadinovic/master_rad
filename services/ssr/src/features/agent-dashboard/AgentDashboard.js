import useUser from '@/hooks/useUser';
import { globalMessages } from '@/translations/global';
import { Box, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';
import TicketPredefinedSearch from '../ticket-predefined-search/TicketPredefinedSearch';
import { getMyInProgressParams, getMyOpenParams } from './utils';
import { agentDashboardMessages } from '@/translations/agent-dashboard';

function AgentDashboard() {
  const intl = useIntl();
  const { id, firstName } = useUser();

  const myOpenParams = getMyOpenParams(id);
  const myInProgressParams = getMyInProgressParams(id);

  return (
    <Box>
      <Box marginBottom="12px">
        <Typography variant="h1" fontSize="36px">
          {intl.formatMessage(globalMessages.welcomeBack, { user: firstName })}
        </Typography>
      </Box>
      <Divider />
      <Box marginBottom="12px">
        <Grid container>
          <Grid item xs={12} md={6} overflow="scroll" minHeight="500px">
            <Box padding="6px">
              <Typography variant="body1" fontSize="24px">
                {intl.formatMessage(agentDashboardMessages.sectionTitleMyOpen)}
              </Typography>
              <TicketPredefinedSearch initialFilters={myOpenParams} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box padding="6px" minHeight="500px">
              <Typography variant="body1" fontSize="24px">
                {intl.formatMessage(
                  agentDashboardMessages.sectionTitleMyInProgress,
                )}
              </Typography>
              <TicketPredefinedSearch initialFilters={myInProgressParams} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            tjhree
          </Grid>
          <Grid item xs={12} md={6}>
            four
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AgentDashboard;
