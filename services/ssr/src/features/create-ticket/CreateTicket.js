import { useCreateTicketMutation } from '@/api/tickets';
import { globalMessages } from '@/translations/global';
import { queryStatusMessages } from '@/translations/query-statuses';
import { createTicketMessages } from '@/translations/create-ticket';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  TextField,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { formsMessages, validationMessages } from '@/translations/forms';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  TICKET_BODY_MAX_LENGTH,
  TICKET_BODY_MIN_LENGTH,
  TICKET_TITLE_MAX_LENGTH,
  TICKET_TITLE_MIN_LENGTH,
} from '@/constants/forms';
import FormErrorMessage from './components/FormErrorMessage';

const FormTextField = (props) => <TextField fullWidth {...props} />;
const FormTextArea = (props) => (
  <TextareaAutosize minRows={10} style={{ width: '100%' }} {...props} />
);

function CreateTicket() {
  const intl = useIntl();
  const formResetRef = useRef();

  const validationSchema = useMemo(() => {
    return Yup.object({
      title: Yup.string()
        .min(
          TICKET_TITLE_MIN_LENGTH,
          intl.formatMessage(validationMessages.errorMinXCharacters, {
            x: TICKET_TITLE_MIN_LENGTH,
          }),
        )
        .max(
          TICKET_TITLE_MAX_LENGTH,
          intl.formatMessage(validationMessages.errorMaxXCharacters, {
            x: TICKET_TITLE_MAX_LENGTH,
          }),
        )
        .required(intl.formatMessage(validationMessages.errorFieldRequired)),
      body: Yup.string()
        .min(
          TICKET_BODY_MIN_LENGTH,
          intl.formatMessage(validationMessages.errorMinXCharacters, {
            x: TICKET_BODY_MIN_LENGTH,
          }),
        )
        .max(
          TICKET_BODY_MAX_LENGTH,
          intl.formatMessage(validationMessages.errorMaxXCharacters, {
            x: TICKET_BODY_MAX_LENGTH,
          }),
        )
        .required(intl.formatMessage(validationMessages.errorFieldRequired)),
    });
  }, [intl]);

  const [triggerCreateTicket, { data, error, isSuccess, isError }] =
    useCreateTicketMutation();

  useEffect(() => {
    if (isSuccess && formResetRef.current) {
      formResetRef.current();
    }
  }, [isSuccess]);

  const handleSubmit = ({ title, body }, { resetForm }) => {
    triggerCreateTicket({ title, body });
    formResetRef.current = resetForm;
  };

  const renderAlert = () => {
    if (isSuccess) {
      return (
        <Alert severity="success">
          <AlertTitle>
            {intl.formatMessage(queryStatusMessages.success)}
          </AlertTitle>
          <FormattedMessage
            {...createTicketMessages.success}
            values={{
              NewTicketLink: (
                <a href={`/tickets/view/${data.Id}`}>
                  {intl.formatMessage(globalMessages.clickHere)}
                </a>
              ),
            }}
          />
        </Alert>
      );
    }
    if (isError) {
      return (
        <Alert severity="error">
          <AlertTitle>
            {intl.formatMessage(queryStatusMessages.error)}
          </AlertTitle>
          {error.data.message}
        </Alert>
      );
    }
    return null;
  };

  return (
    <Formik
      initialValues={{ title: '', body: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          {renderAlert()}
          <label htmlFor="title">
            <Typography variant="caption">
              {intl.formatMessage(createTicketMessages.ticketTitleText)}
            </Typography>
          </label>
          <Field name="title" type="text" as={FormTextField} />
          {touched.title && errors.title && (
            <FormErrorMessage text={errors.title} />
          )}

          <Box marginTop="12px">
            <label htmlFor="body">
              <Typography variant="caption">
                {intl.formatMessage(createTicketMessages.ticketDescriptionText)}
              </Typography>
            </label>

            <Box marginTop="12px">
              <Field name="body" as={FormTextArea} />
            </Box>
            {touched.body && errors.body && (
              <FormErrorMessage text={errors.body} />
            )}
          </Box>

          <Button type="submit">
            {intl.formatMessage(formsMessages.submit)}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default CreateTicket;
