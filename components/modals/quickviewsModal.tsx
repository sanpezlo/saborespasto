import { FormEvent, Fragment, useCallback, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { HeartIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import useSWR, { useSWRConfig } from "swr";

import { Dish } from "@/types/Dish";
import {
  CreateDishReview,
  CreateDishReviewSchema,
  DishReviewSchema,
} from "@/types/DishReview";
import { apiFetcher, apiFetcherSWR } from "@/lib/fetcher";
import { useLoadingContext } from "@/context/Loading";
import { useErrorContext } from "@/context/Error";
import { handleErrorModal } from "@/lib/error";
import { useNotificationContext } from "@/context/Notification";
import { useShoppingCartContext } from "@/context/ShoppingCart";
import { useAuthContext } from "@/context/Auth";
import { useFavoriteDish } from "@/hooks/favoriteDish";
import {
  DishReviewAndAccount,
  DishReviewsAndAccountSchema,
} from "@/types/DishReviewAndAccount";
import Loading from "@/components/loading";

export interface QuickviewsModalProps {
  dish: Dish;
  onClose?: () => void;
}

export default function QuickviewsModal({
  dish,
  onClose = () => {},
}: QuickviewsModalProps) {
  const { mutate } = useSWRConfig();

  const [open, setOpen] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [openReview, setOpenReview] = useState(false);

  const { data: reviews, isLoading: isLoadingReviews } = useSWR<
    DishReviewAndAccount[]
  >(
    () => (openReview ? `/reviews/dishes/${dish.id}` : null),
    apiFetcherSWR({ schema: DishReviewsAndAccountSchema }),
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

  const { account } = useAuthContext();
  const { setLoadingModal } = useLoadingContext();
  const { setErrorModal } = useErrorContext();
  const { setNotification } = useNotificationContext();
  const { setCart } = useShoppingCartContext();

  const handleShoppingCartSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setCart((prev) => {
        const product = prev.find((p) => p.dish.id === dish.id);
        if (product) {
          product.quantity += quantity;
          return [...prev];
        }
        return [...prev, { dish, quantity }];
      });
      setNotification({
        title: "Platillo agregado al carrito",
        description: `${dish.name} - ${quantity}`,
      });
      onClose();
      setOpen(false);
    },
    [setCart, setNotification, dish, quantity, onClose]
  );

  const [review, setReview] = useState<CreateDishReview>({
    dishId: dish.id,
    rating: 0,
    comment: "",
  });

  const handleReviewSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoadingModal({ title: "Publicando comentario..." });
      try {
        const createDishReview = CreateDishReviewSchema.parse(review);

        await apiFetcher("/reviews/dishes", {
          method: "POST",
          body: JSON.stringify(createDishReview),
          schema: DishReviewSchema,
        });

        setReview({ comment: "", rating: 0, dishId: dish.id });

        await mutate("/accounts/favorites/self");

        setNotification({
          title: "Reseña publicada",
          description: "Tu reseña ha sido publicada con éxito",
        });
      } catch (error) {
        handleErrorModal(error, setErrorModal);
      } finally {
        setLoadingModal(null);
      }
    },
    [setLoadingModal, review, dish.id, mutate, setNotification, setErrorModal]
  );

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            onClose();
            setOpen(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                enterTo="opacity-100 translate-y-0 md:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              >
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                  <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                    <button
                      type="button"
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                      onClick={() => {
                        onClose();
                        setOpen(false);
                      }}
                    >
                      <span className="sr-only">Cerrar</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                      <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="object-cover object-center"
                        />

                        <FavoriteButton dish={dish} />
                      </div>
                      <div className="sm:col-span-8 lg:col-span-7">
                        <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                          {dish.name}
                        </h2>

                        <section
                          aria-labelledby="information-heading"
                          className="mt-2"
                        >
                          <h3 id="information-heading" className="sr-only">
                            Información del plato
                          </h3>

                          <p className="text-2xl text-gray-900">
                            ${dish.new_price.toLocaleString("es-Co")}
                          </p>

                          <div className="mt-2">
                            <h4 className="sr-only">Comentarios</h4>
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                  <StarIcon
                                    key={rating}
                                    className={`${
                                      dish.rating > rating
                                        ? "text-gray-900"
                                        : "text-gray-200"
                                    } h-5 w-5 flex-shrink-0`}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                              <p className="sr-only">
                                {dish.rating} de 5 estrellas
                              </p>
                              <button
                                className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() => {
                                  setOpenReview((prev) => !prev);
                                }}
                              >
                                {openReview
                                  ? "Ocultar comentarios"
                                  : "Ver comentarios"}
                              </button>
                            </div>

                            {openReview &&
                              (isLoadingReviews ? (
                                <Loading />
                              ) : (
                                <div className="mt-4">
                                  {reviews &&
                                    reviews.map((review) => (
                                      <div
                                        key={review.id}
                                        className="flex items-start"
                                      >
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
                              ))}

                            {account &&
                              account.DishReview.every(
                                (review) => review.dishId !== dish.id
                              ) && (
                                <div className="mt-4 rounded-md bg-gray-50 p-4 border border-gray-100 shadow-sm   focus-within:shadow focus-within:border-gray-200 hover:shadow hover:border-gray-200">
                                  <form onSubmit={handleReviewSubmit}>
                                    <div className="space-y-2">
                                      <div className="m-0">
                                        <h5 className="sr-only">
                                          Comparte tu reseña
                                        </h5>
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
                                              required
                                              onChange={(e) =>
                                                setReview({
                                                  ...review,
                                                  comment: e.target.value,
                                                })
                                              }
                                              value={review.comment}
                                            />
                                          </div>
                                          <p className="mt-3 text-sm leading-6 text-gray-600">
                                            Escriba una reseña detallada que
                                            brinde información sobre su opinión
                                            del plato.
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-end justify-between">
                                        <div>
                                          <h4 className="block text-sm font-medium leading-6 text-gray-900 mb-1">
                                            Estrellas
                                          </h4>
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
                                                    setReview({
                                                      ...review,
                                                      rating: rating + 1,
                                                    })
                                                  }
                                                />
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <button
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                                          >
                                            Publicar reseña
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              )}
                          </div>
                        </section>

                        <section
                          aria-labelledby="options-heading"
                          className="mt-2 bg-white p-4 rounded-md"
                        >
                          <h3 id="options-heading" className="sr-only">
                            Opciones del plato
                          </h3>

                          {account && (
                            <form onSubmit={handleShoppingCartSubmit}>
                              <div>
                                <label
                                  htmlFor="quantity"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Cantidad
                                </label>
                                <div className="mt-2">
                                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                      type="number"
                                      min={1}
                                      step={1}
                                      name="quantity"
                                      id="quantity"
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      required
                                      value={quantity}
                                      onChange={(e) =>
                                        setQuantity(parseInt(e.target.value))
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <button
                                type="submit"
                                className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              >
                                Agregar al carrito
                              </button>
                            </form>
                          )}
                        </section>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

function FavoriteButton({ dish }: { dish: Dish | undefined }) {
  const { account } = useAuthContext();

  const { handleAddToFavorite, favorite } = useFavoriteDish({
    dish,
    account,
  });

  return (
    <>
      {account && (
        <button
          onClick={handleAddToFavorite}
          className={`inline-flex items-center justify-center rounded-lg ${
            favorite
              ? "bg-white bg-opacity-50 text-red-600"
              : "text-transparent hover:text-red-600 hover:bg-white hover:bg-opacity-50"
          }`}
          disabled={favorite}
        >
          <HeartIcon className="h-10 w-10" />
        </button>
      )}
    </>
  );
}
