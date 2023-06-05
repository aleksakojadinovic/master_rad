import {
  Box,
  Button,
  Radio,
  RadioGroup,
  TextField,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { Fragment } from 'react';

function CreateTicket() {
  return (
    <Fragment>
      <Typography variant="caption">Describe your issue shortly</Typography>
      <TextField fullWidth placeholder="Title" />
      <Box marginTop="12px">
        <Typography variant="caption">
          How urgent would you say this issue is?
        </Typography>
        <RadioGroup
          defaultValue="medium"
          name="radio-buttons-group"
          value="medium"
          row
        >
          <FormControlLabel value="low" control={<Radio />} label="Low" />
          <FormControlLabel value="medium" control={<Radio />} label="Medium" />
          <FormControlLabel value="high" control={<Radio />} label="High" />
        </RadioGroup>
      </Box>

      <Box marginTop="12px">
        <Typography variant="caption">
          Describe your issue in as much detail as you want
        </Typography>
        <Box marginTop="12px">
          <TextareaAutosize minRows={10} style={{ width: '100%' }} />
        </Box>
      </Box>

      <Button>Submit</Button>
    </Fragment>
  );
}

export default CreateTicket;
