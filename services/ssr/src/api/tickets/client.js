import { clientSideApi } from '@/services/client-side-api';
import { ticketsSliceDefinition } from './definition';
import { defineSelectors } from './selectors';

export const ticketsSlice = clientSideApi.injectEndpoints(
  ticketsSliceDefinition,
);

export const { useGetTicketQuery } = ticketsSlice;

export const ticketsSliceSelectors = defineSelectors(ticketsSlice);
