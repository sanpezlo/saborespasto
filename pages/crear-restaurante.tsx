import { useRouter } from "next/router";
import { FormEvent, useCallback, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";

import { apiFetcher } from "@/lib/fetcher";
import { handleErrorModal } from "@/lib/error";
import ErrorModal, { ErrorModalProps } from "@/components/errorModal";
import Head from "next/head";
import {
  CreateRestaurant,
  CreateRestaurantSchema,
  Restaurant,
  RestaurantSchema,
} from "@/types/Restaurant";
import LoadingModal, { LoadingModalProps } from "@/components/loadingModal";
import Loading from "@/components/loading";
import { useAdmin } from "@/hooks/admin";

export default function CrearRestaurante() {
  const { isLoadingAccount, mutateRestaurant } = useAdmin();
  const router = useRouter();

  const [form, setForm] = useState<CreateRestaurant>({
    name: "",
    description: "",
    address: "",
    phone: "",
    image: "",
    slug: "",
  });
  const [errorModal, setErrorModal] = useState<ErrorModalProps | null>(null);
  const [loadingModal, setLoadingModal] = useState<LoadingModalProps | null>(
    null
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      setLoadingModal({ title: "Creando restaurante..." });
      try {
        e.preventDefault();
        const createRestaurant = CreateRestaurantSchema.parse(form);
        const { data: restaurant } = await apiFetcher<Restaurant>(
          "/restaurants",
          {
            method: "POST",
            body: JSON.stringify(createRestaurant),
            schema: RestaurantSchema,
          }
        );
        if (mutateRestaurant !== undefined) mutateRestaurant(restaurant);
        router.replace("mi-restaurante");
      } catch (error) {
        handleErrorModal(error, setErrorModal);
      } finally {
        setLoadingModal(null);
      }
    },
    [form, router, mutateRestaurant]
  );

  if (isLoadingAccount)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Crear Restaurante</title>
        </Head>
        <main className="mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title> Sabores Pasto - Crear Restaurante </title>
      </Head>

      {loadingModal && <LoadingModal title={loadingModal.title} />}

      <main className="mx-auto flex max-w-7xl items-center justify-center">
        <form className="bg-white " onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Crear restaurante
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Esta información será mostrada públicamente, así que ten cuidado
                con lo que compartes.
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
                          setForm({ ...form, name: e.target.value })
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
                          setForm({ ...form, slug: e.target.value })
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
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Escribe una breve descripción de tu restaurante.
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
                        setForm({ ...form, address: e.target.value })
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
                          setForm({ ...form, phone: e.target.value })
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
                        setForm({ ...form, image: e.target.value })
                      }
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Escribe la url de la foto de tu restaurante, puedes usar el
                    servicio de{" "}
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
              Crear
            </button>
          </div>
        </form>
      </main>

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
