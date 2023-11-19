import useUser from '@/hooks/useUser';
import {
  Box,
  Button,
  CardContent,
  CardHeader,
  IconButton,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import React, { Fragment, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useIntl } from 'react-intl';
import { globalMessages } from '@/translations/global';

function TicketBodySection({ ticket }) {
  const intl = useIntl();
  const { id } = useUser();
  const isOwner = id === ticket.createdBy.id;

  const [body, setBody] = useState(null);
  const isEditing = body !== null;

  const handleSubmitEdit = () => {};

  return (
    <CardContent>
      {isOwner && !isEditing && (
        <CardHeader
          action={
            <Fragment>
              <IconButton onClick={() => setBody(ticket.body)}>
                <EditIcon />
              </IconButton>
            </Fragment>
          }
        />
      )}
      {!isEditing && (
        <Typography
          variant="body1"
          style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        >
          {ticket.body}
        </Typography>
      )}
      {isEditing && (
        <TextareaAutosize
          minRows={10}
          style={{ width: '100%' }}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      )}
      {isEditing && (
        <Box display="flex" gap="6px">
          <Button variant="contained" onClick={handleSubmitEdit}>
            {intl.formatMessage(globalMessages.save)}
          </Button>
          <Button color="error" onClick={() => setBody(null)}>
            {intl.formatMessage(globalMessages.discard)}
          </Button>
        </Box>
      )}
    </CardContent>
  );
}

export default TicketBodySection;
