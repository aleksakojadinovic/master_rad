import { Box } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import UserChip from './UserChip';
import { useTheme } from '@mui/material';

function UserSearchResult({ users, onSelectUser = () => {} }) {
  const theme = useTheme();
  const [currentHoverElement, setCurrentHoverElement] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    setCurrentHoverElement(null);
  }, [users]);

  useEffect(() => {
    if (currentHoverElement === null || resultsRef.current === null) {
      return;
    }
    const element = document.getElementById(`user-${currentHoverElement}`);
    const elementTop = element.offsetTop;

    resultsRef.current.scrollTop = elementTop;
  }, [currentHoverElement]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowDown') {
        setCurrentHoverElement((prev) =>
          prev === null || prev === users.length - 1 ? 0 : prev + 1,
        );
      }
      if (e.key === 'ArrowUp') {
        setCurrentHoverElement((prev) =>
          prev === null ? 0 : prev === 0 ? users.length - 1 : prev - 1,
        );
      }
      if (e.key === 'Enter') {
        if (currentHoverElement === null) {
          return;
        }
        const selectedUser = users[currentHoverElement];
        onSelectUser(selectedUser);
      }
    },
    [currentHoverElement, users, onSelectUser],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <Box
      ref={resultsRef}
      height="350px"
      sx={{ overflowY: 'scroll' }}
      position="relative"
      id="users-search-results"
    >
      {users.map((u, index) => (
        <Box
          key={u.id}
          id={`user-${index}`}
          marginTop="5px"
          marginBottom="5px"
          width="100%"
          sx={{
            backgroundColor:
              currentHoverElement === index ? theme.palette.grey[200] : 'white',
            '&:hover': { backgroundColor: theme.palette.grey[200] },
            cursor: 'pointer',
          }}
        >
          <UserChip user={u} onClick={() => {}} />
        </Box>
      ))}
    </Box>
  );
}

export default UserSearchResult;
