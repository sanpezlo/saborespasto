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
import {
  RestaurantAndDishes,
  RestaurantAndDishesSchema,
} from "@/types/RestaurantAndDishes";
import {
  AccountAndFavorites,
  AccountAndFavoritesSchema,
} from "@/types/AccountAndFavorites";

type AuthenticationContext = {
  account?: AccountAndFavorites;
  isLoadingAccount: boolean;
  mutateAccount: Dispatch<SetStateAction<AccountAndFavorites | undefined>>;
  restaurant?: RestaurantAndDishes;
  isLoadingRestaurant: boolean;
  mutateRestaurant?: Dispatch<SetStateAction<RestaurantAndDishes | undefined>>;
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
  } = useSWRImmutable<AccountAndFavorites, ErrorResponse>(
    "/accounts/favorites/self",
    apiFetcherSWR({ schema: AccountAndFavoritesSchema }),
    {
      shouldRetryOnError: false,
    }
  );

  const {
    data: restaurant,
    isLoading: isLoadingRestaurant,
    mutate: mutateRestaurant,
  } = useSWR<RestaurantAndDishes, ErrorResponse>(
    () => (account && account.admin ? "/restaurants/dishes/self" : null),
    apiFetcherSWR({ schema: RestaurantAndDishesSchema }),
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
