import { selectGetMeQueryResponse, useGetMeQuery } from '@/api/auth';
import { navMessages } from '@/translations/nav';
import { Button, Menu, MenuItem } from '@mui/material';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

function NavigationUserMenu({ setIsAuthModalOpen }) {
  useGetMeQuery();

  const intl = useIntl();
  const user = useSelector(selectGetMeQueryResponse);

  const [menuAnchorRef, setMenuAnchorRef] = useState(null);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);

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

  useEffect(() => {
    setShouldRenderMenu(true);
  }, []);

  const handleMenuButtonClick = (e) => {
    setMenuAnchorRef(e.currentTarget);
  };

  const initials = `${user?.firstName?.[0] ?? ''}.${user?.lastName?.[0] ?? ''}`;
  return (
    <div>
      <Button ref={menuAnchorRef} onClick={handleMenuButtonClick}>
        {user == null
          ? intl.formatMessage(navMessages.menuButtonText)
          : initials}
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
  );
}

export default NavigationUserMenu;
