import { defineMessages } from 'react-intl';

export const formsMessages = defineMessages({
  submit: {
    id: 'forms.submit',
    defaultMessage: 'Submit',
  },
  search: {
    id: 'forms.search',
    defaultMessage: 'Search',
  },
  page: {
    id: 'forms.page',
    defaultMessage: 'Page',
  },
  perPage: {
    id: 'forms.perPage',
    defaultMessage: 'Per page',
  },
  resetFilters: {
    id: 'forms.reset',
    defaultMessage: 'Reset all filters',
  },
});

export const validationMessages = defineMessages({
  errorMinXCharacters: {
    id: 'validation.min-x-characters',
    defaultMessage: 'Must be at least {x} characeters long.',
  },
  errorMaxXCharacters: {
    id: 'validation.max-x-characters',
    defaultMessage: 'Can be at most {x} characters long.',
  },
  errorFieldRequired: {
    id: 'validation.field-required',
    defaultMessage: 'This field is required.',
  },
});
