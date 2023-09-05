import { useGetUserQuery } from '@/api/users';
import UserAssignForm from '@/features/ticket-view/components/UserAssignForm';
import { Button, IconButton } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import ClearIcon from '@mui/icons-material/Clear';

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
        <UserAssignForm
          onSelect={handleSelectUser}
          onClose={() => setOpen(false)}
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
