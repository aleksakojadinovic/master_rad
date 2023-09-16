import { ROLE } from '@/enums/roles';
import { defineMessages } from 'react-intl';

export const manageUsersMessages = defineMessages({
  pageTitle: {
    id: 'manage-users.page-title',
    defaultMessage: 'Manage Users | STS',
  },
  fullNameTableHeader: {
    id: 'manage-users.full-name-table-header',
    defaultMessage: 'Full Name',
  },
  roleTableHeader: {
    id: 'manage-users.role-table-header',
    defaultMessage: 'Role',
  },
  statusTableHeader: {
    id: 'manage-users.status-table-header',
    defaultMessage: 'Status',
  },
  actionsTableHeader: {
    id: 'manage-users.actions-table-header',
    defaultMessage: 'Actions',
  },
  changeRoleTitle: {
    id: 'manage-users.change-role-title',
    defaultMessage: 'Change role',
  },
  changeStatusTitle: {
    id: 'manage-users.change-status-title',
    defaultMessage: 'Change status',
  },
  changeRoleAreYouSure: {
    id: 'manage-users.change-role-are-you-sure',
    defaultMessage:
      'Are you sure you want to change {name} from {OldRole} to {NewRole}? ',
  },
  changeRoleWarning: {
    id: 'manage-users.change-role-wraning',
    defaultMessage:
      'This may expose user to info that was previously considered private for them. You also may not be able to undo this action yourself depending on your role.',
  },
});

export const cannotChangeRoleNotesMessages = defineMessages({
  [ROLE.CUSTOMER]: {
    id: 'manage-users.change-roles-customer-note',
    defaultMessage:
      'Customers cannot change their role for security reasons. If a customer became an agent please create a new account for them.',
  },
  default: {
    id: 'manage-users.change-roles-default-note',
    defaultMessage: 'No roles available for this type of user.',
  },
});
