import { FormEvent, Fragment, useCallback, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSWRConfig } from "swr";

import { apiFetcher } from "@/lib/fetcher";
import { useLoadingContext } from "@/context/Loading";
import { handleErrorModal } from "@/lib/error";
import { useErrorContext } from "@/context/Error";
import { useNotificationContext } from "@/context/Notification";
import { PhotoIcon } from "@heroicons/react/24/solid";
import {
  Restaurant,
  UpdateRestaurant,
  UpdateRestaurantSchema,
} from "@/types/Restaurant";

export interface EditRestaurantModalProps {
  restaurant: Restaurant;
  onClose?: () => void;
}

export default function EditRestaurantModal({
  restaurant,
  onClose = () => {},
}: EditRestaurantModalProps) {
  const { mutate } = useSWRConfig();

  const [form, setForm] = useState<UpdateRestaurant>({
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address,
    phone: restaurant.phone,
    image: restaurant.image,
    slug: restaurant.slug,
  });

  const { setLoadingModal } = useLoadingContext();
  const { setErrorModal } = useErrorContext();
  const { setNotification } = useNotificationContext();

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoadingModal({ title: "Actualizando restaurante..." });
      try {
        const updateRestaurant = UpdateRestaurantSchema.parse(form);
        const prevRestaurant = UpdateRestaurantSchema.parse(restaurant);

        if (
          Object.keys(updateRestaurant).every(
            (key) =>
              (updateRestaurant as any)[key] === (prevRestaurant as any)[key]
          )
        )
          return;

        await apiFetcher("/restaurants/self", {
          method: "PUT",
          body: JSON.stringify(updateRestaurant),
        });

        setNotification({
          title: "Restaurante actualizado",
          description: "El restaurante se ha actualizado correctamente",
        });

        await mutate("/restaurants/dishes/self");
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
      restaurant,
      setErrorModal,
      setLoadingModal,
      setNotification,
    ]
  );

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
                  <div className="relative flex w-full items-center justify-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
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
                    <div>
                      <form className="bg-white " onSubmit={handleSubmit}>
                        <div className="space-y-12">
                          <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                              Actualizar restaurante
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                              Esta información será mostrada públicamente, así
                              que ten cuidado con lo que compartes.
                            </p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                              <div className="sm:col-span-4">
                                <label
                                  htmlFor="restaurant"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Nombre del restaurante
                                </label>
                                <div className="mt-2">
                                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                      type="text"
                                      name="restaurant"
                                      id="restaurant"
                                      autoComplete="restaurant"
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      placeholder="Burger King"
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
                                  htmlFor="slug"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Slug
                                </label>
                                <div className="mt-2">
                                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                      saborespasto.vercel.app/restaurantes/
                                    </span>
                                    <input
                                      type="text"
                                      name="slug"
                                      id="slug"
                                      autoComplete="slug"
                                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                      placeholder="burger-king"
                                      required
                                      value={form.slug}
                                      onChange={(e) =>
                                        setForm({
                                          ...form,
                                          slug: e.target.value,
                                        })
                                      }
                                    />
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
                                    placeholder="Burger King es una cadena de restaurantes de comida rápida estadounidense, especializada en hamburguesas."
                                    required
                                    value={form.description}
                                    onChange={(e) =>
                                      setForm({
                                        ...form,
                                        description: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-600">
                                  Escribe una breve descripción de tu
                                  restaurante.
                                </p>
                              </div>
                              <div className="col-span-full">
                                <label
                                  htmlFor="street-address"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Direccion
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="street-address"
                                    id="street-address"
                                    autoComplete="street-address"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Calle 1 # 2 - 3"
                                    required
                                    value={form.address}
                                    onChange={(e) =>
                                      setForm({
                                        ...form,
                                        address: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-4">
                                <label
                                  htmlFor="phone"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Telefono
                                </label>
                                <div className="mt-2">
                                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                      +57
                                    </span>
                                    <input
                                      type="text"
                                      name="phone"
                                      id="phone"
                                      autoComplete="phone"
                                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                      placeholder="3100000001"
                                      required
                                      value={form.phone}
                                      onChange={(e) =>
                                        setForm({
                                          ...form,
                                          phone: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
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
                                    placeholder="https://ibb.co/hLH5kjq"
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
                                  Escribe la url de la foto de tu restaurante,
                                  puedes usar el servicio de{" "}
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
                                  Proximamente podras subir una foto desde tu
                                  computador.
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
                            Editar
                          </button>
                        </div>
                      </form>
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
