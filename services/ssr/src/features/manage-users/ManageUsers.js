import { manageUsersMessages } from '@/translations/manage-users';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function ManageUsers() {
  const intl = useIntl();
  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(manageUsersMessages.pageTitle)}</title>
      </Head>
    </Fragment>
  );
}

export default ManageUsers;
