import { useStoreUser } from '@/api/auth';
import CreateUser from '@/features/manage-users/CreateUser';
import { wrapper } from '@/redux/store';
import { createUserMessages } from '@/translations/manage-users';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function CreateUserPage() {
  const intl = useIntl();
  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(createUserMessages.pageTitle)}</title>
      </Head>
      <CreateUser />
    </Fragment>
  );
}

export default CreateUserPage;

export const getServerSideProps = wrapper.getServerSideProps((store) => () => {
  const { isAdministrator } = useStoreUser(store);

  if (!isAdministrator) {
    return {
      notFound: true,
    };
  }

  return { props: {} };
});
