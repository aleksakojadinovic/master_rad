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

export function getTicketSearchTicketsParams(
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
