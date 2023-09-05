import React, { Fragment, useEffect, useState } from 'react';

import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { Badge, Box, Button, IconButton, Menu } from '@mui/material';
import { useGetNotificationsQuery } from '@/api/notifications';
import Notification from '@/features/notifications/Notification';
import { useIntl } from 'react-intl';
import { globalMessages } from '@/translations/global';
import useUser from '@/hooks/useUser';

function NotificationsPage({ page }) {
  const { data } = useGetNotificationsQuery({ page });
  const notifications = data?.notifications ?? [];

  return notifications.map((notification) => (
    <Box
      key={notification.id}
      marginLeft="12px"
      marginRight="12px"
      marginBottom="12px"
    >
      <Notification notification={notification} />
    </Box>
  ));
}

function NotificationsMenu() {
  const { isLoggedIn } = useUser();
  const intl = useIntl();
  const [page, setPage] = useState(1);

  useGetNotificationsQuery({ page: 1 }, { skip: !isLoggedIn });
  const { data: lastPageResult } = useGetNotificationsQuery(
    { page },
    { skip: !isLoggedIn },
  );
  const unreadCount = lastPageResult?.unreadCount ?? 0;

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
    return (
      <Box>
        {Array.from(Array(page)).map((_, p) => (
          <NotificationsPage key={p + 1} page={p + 1} />
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
