import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
} from "react";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

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
  mutateRestaurant?: Dispatch<SetStateAction<Restaurant | undefined>>;
};

const AuthContext = createContext<AuthenticationContext>({
  account: undefined,
  isLoadingAccount: true,
  mutateAccount: () => {},
  restaurant: undefined,
  isLoadingRestaurant: true,
  mutateRestaurant: () => {},
});

type AuthProviderProps = {
  children?: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    data: account,
    isLoading: isLoadingAccount,
    mutate: mutateAccount,
  } = useSWRImmutable<Account, ErrorResponse>(
    "/accounts/self",
    apiFetcherSWR({ schema: AccountSchema }),
    {
      shouldRetryOnError: false,
    }
  );

  const {
    data: restaurant,
    isLoading: isLoadingRestaurant,
    mutate: mutateRestaurant,
  } = useSWR<Restaurant, ErrorResponse>(
    () => (account && account.admin ? "/restaurants/self" : null),
    apiFetcherSWR({ schema: RestaurantSchema }),
    {
      shouldRetryOnError: false,
    }
  );

  return (
    <AuthContext.Provider
      value={{
        account,
        isLoadingAccount,
        mutateAccount,
        restaurant,
        isLoadingRestaurant,
        mutateRestaurant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
