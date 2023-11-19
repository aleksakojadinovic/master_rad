import { useStoreUser } from '@/api/auth';
import { useAuthModal } from '@/features/auth/context/AuthModalContext';
import { wrapper } from '@/redux/store';
import { useEffect } from 'react';

function IndexPage() {
  const { setIsOpen } = useAuthModal();

  useEffect(() => {
    setIsOpen(true);
  }, [setIsOpen]);
  return null;
}

export default IndexPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const { isLoggedIn, isAgent, isAdministrator, isCustomer } =
      useStoreUser(store);
    if (!isLoggedIn) {
      return {};
    }
    if (isAgent) {
      return {
        redirect: {
          destination: '/dashboard/agent',
        },
      };
    }
    if (isAdministrator) {
      return {
        redirect: {
          destination: '/dashboard/admin',
        },
      };
    }
    if (isCustomer) {
      return {
        redirect: {
          destination: '/dashboard/customer',
        },
      };
    }
  },
);
