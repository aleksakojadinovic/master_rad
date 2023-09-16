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
});
