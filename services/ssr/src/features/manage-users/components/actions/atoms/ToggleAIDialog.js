import { manageUsersMessages } from '@/translations/manage-users';
import React, { Fragment, useEffect } from 'react';
import { useIntl } from 'react-intl';
import AreYouSureDialog from '@/components/AreYouSure/AreYouSureDialog';
import { useToggleAIAccessMutation } from '@/api/users';
import { globalMessages } from '@/translations/global';
import { resolveErrorMessage } from '@/utils/errors';

function ToggleAIDialog({ user, open, onClose }) {
  const intl = useIntl();

  const text = user.canUseAI
    ? manageUsersMessages.revokeAIAccess
    : manageUsersMessages.grantAIAccess;

  const question = `${intl.formatMessage(text)}?`;

  const [toggleAI, { error, isUninitialized, isSuccess, isError, isLoading }] =
    useToggleAIAccessMutation();

  const modalBody = isUninitialized
    ? question
    : isLoading
    ? intl.formatMessage(globalMessages.loading)
    : isError
    ? resolveErrorMessage(error?.data)
    : null;

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  return (
    <Fragment>
      <AreYouSureDialog
        open={open}
        onClose={onClose}
        onYes={() => toggleAI({ userId: user.id })}
        title="AI"
        body={modalBody}
      />
    </Fragment>
  );
}

export default ToggleAIDialog;
