import { serverSideApi } from '@/services/server-side-api';
import { authSliceDefinition } from './definition';
import { defineSelectors } from './selectors';

export const authSlice = serverSideApi.injectEndpoints(authSliceDefinition);

export const authSliceSelectors = defineSelectors(authSlice);
