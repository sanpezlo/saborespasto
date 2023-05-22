import { FormEvent, useCallback, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

import {
  RestaurantReviewAndAccount,
  RestaurantReviewsAndAccountSchema,
} from "@/types/RestaurantReviewAndAccount";
import { StarIcon } from "@heroicons/react/20/solid";
import { apiFetcher, apiFetcherSWR } from "@/lib/fetcher";
import Loading from "@/components/loading";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useLoadingContext } from "@/context/Loading";
import { useErrorContext } from "@/context/Error";
import {
  CreateRestaurantReview,
  CreateRestaurantReviewSchema,
  RestaurantReviewSchema,
} from "@/types/RestaurantReview";
import { handleErrorModal } from "@/lib/error";
import { useAuthContext } from "@/context/Auth";

export function Reviews({
  slug,
  restaurantRating,
  isAdmin = true,
}: {
  slug: string;
  restaurantRating: number;
  isAdmin?: boolean;
}) {
  const { account } = useAuthContext();
  const [openReview, setOpenReview] = useState(false);

  const { data: reviews, isLoading: isLoadingReviews } = useSWR<
    RestaurantReviewAndAccount[]
  >(
    () => (openReview ? `/reviews/restaurants/${slug}` : null),
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
  return (
    <div
      className={`pb-2 mb-4 ${
        !isAdmin && account ? "" : "border-b border-gray-200"
      }`}
    >
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Reseñas
      </h2>
      <div className="flex items-center my-2">
        {[0, 1, 2, 3, 4].map((rating) => (
          <StarIcon
            key={rating}
            className={`${
              (restaurantRating || 0) > rating
                ? "text-indigo-600"
                : "text-gray-200"
            } h-5 w-5 flex-shrink-0`}
            aria-hidden="true"
          />
        ))}
        <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {restaurantRating || 0} de 5
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

      {openReview &&
        (isLoadingReviews ? (
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
        ))}
      {!isAdmin && account && <FormReview slug={slug} />}
    </div>
  );
}

function FormReview({ slug }: { slug: string }) {
  const { setLoadingModal } = useLoadingContext();
  const { setErrorModal } = useErrorContext();

  const [review, setReview] = useState<CreateRestaurantReview>({
    comment: "",
    rating: 0,
    slug: slug,
  });

  const handleCreateRestaurantReview = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoadingModal({ title: "Publicando comentario..." });
      try {
        const createRestaurantReview = CreateRestaurantReviewSchema.parse({
          ...review,
          slug: slug,
        });

        await apiFetcher("/reviews/restaurants", {
          method: "POST",
          body: JSON.stringify(createRestaurantReview),
          schema: RestaurantReviewSchema,
        });

        setReview({ comment: "", rating: 0, slug: "" });
      } catch (error) {
        handleErrorModal(error, setErrorModal);
      } finally {
        setLoadingModal(null);
      }
    },
    [setLoadingModal, review, slug, setErrorModal]
  );

  return (
    <div className={"pb-2 mb-4"}>
      <form
        onSubmit={handleCreateRestaurantReview}
        className="mt-4 rounded-md bg-gray-100 p-4 border border-gray-200 shadow-sm"
      >
        <div className="space-y-2">
          <h3 className="text-lg font-bold tracking-tight text-gray-900">
            Deja tu comentario
          </h3>

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
                Escriba una reseña detallada que brinde información sobre su
                experiencia con el restaurante.
              </p>
            </div>
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
      </form>
    </div>
  );
}
