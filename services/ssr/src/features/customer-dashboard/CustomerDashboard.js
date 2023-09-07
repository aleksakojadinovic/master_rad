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

function CustomerDashboard() {
  const router = useRouter();
  const handleCreateNewTicket = () => {
    router.push('/tickets/create');
  };

  const { id } = useUser();
  const params = myActiveParams(id);

  return (
    <Box>
      <Box
        display="flex"
        width="100%"
        sx={{ cursor: 'pointer', overflowX: 'scroll' }}
        marginBottom="12px"
        onClick={handleCreateNewTicket}
      >
        <Card>
          <CardContent>
            <Box marginBottom="100px">
              <Typography variant="h4">Need help?</Typography>
            </Box>
          </CardContent>

          <CardActions>
            <Box display="flex" width="100%" justifyContent="flex-end">
              <Typography color="primary" variant="body1">
                Create a new ticket
              </Typography>
            </Box>
          </CardActions>
        </Card>
      </Box>

      <Divider />

      <Box marginTop="12px">
        <Typography variant="body1" fontSize="24px">
          Your active tickets
        </Typography>
        <TicketPredefinedSearch initialFilters={params} />
      </Box>
    </Box>
  );
}

export default CustomerDashboard;
