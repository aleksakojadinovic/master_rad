import { globalMessages } from '@/translations/global';
import { notFoundMessages } from '@/translations/not-found-page';
import { Alert, Box, Typography } from '@mui/material';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function NotFound() {
  const intl = useIntl();
  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(globalMessages.notFound)}</title>
      </Head>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Typography variant="h3">
          {intl.formatMessage(notFoundMessages.header)}
        </Typography>
        <Box marginTop="20px">
          <Alert severity="error">
            <Typography variant="body1">
              {intl.formatMessage(notFoundMessages.description)}
            </Typography>
          </Alert>
        </Box>
      </Box>
    </Fragment>
  );
}

export default NotFound;
