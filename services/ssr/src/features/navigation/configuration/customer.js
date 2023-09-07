import { defineMessages } from 'react-intl';

const messages = defineMessages({
  newTicket: {
    id: 'customer-links.new-ticket',
    defaultMessage: 'Create a new ticket',
  },
  contactUs: {
    id: 'customer-links.contact-us',
    defaultMessage: 'Contact us',
  },
  homePage: {
    id: 'customer-links.home-page',
    defaultMessage: 'Home',
  },
});

const CUSTOMER_LINKS_CONFIGURATION = [
  {
    id: 'customer-config-home-page',
    href: '/dashboard/customer',
    translation: messages.homePage,
  },
  {
    id: 'customer-config-new-ticket',
    href: '/tickets/create',
    translation: messages.newTicket,
  },
  {
    id: 'customer-config-contact-us',
    href: '/contact',
    translation: messages.contactUs,
  },
];

export default CUSTOMER_LINKS_CONFIGURATION;
