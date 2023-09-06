import { Box, Card, CardActions, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

function CustomerDashboard() {
  const router = useRouter();
  const handleCreateNewTicket = () => {
    router.push('/tickets/create');
  };
  return (
    <Box
      display="flex"
      width="100%"
      overflowX="scroll"
      sx={{ cursor: 'pointer' }}
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
  );
}

export default CustomerDashboard;
