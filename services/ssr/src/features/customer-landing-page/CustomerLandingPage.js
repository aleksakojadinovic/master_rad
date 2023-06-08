import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import React, { Fragment } from 'react';

function CustomerLandingPage() {
  return (
    <Fragment>
      <Head>
        <title>Customer | STS</title>
      </Head>
      <Box display="flex" width="100%" sx={{ overflowX: 'scroll' }}>
        <Grid container gap={2}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box marginBottom="100px">
                  <Typography variant="h4">Need help?</Typography>
                </Box>
              </CardContent>

              <CardActions>
                <Box display="flex" width="100%" justifyContent="flex-end">
                  <Link href="/tickets/create">
                    <Button>Create a new ticket</Button>
                  </Link>
                </Box>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>test</CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>test</CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}

export default CustomerLandingPage;
