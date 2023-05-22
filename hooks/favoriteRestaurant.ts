import { useCallback, useEffect, useState } from "react";
import { useSWRConfig } from "swr";

import { useErrorContext } from "@/context/Error";
import { handleErrorModal } from "@/lib/error";
import { apiFetcher } from "@/lib/fetcher";
import { AccountAndFavorites } from "@/types/AccountAndFavorites";
import {
  FavoriteRestaurant,
  FavoriteRestaurantSchema,
} from "@/types/FavoriteRestaurant";
import { Restaurant } from "@/types/Restaurant";

export function useFavoriteRestaurant({
  account,
  restaurant,
}: {
  account: AccountAndFavorites | undefined;
  restaurant: Restaurant | undefined;
}) {
  const { mutate } = useSWRConfig();

  const { setErrorModal } = useErrorContext();

  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (account && account.FavoriteRestaurant && restaurant) {
      const isFavorite = account.FavoriteRestaurant.find(
        (favorite) => favorite.restaurantId === restaurant.id
      );
      if (isFavorite) setFavorite(true);
    }
  }, [account, restaurant]);

  const handleAddToFavorite = useCallback(async () => {
    if (!restaurant) return;
    try {
      setFavorite(true);
      await apiFetcher<FavoriteRestaurant>(
        `/fovorites/retaurants/${restaurant.slug}`,
        {
          method: "POST",
          schema: FavoriteRestaurantSchema,
        }
      );

      await mutate("/accounts/favorites/self");
    } catch (error) {
      handleErrorModal(error, setErrorModal);
    }
  }, [mutate, restaurant, setErrorModal]);

  return {
    favorite,
    handleAddToFavorite,
  };
}
