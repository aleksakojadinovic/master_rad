import React, { useMemo, useRef } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useIntl } from 'react-intl';
import { validationMessages } from '@/translations/forms';
import FormErrorMessage from '@/features/create-ticket/components/FormErrorMessage';
import { changePasswordMessages } from '@/translations/profile';

const FormTextField = (props) => <TextField fullWidth {...props} />;

function ChangePassword() {
  const intl = useIntl();
  const resetFormRef = useRef();

  const validationSchema = useMemo(() => {
    return Yup.object({
      oldPassword: Yup.string()
        .min(
          8,
          intl.formatMessage(validationMessages.errorMinXCharacters, {
            x: 8,
          }),
        )
        .required(intl.formatMessage(validationMessages.errorFieldRequired)),

      newPassword: Yup.string()
        .min(
          8,
          intl.formatMessage(validationMessages.errorMinXCharacters, {
            x: 8,
          }),
        )
        .required(intl.formatMessage(validationMessages.errorFieldRequired)),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref('newPassword'), null],
          intl.formatMessage(validationMessages.errorPasswordsMustMatch),
        )
        .required(intl.formatMessage(validationMessages.errorFieldRequired)),
    });
  }, [intl]);

  const handleSubmit = (values, { resetForm }) => {
    // Perform password change logic here
    resetFormRef.current = resetForm;

    console.log('Password changed:', values.newPassword);

    resetForm();
  };

  return (
    <Formik
      initialValues={{ newPassword: '', confirmPassword: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <label htmlFor="oldPassword">
            <Typography variant="caption">
              {intl.formatMessage(changePasswordMessages.oldPasswordTitle)}
            </Typography>
          </label>
          <Field name="oldPassword" type="password" as={FormTextField} />
          {touched.oldPassword && errors.oldPassword && (
            <FormErrorMessage text={errors.oldPassword} />
          )}

          <Box marginTop="12px">
            <label htmlFor="newPassword">
              <Typography variant="caption">
                {intl.formatMessage(changePasswordMessages.newPasswordTitle)}
              </Typography>
            </label>
            <Field name="newPassword" type="password" as={FormTextField} />
            {touched.newPassword && errors.newPassword && (
              <FormErrorMessage text={errors.newPassword} />
            )}
          </Box>

          <Box marginTop="12px">
            <label htmlFor="confirmPassword">
              <Typography variant="caption">
                {intl.formatMessage(changePasswordMessages.repeatPasswordTitle)}
              </Typography>
            </label>
            <Field name="confirmPassword" type="password" as={FormTextField} />
          </Box>
          {touched.confirmPassword && errors.confirmPassword && (
            <FormErrorMessage text={errors.confirmPassword} />
          )}
          <Box marginTop="12px">
            <Button type="submit" variant="outlined">
              {intl.formatMessage(changePasswordMessages.changePasswordCTA)}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

export default ChangePassword;
