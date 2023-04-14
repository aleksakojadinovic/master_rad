import { clientSideApi } from "@/services/client-side-api";
import { authSliceDefinition } from "./definition";

export const authSlice = clientSideApi.injectEndpoints(authSliceDefinition);
