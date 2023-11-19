import { validationMessages } from '@/translations/forms';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import * as Yup from 'yup';
import FormErrorMessage from '../create-ticket/components/FormErrorMessage';
import { createUserMessages } from '@/translations/manage-users';
import { generateRandomPassword } from './utils';
import { profileMessages } from '@/translations/profile';
import { useCreateUserMutation } from '@/api/users';
import ServerActionSnackbar from '@/components/ServerActionSnackbar/ServerActionSnackbar';
import { queryStatusMessages } from '@/translations/query-statuses';

const FormTextField = (props) => <TextField fullWidth {...props} />;

function CreateUser() {
  const intl = useIntl();

  const validationSchema = useMemo(() => {
    return Yup.object({
      username: Yup.string()
        .required(intl.formatMessage(validationMessages.errorFieldRequired))

        .min(
          8,
          intl.formatMessage(validationMessages.errorMinXCharacters, {
            x: 8,
          }),
        )
        .required(intl.formatMessage(validationMessages.errorFieldRequired)),
    });
  }, [intl]);

  const initialPassword = useMemo(() => generateRandomPassword(), []);

  const [createUser, { isLoading, isSuccess, isError, error }] =
    useCreateUserMutation();

  const handleSubmit = ({ username, password }) => {
    createUser({ username, password });
  };

  return (
    <Box marginTop="24px">
      <ServerActionSnackbar
        error={error}
        isError={isError}
        isLoading={isLoading}
        isSuccess={isSuccess}
        successMessage={queryStatusMessages.success}
      />
      <Box width="100%" height="100%">
        <Typography variant="h5">
          {intl.formatMessage(createUserMessages.createUserHeading)}
        </Typography>
        <Formik
          initialValues={{ username: '', password: initialPassword }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, onSubmit, isValid }) => (
            <Form>
              <label htmlFor="username">
                <Typography variant="caption">
                  {intl.formatMessage(profileMessages.usernameTitle)}
                </Typography>
              </label>
              <Field name="username" as={FormTextField} />
              {touched.username && errors.username && (
                <FormErrorMessage text={errors.username} />
              )}

              <label htmlFor="password">
                <Typography variant="caption">
                  {intl.formatMessage(profileMessages.passwordTitle)}
                </Typography>
              </label>
              <Field name="password" as={FormTextField} disabled />

              <Box marginTop="24px">
                <Alert severity="info">
                  <Typography variant="caption">
                    {intl.formatMessage(createUserMessages.createUserAlertText)}
                  </Typography>
                </Alert>
              </Box>

              <Button type="submit" onSubmit={onSubmit} disabled={!isValid}>
                {intl.formatMessage(createUserMessages.createUserCTA)}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default CreateUser;
