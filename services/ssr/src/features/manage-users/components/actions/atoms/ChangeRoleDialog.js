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

function ChangeRoleDialog({ user, open, onClose }) {
  const intl = useIntl();
  const { fullName, role } = user;

  const [chosenRole, setChosenRole] = useState(null);

  const title = useMemo(() => {
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

  const body = intl.formatMessage(manageUsersMessages.changeRoleWarning);

  const availableRoles = ROLE_CHANGE_MAP[role];
  const cannotChangeNote =
    availableRoles.length === 0 && cannotChangeRoleNotesMessages[role]
      ? intl.formatMessage(cannotChangeRoleNotesMessages[role])
      : intl.formatMessage(cannotChangeRoleNotesMessages.default);

  const handleChangeRole = () => {
    setChosenRole(null);
    onClose();
  };

  return (
    <Fragment>
      <AreYouSureDialog
        open={chosenRole !== null}
        onClose={() => setChosenRole(null)}
        onYes={handleChangeRole}
        title={title}
        body={body}
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
              Change to {intl.formatMessage(rolesMessages[availableRole])}
            </Button>
          ))}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default ChangeRoleDialog;
