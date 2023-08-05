import { useGetMeQuery } from '@/api/auth';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { Fragment, useState } from 'react';
import NotificationsMenu from './NotificationsMenu';
import NavigationUserMenu from './NavigationUserMenu';

function NavigationBar() {
  useGetMeQuery();

  const renderLogoSection = () => {
    return (
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://dev.sts.com/images/logo-no-background.svg"
          alt="Logo"
          style={{ width: '111px', height: '40px', cursor: 'pointer' }}
          onClick={() => (window.location.href = '/')}
        />
      </div>
    );
  };

  const renderUserSection = () => {
    return (
      <Box display="flex" alignItems="center">
        <NotificationsMenu />
        <NavigationUserMenu />
      </Box>
    );
  };

  return (
    <Fragment>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        height="40px"
      >
        {renderLogoSection()}
        {renderUserSection()}
      </Box>
    </Fragment>
  );
}

export default NavigationBar;
