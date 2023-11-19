import { useStoreUser } from '@/api/auth';
import { usersSlice } from '@/api/users';
import CreateSuccess from '@/features/manage-users/components/create-success/CreateSuccess';
import { wrapper } from '@/redux/store';
import { Box } from '@mui/material';
import React from 'react';

function CreateUserSuccessPage(props) {
  return (
    <Box>
      <CreateSuccess {...props} />
    </Box>
  );
}

export default CreateUserSuccessPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { isAdministrator } = useStoreUser(store);

    if (!isAdministrator) {
      return {
        notFound: true,
      };
    }

    const { query } = context;

    if (!query?.id || !query?.password) {
      return {
        notFound: true,
      };
    }

    const user = await store.dispatch(
      usersSlice.endpoints.getUser.initiate({ id: query.id }),
    );

    if (user.isError) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        password: query.password,
        user: user.data,
      },
    };
  },
);
