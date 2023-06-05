import CustomerLandingPage from '@/features/customer-landing-page/CustomerLandingPage';
import Head from 'next/head';
import React, { Fragment } from 'react';

function CustomerPage() {
  return (
    <Fragment>
      <Head>
        <title>Customer | STS</title>
      </Head>
      <CustomerLandingPage />
    </Fragment>
  );
}

export default CustomerPage;
