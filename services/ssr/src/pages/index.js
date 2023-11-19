import { useStoreUser } from '@/api/auth';
import { useAuthModal } from '@/features/auth/context/AuthModalContext';
import { wrapper } from '@/redux/store';
import { globalMessages } from '@/translations/global';
import Head from 'next/head';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

function IndexPage() {
  const intl = useIntl();
  const { setIsOpen } = useAuthModal();

  useEffect(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <Head>
      <title>{intl.formatMessage(globalMessages.genericPageTitle)}</title>
    </Head>
  );
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
