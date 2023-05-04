import Head from "next/head";
import useSWR from "swr";
import {
  PhotoIcon,
  ShoppingCartIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useShoppingCart } from "@/hooks/shoppingCart";

import Loading from "@/components/loading";
import { useNoAdmin } from "@/hooks/noAdmin";
import { ErrorResponse } from "@/types/ErrorResponse";
import { apiFetcher, apiFetcherSWR } from "@/lib/fetcher";
import { useRouter } from "next/router";
import { Dish } from "@/types/Dish";
import ShoppingCart from "@/components/shoppingCart";

import QuickviewsModal from "@/components/quickviewsModal";
import { FormEvent, useCallback, useState } from "react";
import Notification, { NotificationProps } from "@/components/notification";
import OrderModal, { OrderModalProps } from "@/components/orderModal";
import ErrorModal, { ErrorModalProps } from "@/components/errorModal";
import { handleErrorModal } from "@/lib/error";
import {
  RestaurantAndDishes,
  RestaurantAndDishesSchema,
} from "@/types/RestaurantAndDishes";
import LoadingModal, { LoadingModalProps } from "@/components/loadingModal";
import {
  CreateRestaurantReview,
  CreateRestaurantReviewSchema,
  RestaurantReviewSchema,
} from "@/types/RestaurantReview";
import { StarIcon } from "@heroicons/react/20/solid";

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

  const { open, setOpen, cart, setCart } = useShoppingCart();
  const [dish, setDish] = useState<Dish | null>(null);
  const [notification, setNotification] = useState<null | NotificationProps>(
    null
  );
  const [orderModal, setOrderModal] = useState<null | OrderModalProps>(null);
  const [errorModal, setErrorModal] = useState<ErrorModalProps | null>(null);
  const [loadingModal, setLoadingModal] = useState<LoadingModalProps | null>(
    null
  );
  const [review, setReview] = useState<CreateRestaurantReview>({
    comment: "",
    rating: 0,
    restaurantId: "",
  });

  const handleCreateRestaurantReview = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoadingModal({ title: "Publicando comentario..." });
      try {
        const createRestaurantReview = CreateRestaurantReviewSchema.parse({
          ...review,
          restaurantId: restaurant?.id,
        });

        await apiFetcher("/restaurants/reviews", {
          method: "POST",
          body: JSON.stringify(createRestaurantReview),
          schema: RestaurantReviewSchema,
        });

        setReview({ comment: "", rating: 0, restaurantId: "" });
      } catch (error) {
        handleErrorModal(error, setErrorModal);
      } finally {
        setLoadingModal(null);
      }
    },
    [setErrorModal, setLoadingModal, restaurant, review]
  );

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

      {loadingModal && <LoadingModal title={loadingModal.title} />}

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
            <form onSubmit={handleCreateRestaurantReview}>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Reseñas
                </h2>

                <div className="mt-6">
                  <h4 className="sr-only">Estrellas</h4>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={`${
                            review.rating > rating
                              ? "text-indigo-600"
                              : "text-gray-200"
                          } h-5 w-5 flex-shrink-0`}
                          aria-hidden="true"
                          onClick={() =>
                            setReview((prev) => ({
                              ...prev,
                              rating: rating + 1,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Tu reseña
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={""}
                        required
                        onChange={(e) =>
                          setReview({ ...review, comment: e.target.value })
                        }
                        value={review.comment}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Escriba una reseña detallada que brinde información sobre
                      su experiencia con el restaurante.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Publicar reseña
                </button>
              </div>
            </form>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Platos
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {restaurant?.Dish &&
                restaurant.Dish.map((dish) => (
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
      </main>
      {account ? (
        <>
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
          <ShoppingCart
            open={open}
            setOpen={setOpen}
            cart={cart}
            setCart={setCart}
            onClick={() =>
              setOrderModal({
                account: account,
                cart: cart,
                restaurantId: restaurant?.id || "",
              })
            }
            onEmpty={() => {
              setNotification({
                title: "Carrito vacío",
                description: "Has eliminado todos los platillos del carrito",
              });
            }}
            onRemove={(product) => {
              setNotification({
                title: "Platillo eliminado del carrito",
                description: `${product.dish.name}`,
              });
            }}
          />
          {notification && (
            <Notification
              title={notification.title}
              description={notification.description}
              onClose={() => setNotification(null)}
            />
          )}
          {orderModal && (
            <OrderModal
              account={orderModal.account}
              cart={orderModal.cart}
              restaurantId={orderModal.restaurantId}
              onClose={() => setOrderModal(null)}
              onError={(error) => {
                handleErrorModal(error, setErrorModal);
              }}
              onSucess={() => {
                setNotification({
                  title: "Orden procesada",
                  description: "Tu orden ha sido realizada con éxito",
                });
                setCart([]);
              }}
            />
          )}
        </>
      ) : (
        <> </>
      )}
      {dish ? (
        <QuickviewsModal
          isAuth={Boolean(account)}
          dish={dish}
          setCart={setCart}
          onClose={() => {
            setDish(null);
          }}
          onSubmit={(product) => {
            setNotification({
              title: "Platillo agregado al carrito",
              description: `${product.dish.name} - ${product.quantity}`,
            });
          }}
        />
      ) : (
        <></>
      )}
      {errorModal ? (
        <ErrorModal
          title={errorModal?.title ?? ""}
          description={errorModal?.description ?? ""}
          list={errorModal?.list ?? []}
          onClose={() => setErrorModal(null)}
        />
      ) : (
        <></>
      )}
    </>
  );
}
