import { createSelector } from '@reduxjs/toolkit';

export const defineSelectors = (slice) => {
  const selectGetTicketQueryResult = createSelector(
    [(state) => state, (_, id) => id],
    (state, id) => slice.endpoints.getTicket.select({ id })(state),
  );
  const selectGetTicketData = createSelector(
    [selectGetTicketQueryResult],
    ({ data }) => data,
  );

  return {
    selectGetTicketData,
  };
};
