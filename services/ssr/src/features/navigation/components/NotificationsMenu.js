import React, { Fragment, useEffect, useState } from 'react';

import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import {
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  Typography,
} from '@mui/material';
import {
  selectHasAnyNotifications,
  useGetNotificationsQuery,
} from '@/api/notifications';
import Notification from '@/features/notifications/Notification';
import { useIntl } from 'react-intl';
import { globalMessages } from '@/translations/global';
import useUser from '@/hooks/useUser';
import { useSelector } from 'react-redux';
import { notificationsMessages } from '@/translations/notifications';

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
  const intl = useIntl();
  const { isLoggedIn } = useUser();
  const [page, setPage] = useState(1);

  useGetNotificationsQuery({ page: 1 }, { skip: !isLoggedIn });
  const { data: lastPageResult } = useGetNotificationsQuery(
    { page },
    { skip: !isLoggedIn },
  );
  const unreadCount = lastPageResult?.unreadCount ?? 0;
  const hasAnyNotifications = useSelector(selectHasAnyNotifications);

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
        {!hasAnyNotifications && (
          <Box padding="16px" display="flex" justifyContent="center">
            <Typography variant="caption">
              {intl.formatMessage(notificationsMessages.noNotifications)}
            </Typography>
          </Box>
        )}
        {Array.from(Array(page)).map((_, p) => (
          <NotificationsPage key={p + 1} page={p + 1} />
        ))}
        {hasAnyNotifications && (
          <Box marginTop="12px" marginLeft="12px">
            <Button onClick={() => setPage((p) => p + 1)}>
              {intl.formatMessage(globalMessages.loadMore)}
            </Button>
          </Box>
        )}
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
