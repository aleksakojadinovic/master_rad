import { createSelector } from '@reduxjs/toolkit';

export const defineSelectors = (slice) => {
  const selectGetMeQueryResult = slice.endpoints.getMe.select();
  const selectGetMeData = createSelector(
    [selectGetMeQueryResult],
    ({ data }) => data,
  );
  const selectUser = createSelector([selectGetMeData], (userObject) => {
    const isLoggedIn = !!userObject;
    const username = userObject?.username ?? null;
    const firstName = userObject?.firstName ?? null;
    const lastName = userObject?.lastName ?? null;
    const roles = userObject?.roles ?? [];

    return { isLoggedIn, username, firstName, lastName, roles };
  });
  return { selectGetMeQueryResult, selectGetMeData, selectUser };
};
