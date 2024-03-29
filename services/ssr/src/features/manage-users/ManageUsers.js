import { useGetUsersQuery } from '@/api/users';
import { manageUsersMessages } from '@/translations/manage-users';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import UsersTable from './components/table/UsersTable';
import { useRouter } from 'next/router';
import UserFilters from './components/filters/UserFilters';
import { Box, Button } from '@mui/material';

function ManageUsers({ queryParams }) {
  const intl = useIntl();
  const router = useRouter();

  const { data } = useGetUsersQuery(queryParams);

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

  const handleCreateUser = () => {
    router.push('/manage/users/create');
  };

  const DEFAULT_VALUE = {
    entities: [],
    page: 0,
    perPage: 5,
    totalEntities: 0,
    totalPages: 0,
  };

  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(manageUsersMessages.pageTitle)}</title>
      </Head>
      <Box marginBottom="12px">
        <Button onClick={handleCreateUser} variant="contained">
          {intl.formatMessage(manageUsersMessages.createNewUserButtonText)}
        </Button>
      </Box>
      <UserFilters value={queryParams} onChange={handleParamsChange} />
      <UsersTable
        data={data ?? DEFAULT_VALUE}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />
    </Fragment>
  );
}

export default ManageUsers;
