import { obtainStore } from "@/redux/server-side-store";
import { cookies } from "next/headers";

const useServerSideStore = async () => {
  const cookieList = cookies();
  return await obtainStore(cookieList);
};

export default useServerSideStore;
