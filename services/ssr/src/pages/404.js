import { globalMessages } from '@/translations/global';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function NotFound() {
  const intl = useIntl();
  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(globalMessages.notFound)}</title>
      </Head>
      <div>NotFound</div>
    </Fragment>
  );
}

export default NotFound;
