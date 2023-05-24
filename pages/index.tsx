import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { MinusSmallIcon } from "@heroicons/react/24/outline";

import { useNoAdmin } from "@/hooks/noAdmin";
import Loading from "@/components/loading";
import { apiFetcherSWR } from "@/lib/fetcher";
import { Restaurant, RestaurantsSchema } from "@/types/Restaurant";
import { ErrorResponse } from "@/types/ErrorResponse";
import { AccountAndFavorites } from "@/types/AccountAndFavorites";

export default function Home() {
  const { isLoadingAccount, account } = useNoAdmin({
    redirectTo: "/mi-restaurante",
  });

  const { data: restaurants, isLoading: isLoadingRestaurants } = useSWR<
    Restaurant[],
    ErrorResponse
  >("/restaurants", apiFetcherSWR({ schema: RestaurantsSchema }), {
    shouldRetryOnError: false,
  });

  if (isLoadingAccount || isLoadingRestaurants)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Inicio</title>
        </Head>
        <main className="mt-10 mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title> Sabores Pasto - Inicio </title>
      </Head>
      <main className="mt-10 mx-auto max-w-7xl">
        <Restaurants restaurants={restaurants} />

        <FavoritesRestaurants account={account} />
      </main>
    </>
  );
}

function Restaurants({
  restaurants,
}: {
  restaurants: Restaurant[] | undefined;
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? (restaurants?.length || 0) - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, restaurants?.length]);

  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === (restaurants?.length || 0) - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, restaurants?.length]);

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentIndex(slideIndex);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <>
      {restaurants && restaurants.length > 0 && (
        <div className="max-w-[1400px] h-[780px] w-full m-auto py-16 px-10 relative group border-b border-gray-200 mb-10">
          <div
            style={{
              backgroundImage: `url(${restaurants[currentIndex].image})`,
            }}
            className="w-full h-full rounded-2xl bg-center bg-cover duration-500 ease-in-out transition-all hover:scale-105 cursor-pointer"
            onClick={() => {
              router.push(`/restaurantes/${restaurants[currentIndex].slug}`);
            }}
          ></div>
          <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
            <ChevronLeftIcon className="w-6 h-6" onClick={prevSlide} />
          </div>
          <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
            <ChevronRightIcon className="w-6 h-6" onClick={nextSlide} />
          </div>
          <div className="flex top-4 justify-center py-2">
            {restaurants.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className="text-2xl cursor-pointer"
              >
                <MinusSmallIcon
                  className={`w-8 h-8 text-gray-400 ${
                    currentIndex === slideIndex ? "text-gray-800" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function FavoritesRestaurants({
  account,
}: {
  account: AccountAndFavorites | undefined;
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? (account?.FavoriteRestaurant.length || 0) - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [account?.FavoriteRestaurant.length, currentIndex]);

  const nextSlide = useCallback(() => {
    const isLastSlide =
      currentIndex === (account?.FavoriteRestaurant.length || 0) - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [account?.FavoriteRestaurant.length, currentIndex]);

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentIndex(slideIndex);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <>
      {account && account.FavoriteRestaurant.length > 0 && (
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800 ml-10">
            Tus restaurantes favoritos
          </h1>
          <div className="max-w-[1400px] h-[780px] w-full m-auto py-16 px-10 relative group">
            <div
              style={{
                backgroundImage: `url(${account.FavoriteRestaurant[currentIndex].restaurant.image})`,
              }}
              className="w-full h-full rounded-2xl bg-center bg-cover duration-500 ease-in-out transition-all hover:scale-105 cursor-pointer"
              onClick={() => {
                router.push(
                  `/restaurantes/${account.FavoriteRestaurant[currentIndex].restaurant.slug}`
                );
              }}
            ></div>
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <ChevronLeftIcon className="w-6 h-6" onClick={prevSlide} />
            </div>
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <ChevronRightIcon className="w-6 h-6" onClick={nextSlide} />
            </div>
            <div className="flex top-4 justify-center py-2">
              {account.FavoriteRestaurant.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                  className="text-2xl cursor-pointer"
                >
                  <MinusSmallIcon
                    className={`w-8 h-8 text-gray-400 ${
                      currentIndex === slideIndex ? "text-gray-800" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
