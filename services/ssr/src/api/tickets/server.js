import { serverSideApi } from '@/services/server-side-api';
import { ticketsSliceDefinition } from './definition';
import { defineSelectors } from './selectors';

export const ticketsSlice = serverSideApi.injectEndpoints(
  ticketsSliceDefinition,
);

export const ticketsSliceSelectors = defineSelectors(ticketsSlice);
