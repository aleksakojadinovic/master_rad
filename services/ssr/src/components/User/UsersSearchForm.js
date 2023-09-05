import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useDebounce } from 'use-debounce';
import { Grid } from '@mui/material';
import { formsMessages } from '@/translations/forms';
import { globalMessages } from '@/translations/global';
import { useIntl } from 'react-intl';

const UserSearchForm = ({ availableRoles, onChange }) => {
  const intl = useIntl();

  const initialRender = useRef(true);
  const [searchString, setSearchString] = useState('');
  const [roles, setRoles] = useState();
  const [debouncedSearchString] = useDebounce(searchString, 200);

  const searchRef = useRef();

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    onChange({ roles, searchString: debouncedSearchString });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchString, roles]);

  useEffect(() => {
    searchRef.current.focus();
  });

  return (
    <form>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <TextField
            ref={searchRef}
            size="small"
            label={intl.formatMessage(formsMessages.search)}
            variant="outlined"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            size="small"
            options={availableRoles.map((r) => ({ label: r }))}
            value={roles}
            onChange={(_event, newRole) => {
              setRoles(newRole?.label);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={intl.formatMessage(globalMessages.roles)}
              />
            )}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default UserSearchForm;
