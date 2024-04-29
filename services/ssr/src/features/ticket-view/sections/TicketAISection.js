import { useLazyGetAISummaryQuery } from '@/api/ai';
import { aiMessagess } from '@/translations/ai';
import { globalMessages } from '@/translations/global';
import { resolveErrorMessage } from '@/utils/errors';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

const TicketAISection = ({ ticket }) => {
  const intl = useIntl();

  const [
    summarize,
    { data, error: apiError, isUninitialized, isLoading, isError, isSuccess },
  ] = useLazyGetAISummaryQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const error = useMemo(() => {
    if (!isError) {
      return null;
    }
    return resolveErrorMessage(intl, apiError);
  }, [intl, apiError, isError]);

  useEffect(() => {
    if (isSuccess) {
      setIsModalOpen(true);
    }
  }, [isSuccess]);

  return (
    <Fragment>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>AI summary</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{data?.message || null}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() => setIsModalOpen(false)}
          >
            {intl.formatMessage(globalMessages.close)}
          </Button>
        </DialogActions>
      </Dialog>
      <Box marginLeft="12px" marginTop="12px" marginBottom="12px">
        {isUninitialized && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => summarize({ ticketId: ticket.id })}
          >
            {intl.formatMessage(aiMessagess.requestButtonTitle)}
          </Button>
        )}
        {isSuccess && (
          <Button color="success" onClick={() => setIsModalOpen(true)}>
            {intl.formatMessage(aiMessagess.showButtonTitle)}
          </Button>
        )}
        {isLoading && intl.formatMessage(globalMessages.loading)}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Fragment>
  );
};

export default TicketAISection;
