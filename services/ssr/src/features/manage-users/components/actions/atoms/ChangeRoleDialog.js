import {
  cannotChangeRoleNotesMessages,
  manageUsersMessages,
} from '@/translations/manage-users';
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { Fragment, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import RoleChip from '../../table/atoms/RoleChip';
import AreYouSureDialog from '@/components/AreYouSure/AreYouSureDialog';
import { ROLE_CHANGE_MAP } from '@/features/manage-users/constants/role-map';
import { rolesMessages } from '@/translations/roles';
import { useChangeRoleMutation } from '@/api/users';
import ServerActionSnackbar from '@/components/ServerActionSnackbar/ServerActionSnackbar';
import { queryStatusMessages } from '@/translations/query-statuses';
import { globalMessages } from '@/translations/global';

function ChangeRoleDialog({ user, open, onClose }) {
  const intl = useIntl();
  const { fullName, role } = user;

  const [chosenRole, setChosenRole] = useState(null);

  const warningTitle = useMemo(() => {
    if (chosenRole === null) {
      return null;
    }
    return (
      <FormattedMessage
        {...manageUsersMessages.changeRoleAreYouSure}
        values={{
          name: fullName,
          OldRole: <RoleChip role={role} />,
          NewRole: <RoleChip role={chosenRole} />,
        }}
      />
    );
  }, [chosenRole, fullName, role]);

  const warningBody = intl.formatMessage(manageUsersMessages.changeRoleWarning);

  const availableRoles = ROLE_CHANGE_MAP[role];
  const cannotChangeNote =
    availableRoles.length === 0 && cannotChangeRoleNotesMessages[role]
      ? intl.formatMessage(cannotChangeRoleNotesMessages[role])
      : intl.formatMessage(cannotChangeRoleNotesMessages.default);

  const [changeRole, { isSuccess, isError, isLoading, error }] =
    useChangeRoleMutation();

  const handleChangeRole = () => {
    changeRole({ userId: user.id, role: chosenRole });
    setChosenRole(null);
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
          { x: intl.formatMessage(globalMessages.user) },
        )}
      />
      <AreYouSureDialog
        open={chosenRole !== null}
        onClose={() => setChosenRole(null)}
        onYes={handleChangeRole}
        title={warningTitle}
        body={warningBody}
      />

      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {intl.formatMessage(manageUsersMessages.changeRoleTitle)}
        </DialogTitle>
        <DialogContent>
          {availableRoles.length === 0 && (
            <Alert severity="error">
              <Typography variant="body1">{cannotChangeNote}</Typography>
            </Alert>
          )}
          {availableRoles.map((availableRole) => (
            <Button
              key={`change-to-${availableRole}`}
              variant="outlined"
              onClick={() => setChosenRole(availableRole)}
            >
              {intl.formatMessage(manageUsersMessages.changeTo, {
                what: intl.formatMessage(rolesMessages[availableRole]),
              })}
            </Button>
          ))}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default ChangeRoleDialog;
