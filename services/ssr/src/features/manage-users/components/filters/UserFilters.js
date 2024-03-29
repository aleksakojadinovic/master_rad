import React from 'react';
import { Box } from '@mui/material';
import SearchBox from './atoms/SearchBox';
import RoleFilter from './atoms/RoleFilter';
import StatusFilter from './atoms/StatusFilter';

function UserFilters({ value, onChange }) {
  const handleRoleChange = (role) => {
    onChange({
      ...value,
      roles: role,
      page: 1,
    });
  };

  const handleSearchChange = (search) => {
    const resolvedSearchValue = search.trim() || null;
    onChange({
      ...value,
      searchString: resolvedSearchValue,
      page: 1,
    });
  };

  const handleStatusChange = (status) => {
    onChange({
      ...value,
      statuses: status,
      page: 1,
    });
  };

  return (
    <Box marginBottom="12px" display="flex" flexWrap="wrap" gap="12px">
      <SearchBox value={value.searchString} onChange={handleSearchChange} />
      <RoleFilter value={value.roles} onChange={handleRoleChange} />
      <StatusFilter value={value.statuses} onChange={handleStatusChange} />
    </Box>
  );
}

export default UserFilters;
