import { globalMessages } from '@/translations/global';
import { profileMessages } from '@/translations/profile';
import { Alert } from '@mui/material';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

function InactiveAlert() {
  const intl = useIntl();
  return (
    <Alert severity="warning">
      <FormattedMessage
        {...profileMessages.inactiveAlertTitle}
        values={{
          ContactLink: (
            <a
              href={`mailto:${intl.formatMessage(globalMessages.supportEmail)}`}
            >
              {intl.formatMessage(globalMessages.supportEmail)}
            </a>
          ),
        }}
      />
    </Alert>
  );
}

export default InactiveAlert;
