import { manageUsersMessages } from '@/translations/manage-users';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { Fragment, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import AreYouSureDialog from '@/components/AreYouSure/AreYouSureDialog';
import { userStatusMessages } from '@/translations/user-status';
import { STATUS_COLOR_MAP } from '@/features/manage-users/constants/status-map';
import { USER_STATUSES } from '@/enums/users';
import UserStatusChip from '../../table/atoms/UserStatusChip';
import { useChangeStatusMutation } from '@/api/users';
import ServerActionSnackbar from '@/components/ServerActionSnackbar/ServerActionSnackbar';
import { queryStatusMessages } from '@/translations/query-statuses';
import { globalMessages } from '@/translations/global';

function ChangeStatusDialog({ user, open, onClose }) {
  const intl = useIntl();
  const { fullName, status } = user;

  const [chosenStatus, setChosenStatus] = useState(null);

  const warningTitle = useMemo(() => {
    if (chosenStatus === null) {
      return null;
    }
    return (
      <FormattedMessage
        {...manageUsersMessages.changeStatusAreYouSure}
        values={{
          name: fullName,
          OldStatus: <UserStatusChip status={status} />,
          NewStatus: <UserStatusChip status={chosenStatus} />,
        }}
      />
    );
  }, [chosenStatus, fullName, status]);

  const warningBody = intl.formatMessage(
    manageUsersMessages.changeStatusWarning,
  );

  const availableStatuses = USER_STATUSES.filter(
    (status) => status !== user.status,
  );

  const [changeStatus, { isLoading, isError, isSuccess, error }] =
    useChangeStatusMutation();

  const handleChangeStatus = () => {
    changeStatus({ userId: user.id, status: chosenStatus });
    setChosenStatus(null);
    onClose();
  };

  return (
    <Fragment>
      <ServerActionSnackbar
        error={error}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        successMessage={intl.formatMessage(
          queryStatusMessages.updateSuccessfulX,
          { x: intl.formatMessage(globalMessages.status) },
        )}
      />
      <AreYouSureDialog
        open={chosenStatus !== null}
        onClose={() => setChosenStatus(null)}
        onYes={handleChangeStatus}
        title={warningTitle}
        body={warningBody}
      />

      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {intl.formatMessage(manageUsersMessages.changeStatusTitle)}
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          {availableStatuses.map((availableStatus) => (
            <Button
              key={`change-to-${availableStatus}`}
              variant="outlined"
              onClick={() => setChosenStatus(availableStatus)}
              color={STATUS_COLOR_MAP[availableStatus] ?? 'primary'}
            >
              {intl.formatMessage(manageUsersMessages.changeTo, {
                what: intl.formatMessage(userStatusMessages[availableStatus]),
              })}
            </Button>
          ))}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default ChangeStatusDialog;
