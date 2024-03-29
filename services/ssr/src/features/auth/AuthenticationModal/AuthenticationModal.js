import { useLoginMutation } from '@/api/auth';
import { FormTextField } from '@/components/FormTextField';
import FormErrorMessage from '@/features/create-ticket/components/FormErrorMessage';
import useServerMessage from '@/hooks/useServerMessage';
import { authModalMessages } from '@/translations/auth-modal';
import { validationMessages } from '@/translations/forms';
import { profileMessages } from '@/translations/profile';
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
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';

import * as Yup from 'yup';
import { useAuthModal } from '../context/AuthModalContext';

function AuthenticationModal() {
  const { setIsOpen } = useAuthModal();
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

  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();

  const { errorMessage } = useServerMessage({
    error,
    isSuccess,
    isError,
    successMessage: '',
  });

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);

  const handleSubmit = ({ username, password }) => {
    login({ username, password });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open onClose={handleClose}>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <DialogTitle>
              {intl.formatMessage(authModalMessages.modalTitle)}
            </DialogTitle>
            <DialogContent>
              <Alert severity="info">
                {intl.formatMessage(authModalMessages.loginDetails)}
              </Alert>
              <label htmlFor="username">
                <Typography variant="caption">
                  {intl.formatMessage(profileMessages.usernameTitle)}
                </Typography>
              </label>
              <Field name="username" as={FormTextField} />
              {touched.username && errors.username && (
                <FormErrorMessage text={errors.username} />
              )}

              <Box marginTop="12px">
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

              {isError && <Alert severity="error">{errorMessage}</Alert>}
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
