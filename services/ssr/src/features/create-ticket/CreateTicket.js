/* eslint-disable no-unused-vars */
import { useCreateTicketMutation } from '@/api/tickets';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Radio,
  RadioGroup,
  TextField,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';

function CreateTicket() {
  const [createTicket, { data, error, isSuccess, isError }] =
    useCreateTicketMutation();

  const handleSubmit = () => {
    createTicket({ title, body });
  };

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
    }
  }, [isSuccess, data]);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const renderAlert = () => {
    if (isSuccess) {
      return (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          Ticket successfully created, you can see it{' '}
          <Link href={`/tickets/view/${data.Id}`}>here</Link>
        </Alert>
      );
    }
    if (isError) {
      return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error.data.message}
        </Alert>
      );
    }
    return null;
  };

  return (
    <Fragment>
      {renderAlert()}
      <Typography variant="caption">Title of your issue</Typography>
      <TextField
        fullWidth
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* <Box marginTop="12px">
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
      </Box> */}

      <Box marginTop="12px">
        <Typography variant="caption">Describe your issue in detail</Typography>
        <Box marginTop="12px">
          <TextareaAutosize
            minRows={10}
            style={{ width: '100%' }}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </Box>
      </Box>

      <Button onClick={handleSubmit}>Submit</Button>
    </Fragment>
  );
}

export default CreateTicket;
