import { createSelector } from '@reduxjs/toolkit';

export const defineSelectors = (slice) => {
  const selectGetMeQueryResult = slice.endpoints.getMe.select();
  const selectGetMeData = createSelector(
    [selectGetMeQueryResult],
    ({ data }) => data,
  );
  return { selectGetMeQueryResult, selectGetMeData };
};
