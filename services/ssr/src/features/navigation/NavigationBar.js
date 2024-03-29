/* eslint-disable @next/next/no-img-element */
import { useGetMeQuery } from '@/api/auth';
import { Box } from '@mui/material';
import React, { Fragment } from 'react';
import NotificationsMenu from './components/NotificationsMenu';
import UserMenu from './components/UserMenu';
import useUser from '@/hooks/useUser';
import LinksMenu from './components/LinksMenu';

function NavigationBar() {
  const { isLoggedIn } = useUser();
  useGetMeQuery();

  return (
    <Fragment>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        height="40px"
      >
        <Box>
          <img
            src="https://dev.sts.com/images/logo-no-background.svg"
            alt="Logo"
            style={{ width: '111px', height: '40px', cursor: 'pointer' }}
            onClick={() => (window.location.href = '/')}
          />
        </Box>
        <Box display="flex" alignItems="center">
          {isLoggedIn && <LinksMenu />}
          {isLoggedIn && <NotificationsMenu />}
          <UserMenu />
        </Box>
      </Box>
    </Fragment>
  );
}

export default NavigationBar;
