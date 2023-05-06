import { FormEvent, Fragment, useCallback, useState } from "react";
import useSWR from "swr";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";

import { CategoriesSchema, Category } from "@/types/Category";
import { apiFetcher, apiFetcherSWR } from "@/lib/fetcher";
import { DishAndCategories } from "@/types/DishAndCategories";
import { CreateCategoriesInDishesSchema } from "@/types/CategoriesInDishes";
import Loading from "@/components/loading";
import LoadingModal, {
  LoadingModalProps,
} from "@/components/modals/loadingModal";

export interface EditDishModalProps {
  dish: DishAndCategories;
  onClose?: () => void;
  onSubmit?: () => void;
  onError?: (error: unknown) => void;
  onSucess?: () => void;
}

export default function EditDishModal({
  dish,
  onClose = () => {},
  onSubmit = () => {},
  onError = () => {},
  onSucess = () => {},
}: EditDishModalProps) {
  const [open, setOpen] = useState(true);
  const [newCategories, setNewCategories] = useState<string[]>([]);
  const [loadingModal, setLoadingModal] = useState<LoadingModalProps | null>(
    null
  );

  const { data: categories, isLoading: isLoadingCategories } = useSWR<
    Category[]
  >(
    "/categories",
    apiFetcherSWR({
      method: "GET",
      schema: CategoriesSchema,
    }),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoadingModal({
        title: "Asignando categorias...",
      });
      try {
        onSubmit();
        const CreateCategoriesInDishes = CreateCategoriesInDishesSchema.parse({
          categories: newCategories,
          dishId: dish.id,
        });

        await apiFetcher("/categories/dishes", {
          method: "POST",
          body: JSON.stringify(CreateCategoriesInDishes),
        });

        onSucess();
      } catch (error) {
        onError(error);
      } finally {
        setLoadingModal(null);
        setOpen(false);
        onClose();
      }
    },
    [dish.id, newCategories, onClose, onSubmit, onError, onSucess]
  );

  return (
    <>
      {loadingModal && <LoadingModal title={loadingModal.title} />}
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
                          alt={""}
                          className="object-cover object-center"
                        />
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

                          <div className="mt-6">
                            <h4 className="sr-only">Comentarios</h4>
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                  <StarIcon
                                    key={rating}
                                    className={`${
                                      3.9 > rating
                                        ? "text-gray-900"
                                        : "text-gray-200"
                                    } h-5 w-5 flex-shrink-0`}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                              <p className="sr-only">{3.9} de 5 estrellas</p>
                              <a
                                href="#"
                                className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                10 Comentarios
                              </a>
                            </div>
                          </div>
                        </section>

                        <section
                          aria-labelledby="options-heading"
                          className="mt-10"
                        >
                          <h3 id="options-heading" className="sr-only">
                            Opciones del plato
                          </h3>

                          <form onSubmit={handleSubmit}>
                            <div className="mt-10 space-y-4">
                              <fieldset>
                                <div className="space-y-2">
                                  {isLoadingCategories ? (
                                    <Loading />
                                  ) : categories && categories.length > 0 ? (
                                    categories.map((category) => {
                                      if (
                                        dish.CategoriesInDishes.find(
                                          (cat) =>
                                            cat.category.id === category.id
                                        )
                                      ) {
                                        return (
                                          <div
                                            className="relative flex gap-x-3"
                                            key={category.id}
                                          >
                                            <div className="flex h-6 items-center">
                                              <input
                                                id={category.id}
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                checked
                                                disabled
                                              />
                                            </div>
                                            <div className="text-sm leading-6">
                                              <label
                                                htmlFor={category.id}
                                                className="font-medium text-gray-900"
                                              >
                                                {category.name}
                                              </label>
                                            </div>
                                          </div>
                                        );
                                      }

                                      return (
                                        <div
                                          className="relative flex gap-x-3"
                                          key={category.id}
                                        >
                                          <div className="flex h-6 items-center">
                                            <input
                                              id={category.id}
                                              type="checkbox"
                                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                              checked={newCategories.includes(
                                                category.name
                                              )}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  setNewCategories([
                                                    ...newCategories,
                                                    category.name,
                                                  ]);
                                                } else {
                                                  setNewCategories(
                                                    newCategories.filter(
                                                      (cat) =>
                                                        cat !== category.name
                                                    )
                                                  );
                                                }
                                              }}
                                            />
                                          </div>
                                          <div className="text-sm leading-6">
                                            <label
                                              htmlFor={category.id}
                                              className="font-medium text-gray-900"
                                            >
                                              {category.name}
                                            </label>
                                          </div>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <p className="text-sm text-gray-600">
                                      No hay categorias
                                    </p>
                                  )}
                                </div>
                              </fieldset>
                            </div>
                            <button
                              type="submit"
                              className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              Agregar Categoria
                            </button>
                          </form>
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
