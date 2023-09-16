import React from 'react';
import { Box } from '@mui/material';
import SearchBox from './filters/SearchBox';
import RoleFilter from './filters/RoleFilter';
import StatusFilter from './filters/StatusFilter';

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
