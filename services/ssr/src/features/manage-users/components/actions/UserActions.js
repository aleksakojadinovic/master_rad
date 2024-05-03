import React, { Fragment, useState } from 'react';
import UserActionOptions from './atoms/UserActionOptions';
import ChangeRoleDialog from './atoms/ChangeRoleDialog';
import ChangeStatusDialog from './atoms/ChangeStatusDialog';
import ToggleAIDialog from './atoms/ToggleAIDialog';

function UserActions({ user }) {
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [isToggleAIOpen, setIsToggleAIOpen] = useState(false);

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
      <ToggleAIDialog
        user={user}
        open={isToggleAIOpen}
        onClose={() => setIsToggleAIOpen(false)}
      />
      <UserActionOptions
        user={user}
        onChangeRoleClick={() => setIsChangeRoleOpen(true)}
        onChangeStatusClick={() => setIsChangeStatusOpen(true)}
        onToggleAIClick={() => setIsToggleAIOpen(true)}
      />
    </Fragment>
  );
}

export default UserActions;
