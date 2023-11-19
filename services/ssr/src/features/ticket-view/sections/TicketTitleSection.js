import { formatDate } from '@/utils';
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import TicketStatusBadge from '../components/TicketStatusBadge';
import { useIntl } from 'react-intl';
import { globalMessages } from '@/translations/global';
import useUser from '@/hooks/useUser';
import { useEditTitleMutation } from '@/api/tickets';
import EditIcon from '@mui/icons-material/Edit';

function TicketTitleSection({ ticket }) {
  const intl = useIntl();
  const { id } = useUser();
  const isOwner = id === ticket.createdBy.id;

  const [title, setTitle] = useState(null);
  const isEditing = title !== null;

  const [editTitle, { isSuccess }] = useEditTitleMutation();

  const handleSubmitEdit = () => {
    editTitle({ id: ticket.id, title });
  };

  useEffect(() => {
    if (isSuccess) {
      setTitle(null);
    }
  }, [isSuccess]);

  const isTitleValid = title?.length >= 20;

  return (
    <Grid container>
      <Grid item xs={12} md={9}>
        <Box
          display="flex"
          alignItems="center"
          height="100%"
          gap="12px"
          flexWrap="wrap"
        >
          {!isEditing && isOwner && (
            <Fragment>
              <Typography variant="h4">
                {ticket.title}
                <IconButton onClick={() => setTitle(ticket.title)}>
                  <EditIcon />
                </IconButton>
              </Typography>
            </Fragment>
          )}

          {isEditing && (
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
          )}

          {isEditing && (
            <Box display="flex">
              <Button
                variant="contained"
                onClick={handleSubmitEdit}
                disabled={!isTitleValid || title === ticket.title}
              >
                {intl.formatMessage(globalMessages.save)}
              </Button>
              <Button color="error" onClick={() => setTitle(null)}>
                {intl.formatMessage(globalMessages.discard)}
              </Button>
            </Box>
          )}
        </Box>
      </Grid>
      {!isEditing && (
        <Grid item xs={12} md={3}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100%"
          >
            <Typography component="div" sx={{ color: 'text.disabled' }}>
              {formatDate(ticket.createdAt, intl)}
            </Typography>
            <Typography component="div" sx={{ color: 'secondary.main' }}>
              {intl.formatMessage(globalMessages.by)}{' '}
              {ticket.createdBy.fullName}
            </Typography>
            <TicketStatusBadge status={ticket.status} />
          </Box>
        </Grid>
      )}
    </Grid>
  );
}

export default TicketTitleSection;
