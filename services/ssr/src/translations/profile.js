import { defineMessages } from 'react-intl';

export const profileMessages = defineMessages({
  pageTitle: {
    id: 'profile.page-title',
    defaultMessage: 'Profile | STS',
  },
  inactiveAlertTitle: {
    id: 'profile.inactive-alert-title',
    defaultMessage:
      'You account seems to be inactive. If you think this is a mistake, contact us at {ContactLink}.',
  },
  changePasswordSectionTitle: {
    id: 'profile.change-password-section-title',
    defaultMessage: 'Change your password',
  },
  userInfoSectionTitle: {
    id: 'profile.user-info-section-title',
    defaultMessage: 'Your info',
  },
  usernameTitle: {
    id: 'profile.username',
    defaultMessage: 'Username',
  },
  nameTitle: {
    id: 'profile.name-title',
    defaultMessage: 'Name',
  },
  statusTitle: {
    id: 'profile.status-title',
    defaultMessage: 'Status',
  },
  roleTitle: {
    id: 'profile.role-title',
    defaultMessage: 'Role',
  },
});

export const changePasswordMessages = defineMessages({
  oldPasswordTitle: {
    id: 'change-password.old-password-title',
    defaultMessage: 'Old password',
  },
  newPasswordTitle: {
    id: 'change-password.new-password-title',
    defaultMessage: 'New password',
  },
  repeatPasswordTitle: {
    id: 'change-password.repeat-password-title',
    defaultMessage: 'Repeat password',
  },
  changePasswordCTA: {
    id: 'change-password.cta',
    defaultMessage: 'Confirm',
  },
});
