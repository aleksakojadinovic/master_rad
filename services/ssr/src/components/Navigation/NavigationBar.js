import { selectGetMeQueryResponse, useGetMeQuery } from '@/api/auth';
import { Box, Button } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const AuthenticationModal = dynamic(() =>
  import('../AuthenticationModal/AuthenticationModal'),
);

function NavigationBar() {
  useGetMeQuery();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleClose = () => setIsAuthModalOpen(false);

  const user = useSelector(selectGetMeQueryResponse);

  const renderRightSideContent = () => {
    if (user != null) {
      return (
        <Button>
          {user.firstName} {user.lastName}
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
