import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { Fragment, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

import * as CONFIG from '../configuration';
import useUser from '@/hooks/useUser';
import { useIntl } from 'react-intl';

function LinksMenu() {
  const intl = useIntl();
  const { role } = useUser();
  const isDesktop = useMediaQuery('(min-width:800px)');

  const configuration = CONFIG[role];

  const [menuAnchorRef, setMenuAnchorRef] = useState(null);

  const handleMenuButtonClick = (e) => {
    setMenuAnchorRef(e.currentTarget);
  };

  const renderMenuItems = () => {
    return configuration.map(({ id, href, translation }) => (
      <MenuItem key={id} href={href}>
        {intl.formatMessage(translation)}
      </MenuItem>
    ));
  };

  const renderLinks = () => {
    return configuration.map(({ id, href, translation }) => (
      <Box key={id} marginRight="12px">
        <Button href={href} variant="outlined">
          <Typography variant="body2">
            {intl.formatMessage(translation)}
          </Typography>
        </Button>
      </Box>
    ));
  };

  return (
    <Fragment>
      {!isDesktop && (
        <IconButton ref={menuAnchorRef} onClick={handleMenuButtonClick}>
          <MenuIcon />
        </IconButton>
      )}
      {!isDesktop && (
        <Menu
          anchorEl={menuAnchorRef}
          open={!!menuAnchorRef}
          onClose={() => setMenuAnchorRef(null)}
        >
          {renderMenuItems()}
        </Menu>
      )}
      {isDesktop && renderLinks()}
    </Fragment>
  );
}

export default LinksMenu;
