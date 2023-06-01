import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

function SelectPerPage({ value, onChange }) {
  const handleChange = (e) => {
    onChange(parseInt(e.target.value, 10));
  };
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>Page size</InputLabel>
        <Select
          sx={{ height: '40px' }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={50}>20</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default SelectPerPage;
