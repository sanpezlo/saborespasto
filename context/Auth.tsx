import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
} from "react";
import useSWR from "swr";

import { Account, AccountSchema } from "@/types/Account";
import { apiFetcherSWR } from "@/lib/fetcher";
import { ErrorResponse } from "@/types/ErrorResponse";

type AuthenticationContext = {
  account?: Account;
  isLoading: boolean;
  mutate: Dispatch<SetStateAction<Account | undefined>>;
};

const AuthContext = createContext<AuthenticationContext>({
  account: undefined,
  isLoading: true,
  mutate: () => {},
});

type AuthProviderProps = {
  children?: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    data: account,
    isLoading,
    mutate,
  } = useSWR<Account, ErrorResponse>(
    "/accounts/self",
    apiFetcherSWR({ schema: AccountSchema }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return (
    <AuthContext.Provider
      value={{
        account,
        isLoading,
        mutate: mutate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
