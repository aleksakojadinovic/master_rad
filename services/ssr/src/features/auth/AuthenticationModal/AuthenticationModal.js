import { useLoginMutation } from '@/api/auth';
import { FormTextField } from '@/components/FormTextField';
import FormErrorMessage from '@/features/create-ticket/components/FormErrorMessage';
import { authModalMessages } from '@/translations/auth-modal';
import { validationMessages } from '@/translations/forms';
import { profileMessages } from '@/translations/profile';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';

import * as Yup from 'yup';

function AuthenticationModal({ onClose }) {
  const intl = useIntl();
  const validationSchema = useMemo(() => {
    return Yup.object({
      username: Yup.string().required(
        intl.formatMessage(validationMessages.errorFieldRequired),
      ),
      password: Yup.string().required(
        intl.formatMessage(validationMessages.errorFieldRequired),
      ),
    });
  }, [intl]);

  const [login, { isLoading, isSuccess, isError }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);

  const handleSubmit = ({ username, password }) => {
    login({ username, password });
  };

  return (
    <Dialog open onClose={onClose}>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <DialogTitle>Log in</DialogTitle>
            <DialogContent>
              <label htmlFor="username">
                <Typography variant="caption">
                  {intl.formatMessage(profileMessages.usernameTitle)}
                </Typography>
              </label>
              <Field name="username" as={FormTextField} />
              {touched.username && errors.username && (
                <FormErrorMessage text={errors.username} />
              )}

              <Box maginTop="12px">
                <label htmlFor="password">
                  <Typography variant="caption">
                    {intl.formatMessage(profileMessages.passwordTitle)}
                  </Typography>
                </label>
                <Field name="password" as={FormTextField} type="password" />
                {touched.lastName && errors.lastName && (
                  <FormErrorMessage text={errors.lastName} />
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                type="submit"
                onSubmit={handleSubmit}
                disabled={isLoading || isSuccess}
              >
                {intl.formatMessage(
                  isLoading || isSuccess
                    ? authModalMessages.loginButtonLoadingCTA
                    : authModalMessages.loginButtonCTA,
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

export default AuthenticationModal;
