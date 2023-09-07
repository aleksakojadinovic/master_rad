import { useGetMeQuery } from '@/api/auth';
import useUser from '@/hooks/useUser';
import { navMessages } from '@/translations/nav';
import { Button, Menu, MenuItem } from '@mui/material';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import React, { Fragment, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

const AuthenticationModal = dynamic(() =>
  import('../../auth/AuthenticationModal/AuthenticationModal'),
);

function UserMenu() {
  useGetMeQuery();

  const intl = useIntl();
  const { isLoggedIn, initials } = useUser();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [menuAnchorRef, setMenuAnchorRef] = useState(null);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);

  const handleLogout = () => {
    Cookies.remove('accessToken');
    window.location.reload();
  };

  const renderMenuItems = () => {
    if (!isLoggedIn) {
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

  useEffect(() => {
    setShouldRenderMenu(true);
  }, []);

  const handleMenuButtonClick = (e) => {
    setMenuAnchorRef(e.currentTarget);
  };

  return (
    <Fragment>
      {isAuthModalOpen && <AuthenticationModal />}
      <div>
        <Button ref={menuAnchorRef} onClick={handleMenuButtonClick}>
          {!isLoggedIn
            ? intl.formatMessage(navMessages.menuButtonText)
            : initials}
        </Button>
        {shouldRenderMenu && (
          <Menu
            anchorEl={menuAnchorRef}
            open={!!menuAnchorRef}
            onClose={() => setMenuAnchorRef(null)}
          >
            {renderMenuItems()}
          </Menu>
        )}
      </div>
    </Fragment>
  );
}

export default UserMenu;
