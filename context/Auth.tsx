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
import { Restaurant, RestaurantSchema } from "@/types/Restaurant";

type AuthenticationContext = {
  account?: Account;
  isLoadingAccount: boolean;
  mutateAccount: Dispatch<SetStateAction<Account | undefined>>;
  restaurant?: Restaurant;
  isLoadingRestaurant: boolean;
};

const AuthContext = createContext<AuthenticationContext>({
  account: undefined,
  isLoadingAccount: true,
  mutateAccount: () => {},
  restaurant: undefined,
  isLoadingRestaurant: true,
});

type AuthProviderProps = {
  children?: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    data: account,
    isLoading: isLoadingAccount,
    mutate: mutateAccount,
  } = useSWR<Account, ErrorResponse>(
    "/accounts/self",
    apiFetcherSWR({ schema: AccountSchema }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: restaurant, isLoading: isLoadingRestaurant } = useSWR<
    Restaurant,
    ErrorResponse
  >(
    () => (account && account.admin ? "/restaurants/self" : null),
    apiFetcherSWR({ schema: RestaurantSchema })
  );

  return (
    <AuthContext.Provider
      value={{
        account,
        isLoadingAccount,
        mutateAccount,
        restaurant,
        isLoadingRestaurant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
