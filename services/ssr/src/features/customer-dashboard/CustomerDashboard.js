import useUser from '@/hooks/useUser';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { myActiveParams } from './utils';
import TicketPredefinedSearch from '../ticket-predefined-search/TicketPredefinedSearch';
import { useIntl } from 'react-intl';
import { customerDashboardMessages } from '@/translations/customer-dashboard';

function CustomerDashboard() {
  const router = useRouter();
  const intl = useIntl();
  const handleCreateNewTicket = () => {
    router.push('/tickets/create');
  };

  const { id } = useUser();
  const params = myActiveParams(id);

  return (
    <Box>
      <Box display="flex" marginBottom="12px">
        <Card
          sx={{ maxWidth: '200px', cursor: 'pointer' }}
          onClick={handleCreateNewTicket}
        >
          <CardContent>
            <Box marginBottom="100px">
              <Typography variant="h4">
                {intl.formatMessage(customerDashboardMessages.needHelp)}
              </Typography>
            </Box>
          </CardContent>

          <CardActions>
            <Box display="flex" width="100%" justifyContent="flex-end">
              <Typography color="primary" variant="body1">
                {intl.formatMessage(customerDashboardMessages.createNewTicket)}
              </Typography>
            </Box>
          </CardActions>
        </Card>
      </Box>

      <Divider />

      <Box marginTop="12px">
        <Typography variant="body1" fontSize="24px">
          {intl.formatMessage(customerDashboardMessages.yourActiveTickets)}
        </Typography>
        <TicketPredefinedSearch initialFilters={params} />
      </Box>
    </Box>
  );
}

export default CustomerDashboard;
