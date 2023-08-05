import { selectGetMeQueryResponse, useGetMeQuery } from '@/api/auth';
import { navMessages } from '@/translations/nav';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import React, { Fragment, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

const AuthenticationModal = dynamic(() =>
  import('../AuthenticationModal/AuthenticationModal'),
);

function NavigationBar() {
  const intl = useIntl();
  useGetMeQuery();
  const user = useSelector(selectGetMeQueryResponse);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
  const [menuAnchorRef, setMenuAnchorRef] = useState(null);

  useEffect(() => {
    setShouldRenderMenu(true);
  }, []);

  const handleMenuButtonClick = (e) => {
    setMenuAnchorRef(e.currentTarget);
  };

  const handleLogout = () => {
    Cookies.remove('accessToken');
    window.location.reload();
  };

  const renderMenuItems = () => {
    if (user == null) {
      return (
        <MenuItem
          onClick={() => {
            setIsAuthModalOpen(true);
            setMenuAnchorRef(null);
          }}
        >
          {intl.formatMessage(navMessages.loginButtonText)}
        </MenuItem>
      );
    }
    return [
      <MenuItem key="profile-item">
        {intl.formatMessage(navMessages.profileButtonText)}
      </MenuItem>,
      <MenuItem key="logout-item" onClick={handleLogout}>
        {intl.formatMessage(navMessages.logoutButtonText)}
      </MenuItem>,
    ];
  };

  return (
    <Fragment>
      {isAuthModalOpen && <AuthenticationModal />}
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
            style={{ width: '111px', height: '40px', cursor: 'pointer' }}
            onClick={() => (window.location.href = '/')}
          />
        </div>
        <div>
          <Button ref={menuAnchorRef} onClick={handleMenuButtonClick}>
            {user == null
              ? intl.formatMessage(navMessages.menuButtonText)
              : `${user.firstName} ${user.lastName}`}
          </Button>
          {shouldRenderMenu && (
            <Menu
              id="basic-menu"
              anchorEl={menuAnchorRef}
              open={!!menuAnchorRef}
              onClose={() => setMenuAnchorRef(null)}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {renderMenuItems()}
            </Menu>
          )}
        </div>
      </Box>
    </Fragment>
  );
}

export default NavigationBar;
