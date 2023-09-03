import React, { Fragment, useEffect, useState } from 'react';

import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { Badge, Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { useGetNotificationsQuery } from '@/api/notifications';
import Notification from '@/features/notifications/Notification';
import { getNotificationsParams } from '@/utils/params';
import { useIntl } from 'react-intl';
import { globalMessages } from '@/translations/global';

function NotificationsMenu() {
  const intl = useIntl();
  const [page, setPage] = useState(1);

  const { data, isSuccess } = useGetNotificationsQuery(
    getNotificationsParams(page),
  );

  const { notifications, unreadCount } = data ?? {
    notification: [],
    unreadCount: 0,
  };

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
    return (
      <Box>
        {notifications.map((notification) => (
          <MenuItem key={notification.id}>
            <Notification notification={notification} />
          </MenuItem>
        ))}
        <Box marginTop="12px" marginLeft="12px">
          <Button onClick={() => setPage((p) => p + 1)}>
            {intl.formatMessage(globalMessages.loadMore)}
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Fragment>
      <IconButton onClick={handleMenuButtonClick}>
        <Badge
          badgeContent={unreadCount}
          color="error"
          invisible={unreadCount === 0}
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
