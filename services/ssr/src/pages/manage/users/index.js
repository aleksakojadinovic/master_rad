import { useStoreUser } from '@/api/auth';
import { ROLES } from '@/constants/roles';
import { USER_STATUSES } from '@/enums/users';
import ManageUsers from '@/features/manage-users/ManageUsers';
import { wrapper } from '@/redux/store';
import React from 'react';

function ManageUsersPage({ queryParams }) {
  return <ManageUsers queryParams={queryParams} />;
}

export default ManageUsersPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => (context) => {
    const { isAdministrator } = useStoreUser(store);

    if (!isAdministrator) {
      return {
        redirect: {
          destination: '/404',
        },
      };
    }

    const params = context.query;

    const page =
      params.page && !isNaN(params.page) && parseInt(params.page, 10) > 0
        ? parseInt(params.page, 10)
        : 1;

    const perPage =
      params.perPage &&
      !isNaN(params.perPage) &&
      parseInt(params.perPage, 10) > 0
        ? parseInt(params.perPage, 10)
        : 5;

    const roles =
      params.roles && ROLES.includes(params.roles) ? params.roles : null;

    const statuses =
      params.statuses && USER_STATUSES.includes(params.statuses)
        ? params.statuses
        : null;

    const searchString =
      params.searchString && params.searchString.trim().length > 0
        ? params.searchString.trim()
        : null;

    const queryParams = {};

    queryParams.page = page;
    queryParams.perPage = perPage;
    if (roles) {
      queryParams.roles = roles;
    }
    if (statuses) {
      queryParams.statuses = statuses;
    }
    if (searchString) {
      queryParams.searchString = searchString;
    }

    return { props: { queryParams } };
  },
);
