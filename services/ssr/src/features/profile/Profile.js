import useUser from '@/hooks/useUser';
import { profileMessages } from '@/translations/profile';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import InactiveAlert from './components/InactiveAlert';
import ChangePassword from './components/ChangePassword/ChangePassword';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import ProfileUserInfo from './components/ProfileUserInfo/ProfileUserInfo';

function Profile() {
  const intl = useIntl();
  const { isActive } = useUser();

  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(profileMessages.pageTitle)}</title>
      </Head>
      {!isActive && <InactiveAlert />}
      <Grid container spacing={2} rowSpacing={2}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ minHeight: '500px' }}>
            <CardContent>
              <Typography variant="body1" marginBottom="12px">
                {intl.formatMessage(profileMessages.userInfoSectionTitle)}
              </Typography>
              <ProfileUserInfo />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ minHeight: '500px' }}>
            <CardContent>
              <Typography variant="body1" marginBottom="12px">
                {intl.formatMessage(profileMessages.changePasswordSectionTitle)}
              </Typography>
              <ChangePassword />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default Profile;
