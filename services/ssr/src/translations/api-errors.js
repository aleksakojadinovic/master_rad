import { defineMessages } from 'react-intl';

export const apiErrorMessages = defineMessages({
  generic: {
    id: 'api-errors.generic-error',
    defaultMessage: 'Something went wrong. Please contact support.',
  },
  TicketTagGroupDuplicateNameError: {
    id: 'api-errors.ticket-tag-group-name-duplicate-error',
    defaultMessage: 'A tag group with this name already exists.',
  },
  CannotAssignCustomerError: {
    id: 'api-errors.cannot-assign-customer',
    defaultMessage: 'You cannot assign a customer to a ticket.',
  },
  DuplicateAssigneeError: {
    id: 'api-errors.duplicate-assignee',
    defaultMessage: 'This person is already assigned to this ticket.',
  },
  CannotChangeYourRoleError: {
    id: 'api-errors.cannot-change-your-role',
    defaultMessage: 'You are not allowed to change your own role.',
  },
  CannotChangeYourStatusError: {
    id: 'api-errors.cannot-change-your-status',
    defaultMessage: 'You are not allowed to change your own status.',
  },
  OldPasswordInvalidError: {
    id: 'api.errors.old-password-invalid',
    defaultMessage: 'Old password is incorrect.',
  },
  CannotChangeCommentsForTicketStatusError: {
    id: 'api.errors.cannot-change-comments-when-this-status',
    defaultMessage:
      'You cannot modify comments on a ticket in this status. Consider re-opening.',
  },
  UsernameTakenError: {
    id: 'api.errors.username-taken',
    defaultMessage: 'This username is already taken.',
  },
  UsernameOrPasswordNotValidError: {
    id: 'api.errors.username-or-password-not-valid',
    defaultMessage:
      'Username or password is not valid. Please review and try again.',
  },
  genericValidationError: {
    id: 'api-errors.generic-validation-error',
    defaultMessage: 'Some provided fields are not valid.',
  },
});
