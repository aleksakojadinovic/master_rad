import { manageTagsMessages } from '@/translations/tags';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

function IntlTable({ value, onChange }) {
  const intl = useIntl();
  const values = useMemo(
    () =>
      Object.entries(value).map(([key, v]) => ({
        languageCode: key,
        value: v,
      })),
    [value],
  );

  const handleChange = ({ languageCode, value: newValue }) => {
    onChange({ ...value, [languageCode]: newValue });
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '100%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              {intl.formatMessage(manageTagsMessages.languageCode)}
            </TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {values.map(({ languageCode, value: val }) => (
            <TableRow key={languageCode}>
              <TableCell>{languageCode}</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  value={val}
                  size="small"
                  onChange={(e) =>
                    handleChange({ languageCode, value: e.target.value })
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default IntlTable;
