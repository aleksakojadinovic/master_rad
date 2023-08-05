import React, { Fragment, useEffect, useState } from 'react';

import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { IconButton, Menu } from '@mui/material';

function NotificationsMenu() {
  const [menuAnchorRef, setMenuAnchorRef] = useState(null);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);

  useEffect(() => {
    setShouldRenderMenu(true);
  }, []);

  const handleMenuButtonClick = (e) => {
    setMenuAnchorRef(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorRef(null);
  };

  return (
    <Fragment>
      <IconButton onClick={handleMenuButtonClick}>
        <CircleNotificationsIcon />
      </IconButton>
      {shouldRenderMenu && (
        <Menu
          anchorEl={menuAnchorRef}
          onClose={handleCloseMenu}
          open={!!menuAnchorRef}
        >
          test
        </Menu>
      )}
    </Fragment>
  );
}

export default NotificationsMenu;
