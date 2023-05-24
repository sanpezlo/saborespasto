import { useCallback, useEffect, useState } from "react";
import { useSWRConfig } from "swr";

import { useErrorContext } from "@/context/Error";
import { handleErrorModal } from "@/lib/error";
import { apiFetcher } from "@/lib/fetcher";
import { AccountAndFavorites } from "@/types/AccountAndFavorites";
import { Dish } from "@/types/Dish";
import { FavoriteDish, FavoriteDishSchema } from "@/types/FavoriteDish";

export function useFavoriteDish({
  account,
  dish,
}: {
  account: AccountAndFavorites | undefined;
  dish: Dish | undefined;
}) {
  const { mutate } = useSWRConfig();

  const { setErrorModal } = useErrorContext();

  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (account && account.FavoriteDish && dish) {
      const isFavorite = account.FavoriteDish.find(
        (favorite) => favorite.dishId === dish.id
      );
      if (isFavorite) setFavorite(true);
    }
  }, [account, dish]);

  const handleAddToFavorite = useCallback(async () => {
    if (!dish) return;
    try {
      setFavorite(true);
      await apiFetcher<FavoriteDish>(`/fovorites/dishes/${dish.id}`, {
        method: "POST",
        schema: FavoriteDishSchema,
      });

      await mutate("/accounts/favorites/self");
    } catch (error) {
      handleErrorModal(error, setErrorModal);
    }
  }, [mutate, dish, setErrorModal]);

  return {
    favorite,
    handleAddToFavorite,
  };
}
