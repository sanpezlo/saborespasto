import Head from "next/head";
import useSWR from "swr";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useShoppingCart } from "@/hooks/shoppingCart";

import Loading from "@/components/loading";
import { useNoAdmin } from "@/hooks/noAdmin";
import { Restaurant, RestaurantSchema } from "@/types/Restaurant";
import { ErrorResponse } from "@/types/ErrorResponse";
import { apiFetcherSWR } from "@/lib/fetcher";
import { useRouter } from "next/router";
import { Dish, DishesSchema } from "@/types/Dish";
import ShoppingCart from "@/components/shoppingCart";

import QuickviewsModal from "@/components/quickviewsModal";
import { useState } from "react";

export default function MiRestaurante() {
  const router = useRouter();
  const { slug } = router.query;

  const { account, isLoadingAccount } = useNoAdmin({
    redirectTo: "/mi-restaurante",
  });
  const { data: restaurant, isLoading: isLoadingRestaurant } = useSWR<
    Restaurant,
    ErrorResponse
  >(`/restaurants/${slug}`, apiFetcherSWR({ schema: RestaurantSchema }), {
    shouldRetryOnError: false,
  });

  const { data: dishes, isLoading: isLoadingDishes } = useSWR<
    Dish[],
    ErrorResponse
  >(
    () => (restaurant ? `/dishes/${restaurant.slug}` : null),
    apiFetcherSWR({
      schema: DishesSchema,
    }),
    {
      shouldRetryOnError: false,
    }
  );

  const { open, setOpen, cart, setCart } = useShoppingCart();
  const [dish, setDish] = useState<Dish | null>(null);

  if (isLoadingAccount || isLoadingRestaurant)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Restaurante</title>
        </Head>
        <main className="mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title> Sabores Pasto - Restaurante {restaurant?.name} </title>
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
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Platos
            </h2>

            {isLoadingDishes ? (
              <div className="mx-auto flex max-w-7xl items-center justify-center py-10">
                <Loading />
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {dishes &&
                  dishes.map((dish) => (
                    <div key={dish.id} className="group relative">
                      <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:h-80">
                        <img
                          src={dish.image}
                          alt={dish.description}
                          className="h-full w-full object-cover object-center lg:h-full lg:w-full group-hover:opacity-75"
                        />
                        <div className="absolute flex items-end justify-center opacity-0 focus:opacity-100 group-hover:opacity-100">
                          <div className="m-4 w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-sm text-black  text-center">
                            Vista rápida
                          </div>
                        </div>
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
            )}
          </div>
        </div>
      </main>
      {Boolean(account) ? (
        <>
          <button
            className="fixed bottom-0 right-0 z-10 w-auto p-4 bg-indigo-600 rounded-full m-6 shadow-xl hover:bg-indigo-700 outline-none hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500"
            onClick={() => setOpen(true)}
          >
            <div className="flex items-center mx-auto">
              <p className="flex items-center text-sm font-normal text-white">
                <ShoppingCartIcon className="w-7 h-7" />
                <span className="sr-only">Shopping Cart</span>
                {cart.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 fixed mb-11 ml-7">
                    {cart.length}
                  </span>
                )}
              </p>
            </div>
          </button>
          <ShoppingCart open={open} setOpen={setOpen} cart={cart} />
        </>
      ) : (
        <> </>
      )}
      {dish ? (
        <QuickviewsModal
          isAuth={Boolean(account)}
          dish={dish}
          cart={cart}
          setCart={setCart}
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
