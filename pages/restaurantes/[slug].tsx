import { FormEvent, useCallback, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

import Loading from "@/components/loading";
import { useNoAdmin } from "@/hooks/noAdmin";
import { ErrorResponse } from "@/types/ErrorResponse";
import { apiFetcherSWR } from "@/lib/fetcher";
import ShoppingCart from "@/components/shoppingCart";

import {
  RestaurantAndDishes,
  RestaurantAndDishesSchema,
} from "@/types/RestaurantAndDishes";

import {
  ShoppingCartProvider,
  useShoppingCartContext,
} from "@/context/ShoppingCart";
import { OrderProvider } from "@/context/Order";
import { QuickviewsProvider } from "@/context/Quickviews";
import { Dishes } from "@/components/restaurants/dishes";
import { Reviews } from "@/components/restaurants/reviews";

export default function MiRestaurante() {
  const router = useRouter();
  const { slug } = router.query;

  const { account, isLoadingAccount } = useNoAdmin({
    redirectTo: "/mi-restaurante",
  });
  const { data: restaurant, isLoading: isLoadingRestaurant } = useSWR<
    RestaurantAndDishes,
    ErrorResponse
  >(
    `/restaurants/dishes/${slug}`,
    apiFetcherSWR({ schema: RestaurantAndDishesSchema }),
    {
      shouldRetryOnError: false,
    }
  );

  if (isLoadingAccount || isLoadingRestaurant)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Restaurante</title>
        </Head>
        <main className="mt-10 mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <ShoppingCartProvider>
      <QuickviewsProvider>
        <Head>
          <title> Sabores Pasto - Restaurante {restaurant?.name} </title>
        </Head>

        <main className="mt-10">
          <div className="overflow-hidden bg-white pb-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                <div className="lg:pr-8 lg:pt-4 flex flex-col justify-center">
                  <div className="lg:max-w-lg">
                    <h1 className="font text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                      {restaurant?.name}
                    </h1>

                    <p className="my-4 text-xl text-gray-500">
                      {restaurant?.description}
                    </p>
                  </div>
                </div>
                <img
                  src={restaurant?.image}
                  alt="Product screenshot"
                  className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                  width={2432}
                  height={1442}
                />
              </div>
            </div>
          </div>
          <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 pb-10 sm:px-6 lg:max-w-7xl lg:px-8 ">
              <Reviews
                slug={restaurant?.slug || ""}
                restaurantRating={restaurant?.rating || 0}
                isAdmin={false}
              />
              <Dishes dishes={restaurant?.Dish || []} />
            </div>
          </div>
        </main>
        <footer className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
          <div
            className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
              }}
            />
          </div>
          <div
            className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm leading-6 text-gray-900">
              <strong className="font-semibold">{restaurant?.name}</strong>
              <svg
                viewBox="0 0 2 2"
                className="mx-2 inline h-0.5 w-0.5 fill-current"
                aria-hidden="true"
              >
                <circle cx={1} cy={1} r={1} />
              </svg>
              +57 {restaurant?.phone} – {restaurant?.address}.
            </p>
          </div>
          <div className="flex flex-1 justify-end"></div>
        </footer>
        {account && (
          <OrderProvider>
            <ShoppingCartButton />
            <ShoppingCart restaurantId={restaurant?.id || ""} />
          </OrderProvider>
        )}
      </QuickviewsProvider>
    </ShoppingCartProvider>
  );
}

function ShoppingCartButton() {
  const { setOpen, cart } = useShoppingCartContext();

  return (
    <button
      className="fixed bottom-0 right-0 z-10 w-auto p-4 bg-indigo-600 rounded-full m-6 shadow-xl hover:bg-indigo-700 outline-none hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500"
      onClick={() => setOpen(true)}
    >
      <div className="flex items-center mx-auto">
        <p className="flex items-center text-sm font-normal text-white">
          <ShoppingCartIcon className="w-7 h-7" />
          <span className="sr-only">Carrito de compras</span>
          {cart.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 fixed mb-11 ml-7">
              {cart.length}
            </span>
          )}
        </p>
      </div>
    </button>
  );
}
