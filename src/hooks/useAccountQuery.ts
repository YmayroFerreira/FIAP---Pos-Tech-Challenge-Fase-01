import { useQuery } from "@tanstack/react-query";
import { getAccount } from "@/services/account";
import { setAuthToken } from "@/services/api-config";

export const useAccountQuery = () => {
  return useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const authToken = localStorage.getItem("authToken") ?? "";
      await setAuthToken(authToken);
      return getAccount();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
};
