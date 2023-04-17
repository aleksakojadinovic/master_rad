'use client';

import { Box } from '@mui/material';
import React from 'react';

export default function PageContainer({ children }) {
  return (
    <Box
      sx={{
        paddingTop: '24px',
        paddingLeft: '24px',
        paddingRight: '24px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      {children}
    </Box>
  );
}
