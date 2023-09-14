import { useGetUserQuery } from '@/api/users';
import UserPicker from '@/features/ticket-view/components/UserPicker';
import { Button, IconButton } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import ClearIcon from '@mui/icons-material/Clear';
import { ticketSearchMessages } from '@/translations/ticket-search';

const TicketUserFilter = ({
  value: selectedUserId,
  onChange,
  buttonTranslation,
}) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const { data, isSuccess } = useGetUserQuery(
    { id: selectedUserId },
    { skip: selectedUserId == null },
  );

  const selectedUserName = isSuccess ? data.fullName : '...';

  const buttonTitle = intl.formatMessage(buttonTranslation, {
    user: selectedUserName ?? '',
  });

  const handleSelectUser = (user) => {
    setOpen(false);
    onChange(user.id);
  };

  return (
    <Fragment>
      {open && (
        <UserPicker
          onSelect={handleSelectUser}
          onClose={() => setOpen(false)}
          formTitle={intl.formatMessage(ticketSearchMessages.userFormTitle)}
        />
      )}
      <Button
        onClick={() => setOpen(true)}
        variant="outlined"
        sx={{ height: '40px' }}
      >
        {buttonTitle}
      </Button>
      <IconButton onClick={() => onChange('')}>
        <ClearIcon />
      </IconButton>
    </Fragment>
  );
};

export default TicketUserFilter;
