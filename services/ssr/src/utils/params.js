export function getTicketViewQueryParams() {
  return {
    includes: ['createdBy', 'historyInitiator'],
  };
}

export function getAgentDashboardTicketsParams() {
  return {
    page: 1,
    perPage: 10,
    includes: [],
  };
}
