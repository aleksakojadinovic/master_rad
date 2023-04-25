import { selectGetMeQueryResponse } from '@/api/auth';
import { wrapper } from '@/redux/store';
import { Typography } from '@mui/material';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

function DashboardPage() {
  const user = useSelector(selectGetMeQueryResponse);

  return (
    <Fragment>
      <Typography variant="h3">Welcome, {user.firstName}</Typography>
    </Fragment>
  );
}

export default DashboardPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const user = selectGetMeQueryResponse(store.getState());
    if (user == null) {
      return {
        redirect: {
          destination: '/',
        },
      };
    }
    return {};
  },
);
