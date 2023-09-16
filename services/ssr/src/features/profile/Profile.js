import useUser from '@/hooks/useUser';
import { profileMessages } from '@/translations/profile';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import InactiveAlert from './components/InactiveAlert';

function Profile() {
  const intl = useIntl();
  const { isActive } = useUser();

  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(profileMessages.pageTitle)}</title>
      </Head>
      {!isActive && <InactiveAlert />}
    </Fragment>
  );
}

export default Profile;
