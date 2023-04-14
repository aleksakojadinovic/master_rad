'use client';

import { authSliceSelectors, useGetMeQuery } from '@/api/auth/client';
import { Box, Button } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import urlJoin from 'url-join';
import { getExternalBaseUrl } from '@/utils';

const AuthenticationModal = dynamic(() =>
  import('../AuthenticationModal/AuthenticationModal'),
);

function NavigationBar() {
  useGetMeQuery();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleClose = () => setIsAuthModalOpen(false);

  const { isLoggedIn, firstName, lastName } = useSelector(
    authSliceSelectors.selectUser,
  );

  const imageUrl = urlJoin(
    getExternalBaseUrl(),
    '/images/logo-no-background.png',
  );

  const renderRightSideContent = () => {
    if (isLoggedIn) {
      return (
        <Button>
          {firstName} {lastName}
        </Button>
      );
    }
    if (isAuthModalOpen) {
      return <AuthenticationModal onClose={handleClose} />;
    }
    return (
      <Button
        onClick={() => setIsAuthModalOpen(true)}
        onClose={handleClose}
        disabled={isAuthModalOpen}
      >
        Login
      </Button>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '40px',
      }}
    >
      <div>
        {/* <Image src={imageUrl} alt="Logo" height="40" width="111" /> */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://dev.sts.com/images/logo-no-background.svg"
          alt="Logo"
          style={{ width: '111px', height: '40px' }}
        />
      </div>
      <div>{renderRightSideContent()}</div>
    </Box>
  );
}

export default NavigationBar;
