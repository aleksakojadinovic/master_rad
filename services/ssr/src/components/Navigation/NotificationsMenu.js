import React, { Fragment, useEffect, useState } from 'react';

import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useGetNotificationsQuery } from '@/api/notifications';
import Notification from '@/features/notifications/Notification';

function NotificationsMenu() {
  const { data: notifications, isSuccess } = useGetNotificationsQuery({
    page: 1,
    perPage: 5,
  });

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

  const renderNotifications = () => {
    if (!isSuccess) {
      return null;
    }
    return notifications.map((notification) => (
      <MenuItem key={notification.id}>
        <Notification notification={notification} />
      </MenuItem>
    ));
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
          {renderNotifications()}
        </Menu>
      )}
    </Fragment>
  );
}

export default NotificationsMenu;
