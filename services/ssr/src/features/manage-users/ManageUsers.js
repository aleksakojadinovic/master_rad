import { useGetUsersQuery } from '@/api/users';
import { manageUsersMessages } from '@/translations/manage-users';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import UsersTable from './components/UsersTable';
import { Box, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { globalMessages } from '@/translations/global';
import RoleFilter from './components/RoleFilter';

function ManageUsers({ queryParams }) {
  const intl = useIntl();
  const router = useRouter();

  console.log({ queryParams });

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

  const handleRoleChange = (role) => {
    const newQueryParams = {
      ...queryParams,
      roles: role,
      page: 1,
    };
    handleParamsChange(newQueryParams);
  };

  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(manageUsersMessages.pageTitle)}</title>
      </Head>

      <Box marginBottom="12px" display="flex" flexWrap="wrap" gap="12px">
        <TextField
          placeholder={intl.formatMessage(globalMessages.search)}
          size="small"
          value={queryParams.search}
        />
        <RoleFilter value={queryParams.roles} onChange={handleRoleChange} />
      </Box>
      <Box>
        {isSuccess && (
          <UsersTable
            data={data}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        )}
      </Box>
    </Fragment>
  );
}

export default ManageUsers;
