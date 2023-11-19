import { useStoreUser } from '@/api/auth';
import Profile from '@/features/profile/Profile';
import { wrapper } from '@/redux/store';
import React from 'react';

function ProfilePage() {
  return <Profile />;
}

export default ProfilePage;

export const getServerSideProps = wrapper.getServerSideProps((store) => () => {
  const { isLoggedIn } = useStoreUser(store);
  if (!isLoggedIn) {
    return {
      redirect: {
        notFound: true,
      },
    };
  }
});
