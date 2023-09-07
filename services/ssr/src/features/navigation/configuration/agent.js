import { defineMessages } from 'react-intl';

const messages = defineMessages({
  homePage: {
    id: 'agent-links.home-page',
    defaultMessage: 'Home',
  },
  ticketsSearch: {
    id: 'agent-links.tickets-search',
    defaultMessage: 'Search',
  },
});

const AGENT_LINKS_CONFIGURATION = [
  {
    id: 'agent-config-home-page',
    href: '/',
    translation: messages.homePage,
  },
  {
    id: 'agent-config-tickets-search',
    href: '/tickets/search',
    translation: messages.ticketsSearch,
  },
];

export default AGENT_LINKS_CONFIGURATION;
