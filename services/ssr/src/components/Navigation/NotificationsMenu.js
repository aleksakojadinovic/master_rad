import React, { Fragment, useEffect, useMemo, useState } from 'react';

import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { Badge, IconButton, Menu, MenuItem } from '@mui/material';
import { useGetNotificationsQuery } from '@/api/notifications';
import Notification from '@/features/notifications/Notification';
import { getNotificationsParams } from '@/utils/params';

function NotificationsMenu() {
  const { data: notifications, isSuccess } = useGetNotificationsQuery(
    getNotificationsParams(),
  );

  const unreadCount = useMemo(() => {
    if (!isSuccess) {
      return 0;
    }
    return notifications.filter(({ readAt }) => readAt === null).length;
  }, [isSuccess, notifications]);

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
        <Badge
          badgeContent={unreadCount}
          color="error" // You can choose another color
          invisible={unreadCount === 0} // Hides the badge when count is zero
        >
          <CircleNotificationsIcon />
        </Badge>
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
