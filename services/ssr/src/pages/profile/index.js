import { useStoreUser } from '@/api/auth';
import Profile from '@/features/profile/Profile';
import { wrapper } from '@/redux/store';
import React, { Fragment } from 'react';

function ProfilePage() {
  return (
    <Fragment>
      <Profile />
    </Fragment>
  );
}

export default ProfilePage;

export const getServerSideProps = wrapper.getServerSideProps((store) => () => {
  const { isLoggedIn } = useStoreUser(store);
  if (!isLoggedIn) {
    return {
      redirect: {
        destination: '/404',
      },
    };
  }
});
