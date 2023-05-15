import { FormEvent, Fragment, useCallback, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";

import { CategoriesSchema, Category } from "@/types/Category";
import { apiFetcher, apiFetcherSWR } from "@/lib/fetcher";
import { DishAndCategories } from "@/types/DishAndCategories";
import { CreateCategoriesInDishesSchema } from "@/types/CategoriesInDishes";
import Loading from "@/components/loading";
import { useLoadingContext } from "@/context/Loading";
import { handleErrorModal } from "@/lib/error";
import { useErrorContext } from "@/context/Error";
import { useNotificationContext } from "@/context/Notification";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { UpdateDish, UpdateDishSchema } from "@/types/Dish";

export interface EditDishModalProps {
  dish: DishAndCategories;
  onClose?: () => void;
}

export default function EditDishModal({
  dish,
  onClose = () => {},
}: EditDishModalProps) {
  const [open, setOpen] = useState(true);

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
                      <div className="sm:col-span-4 lg:col-span-5">
                        <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={dish.image}
                            alt={""}
                            className="object-cover object-center"
                          />
                        </div>

                        <Categories
                          dish={dish}
                          setOpen={setOpen}
                          onClose={onClose}
                        />
                      </div>
                      <div className="sm:col-span-8 lg:col-span-7">
                        <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                          {dish.name}
                        </h2>
                        <section
                          aria-labelledby="information-heading"
                          className="mt-2 border-b border-gray-200 pb-6"
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
                        <EditDish
                          dish={dish}
                          setOpen={setOpen}
                          onClose={onClose}
                        />
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

function Categories({
  dish,
  setOpen,
  onClose,
}: {
  dish: DishAndCategories;
  setOpen: (open: boolean) => void;
  onClose: () => void;
}) {
  const { mutate } = useSWRConfig();

  const { setLoadingModal } = useLoadingContext();
  const { setErrorModal } = useErrorContext();
  const { setNotification } = useNotificationContext();

  const [newCategories, setNewCategories] = useState<string[]>([]);

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

  const handleCategoriesSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoadingModal({
        title: "Asignando categorias...",
      });
      try {
        const CreateCategoriesInDishes = CreateCategoriesInDishesSchema.parse({
          categories: newCategories,
          dishId: dish.id,
        });

        await apiFetcher("/categories/dishes", {
          method: "POST",
          body: JSON.stringify(CreateCategoriesInDishes),
        });

        setNotification({
          title: "Plato editado",
          description: "Tu plato ha sido editado exitosamente",
        });
        mutate("/restaurants/dishes/self");
      } catch (error) {
        handleErrorModal(error, setErrorModal);
      } finally {
        setLoadingModal(null);
        setOpen(false);
        onClose();
      }
    },
    [
      setLoadingModal,
      newCategories,
      dish.id,
      setNotification,
      mutate,
      setErrorModal,
      onClose,
    ]
  );

  return (
    <section aria-labelledby="categories-heading" className="mt-6">
      <h3 id="categories-heading" className="sr-only">
        Categorias del plato
      </h3>
      <form onSubmit={handleCategoriesSubmit}>
        <div className="space-y-4">
          <fieldset>
            <div className="space-y-2">
              {isLoadingCategories ? (
                <Loading />
              ) : categories && categories.length > 0 ? (
                categories.map((category) => {
                  if (
                    dish.CategoriesInDishes.find(
                      (cat) => cat.category.id === category.id
                    )
                  ) {
                    return (
                      <div className="relative flex gap-x-3" key={category.id}>
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
                    <div className="relative flex gap-x-3" key={category.id}>
                      <div className="flex h-6 items-center">
                        <input
                          id={category.id}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          checked={newCategories.includes(category.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewCategories([
                                ...newCategories,
                                category.name,
                              ]);
                            } else {
                              setNewCategories(
                                newCategories.filter(
                                  (cat) => cat !== category.name
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
                <p className="text-sm text-gray-600">No hay categorias</p>
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
  );
}

function EditDish({
  dish,
  setOpen,
  onClose,
}: {
  dish: DishAndCategories;
  setOpen: (open: boolean) => void;
  onClose: () => void;
}) {
  const { mutate } = useSWRConfig();

  const { setLoadingModal } = useLoadingContext();
  const { setErrorModal } = useErrorContext();
  const { setNotification } = useNotificationContext();

  const [form, setForm] = useState<UpdateDish>({
    id: dish.id,
    name: dish.name,
    description: dish.description,
    new_price: dish.new_price,
    image: dish.image,
  });

  const handleUpdateSubmit = useCallback(
    async (e: FormEvent) => {
      setLoadingModal({ title: "Actualizando plato..." });
      try {
        e.preventDefault();
        const updateDish = UpdateDishSchema.parse(form);
        const prevDish = UpdateDishSchema.parse(dish);
        if (
          Object.keys(updateDish).every(
            (key) => (updateDish as any)[key] === (prevDish as any)[key]
          )
        )
          return;

        await apiFetcher<DishAndCategories>("/dishes/", {
          method: "PUT",
          body: JSON.stringify(updateDish),
        });

        setNotification({
          title: "Plato editado",
          description: "Tu plato ha sido editado exitosamente",
        });

        mutate("/restaurants/dishes/self");
      } catch (error) {
        handleErrorModal(error, setErrorModal);
      } finally {
        setLoadingModal(null);
        setOpen(false);
        onClose();
      }
    },
    [
      form,
      mutate,
      onClose,
      setErrorModal,
      setLoadingModal,
      setNotification,
      setOpen,
    ]
  );

  return (
    <section aria-labelledby="edit-heading" className="mt-6">
      <form className="bg-white " onSubmit={handleUpdateSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h3
              id="edit-heading"
              className="text-lg font-semibold leading-7 text-gray-900"
            >
              Editar plato
            </h3>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="restaurant"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nombre del plato
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="restaurant"
                      id="restaurant"
                      autoComplete="restaurant"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Precio
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={form.new_price.toLocaleString("es-CO")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        new_price:
                          parseInt(e.target.value.replace(/\D/g, "")) || 0,
                      })
                    }
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="currency" className="sr-only">
                      Moneda
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                      disabled
                    >
                      <option>COP</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Descripcion
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="img"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Foto
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="img"
                    id="img"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                    value={form.image}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        image: e.target.value,
                      })
                    }
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Escribe la url de la foto de tu plato, puedes usar el servicio
                  de{" "}
                  <a
                    href="https://es.imgbb.com/"
                    target="_blank"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    ImgBB
                  </a>{" "}
                  para subir tu foto.
                </p>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          disabled
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Proximamente podras subir una foto desde tu computador.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Actualizar
          </button>
        </div>
      </form>
    </section>
  );
}
