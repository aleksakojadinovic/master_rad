import { serverSideApi } from "@/services/server-side-api";
import { authSliceDefinition } from "./definition";

export const authSlice = serverSideApi.injectEndpoints(authSliceDefinition);
