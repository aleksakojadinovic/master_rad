import React, { Fragment, useState } from 'react';
import UserActionOptions from './atoms/UserActionOptions';
import ChangeRoleDialog from './atoms/ChangeRoleDialog';
import ChangeStatusDialog from './atoms/ChangeStatusDialog';

function UserActions({ user }) {
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);

  return (
    <Fragment>
      <ChangeRoleDialog
        user={user}
        open={isChangeRoleOpen}
        onClose={() => setIsChangeRoleOpen(false)}
      />
      <ChangeStatusDialog
        user={user}
        open={isChangeStatusOpen}
        onClose={() => setIsChangeStatusOpen(false)}
      />
      <UserActionOptions
        onChangeRoleClick={() => setIsChangeRoleOpen(true)}
        onChangeStatusClick={() => setIsChangeStatusOpen(true)}
      />
    </Fragment>
  );
}

export default UserActions;
