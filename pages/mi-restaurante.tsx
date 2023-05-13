import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";

import Loading from "@/components/loading";
import { useAdmin } from "@/hooks/admin";
import { useState } from "react";
import EditDishModal from "@/components/modals/editDishModal";
import { DishAndCategories } from "@/types/DishAndCategories";
import { useSWRConfig } from "swr";
import { StarIcon } from "@heroicons/react/20/solid";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import {
  RestaurantReviewAndAccount,
  RestaurantReviewsAndAccountSchema,
} from "@/types/RestaurantReviewAndAccount";
import { apiFetcherSWR } from "@/lib/fetcher";
import { EditDishProvider, useEditDishContext } from "@/context/EditDish";
import { Dishes } from "@/components/restaurants/dishes";
import { Reviews } from "@/components/restaurants/reviews";

export default function MiRestaurante() {
  const { isLoadingAccount, restaurant, isLoadingRestaurant } = useAdmin();

  if (isLoadingAccount || isLoadingRestaurant)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Mi Restaurante</title>
        </Head>
        <main className="mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <EditDishProvider>
        <Head>
          <title> Sabores Pasto - Mi Restaurante </title>
        </Head>

        <main>
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
                  <Link
                    href="/mi-restaurante/crear-plato"
                    className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700 mb-2"
                  >
                    Crear Plato
                  </Link>
                  <Link
                    href="/mi-restaurante/crear-categoria"
                    className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700"
                  >
                    Crear Categoria
                  </Link>
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
            <div className="mx-auto max-w-2xl px-4 pb-10 sm:px-6 lg:max-w-7xl lg:px-8">
              <Reviews
                slug={restaurant?.slug || ""}
                restaurantRating={restaurant?.rating || 0}
              />
              <Dishes dishes={restaurant?.Dish || []} isAdmin />
            </div>
          </div>
        </main>
      </EditDishProvider>
    </>
  );
}
