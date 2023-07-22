import { assignMessages } from '@/translations/assign';
import { Box, Modal, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import UserSearchForm from './UsersSearchForm';
import { useGetUsersQuery } from '@/api/users';
import UserSearchResult from './UserSearchResult';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function UserAssignForm({ onClose, onSelect }) {
  const intl = useIntl();

  const [search, setSearch] = useState({
    page: 1,
    perPage: 100,
    includes: ['roles'],
  });
  const { data: results } = useGetUsersQuery(search, {
    skip: !open,
  });

  const handleChange = (searchValue) => {
    const newSearch = { page: 1, perPage: 100 };
    if (searchValue.roles) {
      newSearch.roles = searchValue.roles;
    }
    if (searchValue.searchString) {
      newSearch.searchString = searchValue.searchString;
    }

    newSearch.includes = ['roles'];

    setSearch(newSearch);
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      document.getElementById('users-search-results').focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6">
          {intl.formatMessage(assignMessages.formTitle)}
        </Typography>

        <Box marginTop="6px">
          <UserSearchForm
            availableRoles={['agent', 'administrator']}
            onChange={handleChange}
          />
        </Box>

        <Box marginTop="12px">
          <UserSearchResult users={results ?? []} onSelectUser={onSelect} />
        </Box>
      </Box>
    </Modal>
  );
}

export default UserAssignForm;
