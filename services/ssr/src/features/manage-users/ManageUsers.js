import { useGetUsersQuery } from '@/api/users';
import { manageUsersMessages } from '@/translations/manage-users';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import UsersTable from './components/UsersTable';
import { useRouter } from 'next/router';
import UserFilters from './components/UserFilters';

function ManageUsers({ queryParams }) {
  const intl = useIntl();
  const router = useRouter();

  const { data, isSuccess } = useGetUsersQuery(queryParams);

  const handleParamsChange = (newParams) => {
    const searchParams = new URLSearchParams();
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null) {
        return;
      }
      searchParams.set(k, v);
    });
    const searchString = searchParams.toString();
    router.push(`/manage/users?${searchString}`);
  };

  const handlePageChange = (page) => {
    const newQueryParams = { ...queryParams, page };
    handleParamsChange(newQueryParams);
  };

  const handlePerPageChange = (perPage) => {
    const newQueryParams = { ...queryParams, perPage };
    handleParamsChange(newQueryParams);
  };

  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(manageUsersMessages.pageTitle)}</title>
      </Head>

      <UserFilters value={queryParams} onChange={handleParamsChange} />
      {isSuccess && (
        <UsersTable
          data={data}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      )}
    </Fragment>
  );
}

export default ManageUsers;
