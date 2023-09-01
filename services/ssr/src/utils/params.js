export function getTicketViewQueryParams() {
  return {
    includes: [
      'createdBy',
      'historyInitiator',
      'tags',
      'assignees',
      'tags.group',
    ],
  };
}

export function getAgentDashboardTicketsParams(
  page = 1,
  perPage = 10,
  filters = {},
) {
  return {
    page,
    perPage,
    includes: ['createdBy'],
    ...filters,
  };
}

export function getNotificationsParams(page = 1) {
  return {
    page,
    perPage: 5,
    includes: ['ticket', 'user', 'tags'],
  };
}
