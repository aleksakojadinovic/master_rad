export function getTicketViewQueryParams() {
  return {
    includes: ['createdBy', 'historyInitiator'],
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
