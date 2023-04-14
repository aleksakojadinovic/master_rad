import { clientSideApi } from "@/services/client-side-api";
import { authSliceDefinition } from "./definition";
import { defineSelectors } from "./selectors";

export const authSlice = clientSideApi.injectEndpoints(authSliceDefinition);

export const { useGetMeQuery, useLoginMutation } = authSlice;

export const authSliceSelectors = defineSelectors(authSlice);
