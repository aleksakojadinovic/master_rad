import useUser from '@/hooks/useUser';
import React from 'react';

function Profile() {
  const { isRegistered } = useUser();
  return <div>Profile</div>;
}

export default Profile;
