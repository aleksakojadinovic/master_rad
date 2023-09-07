import { defineMessages } from 'react-intl';

const messages = defineMessages({
  homePage: {
    id: 'admin-links.home-page',
    defaultMessage: 'Home',
  },
  ticketsSearch: {
    id: 'admin-links.tickets-search',
    defaultMessage: 'Search',
  },
  tags: {
    id: 'admin-links.tags',
    defaultMessage: 'Tags',
  },
  users: {
    id: 'admin-links.users',
    defaultMessage: 'Users',
  },
  metrics: {
    id: 'admin-link.metrics',
    defaultMessage: 'Metrics',
  },
});

const ADMIN_LINKS_CONFIGURATION = [
  {
    id: 'admin-config-home-page',
    href: '/dashboard/admin',
    translation: messages.homePage,
  },
  {
    id: 'admin-config-tickets-search',
    href: '/tickets/search',
    translation: messages.ticketsSearch,
  },
  {
    id: 'admin-config-tags',
    href: '/manage/tags',
    translation: messages.tags,
  },
  {
    id: 'admin-config-users',
    href: '/manage/users',
    translation: messages.users,
  },
  {
    id: 'admin-config-metrics',
    href: '/metrics',
    translation: messages.metrics,
  },
];

export default ADMIN_LINKS_CONFIGURATION;
