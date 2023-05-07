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

export default function MiRestaurante() {
  const { isLoadingAccount, restaurant, isLoadingRestaurant } = useAdmin();

  const [dish, setDish] = useState<DishAndCategories | null>(null);

  const [openReview, setOpenReview] = useState(false);

  const { data: reviews, isLoading: isLoadingReviews } = useSWR<
    RestaurantReviewAndAccount[]
  >(
    () =>
      restaurant && openReview
        ? `/reviews/restaurants/${restaurant.slug}`
        : null,
    apiFetcherSWR({ schema: RestaurantReviewsAndAccountSchema }),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      refreshInterval: 0,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );

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
            <div className="pb-2 mb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Reseñas
              </h2>
              <div className="flex items-center my-2">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={`${
                      (restaurant?.rating || 0) > rating
                        ? "text-indigo-600"
                        : "text-gray-200"
                    } h-5 w-5 flex-shrink-0`}
                    aria-hidden="true"
                  />
                ))}
                <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {restaurant?.rating || 0} de 5
                </p>
                <button
                  className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => {
                    setOpenReview((prev) => !prev);
                  }}
                >
                  {openReview ? "Ocultar comentarios" : "Ver comentarios"}
                </button>
              </div>

              {openReview ? (
                isLoadingReviews ? (
                  <Loading />
                ) : (
                  <div className="mt-4">
                    {reviews &&
                      reviews.map((review) => (
                        <div key={review.id} className="flex items-start">
                          <UserCircleIcon className="h-10 w-10 text-gray-600 mt-0" />
                          <div className="ml-1 w-full">
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              {review.account.name}
                            </span>
                            <div className="mt-1 bg-gray-100 p-2 rounded-md text-sm text-gray-600">
                              <p>{review.comment}</p>
                            </div>
                            <div className="flex items-center my-2">
                              {[0, 1, 2, 3, 4].map((rating) => (
                                <StarIcon
                                  key={rating}
                                  className={`${
                                    (review.rating || 0) > rating
                                      ? "text-gray-600"
                                      : "text-gray-200"
                                  } h-5 w-5 flex-shrink-0`}
                                  aria-hidden="true"
                                />
                              ))}
                              <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {review.rating || 0} de 5
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )
              ) : (
                <></>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Platos
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {restaurant?.Dish &&
                  restaurant.Dish.map((dish) => (
                    <div key={dish.id} className="group relative">
                      <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                        <img
                          src={dish.image}
                          alt={dish.description}
                          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                        />
                      </div>
                      <div className="flex mt-2 flex-wrap gap-2">
                        {dish.CategoriesInDishes.map((categoryInDish) => (
                          <div
                            key={categoryInDish.id}
                            className="text-xs rounded-full bg-gray-200 px-3 py-1.5 font-medium text-gray-600"
                          >
                            {categoryInDish.category.name}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <h3 className="text-sm text-gray-700">
                            <button onClick={() => setDish(dish)}>
                              <span
                                aria-hidden="true"
                                className="absolute inset-0"
                              />
                              {dish.name}
                            </button>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {dish.description}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {dish.price && dish.price - dish.new_price > 0 && (
                              <span className="text-red-500 line-through">
                                ${dish.price.toLocaleString("es-Co")}
                              </span>
                            )}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            ${dish.new_price.toLocaleString("es-Co")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center mt-2">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-indigo-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>First star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-indigo-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Second star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-indigo-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Third star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-indigo-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Fourth star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-300 dark:text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Fifth star</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                          4.95 de 5
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      {dish ? (
        <EditDishModal
          dish={dish}
          onClose={() => {
            setDish(null);
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
}
