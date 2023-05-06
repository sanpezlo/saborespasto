import { useRouter } from "next/router";
import useSWR from "swr";
import { FormEvent, useCallback, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";

import { apiFetcher, apiFetcherSWR } from "@/lib/fetcher";
import { handleErrorModal } from "@/lib/error";
import Head from "next/head";

import { CreateDish, CreateDishSchema } from "@/types/Dish";
import Loading from "@/components/loading";
import { useAdmin } from "@/hooks/admin";
import Link from "next/link";
import { CategoriesSchema, Category } from "@/types/Category";
import {
  DishAndCategories,
  DishAndCategoriesSchema,
} from "@/types/DishAndCategories";
import { useLoadingContext } from "@/context/Loading";
import { useErrorContext } from "@/context/Error";

export default function CrearRestaurante() {
  const { isLoadingAccount, mutateRestaurant } = useAdmin();
  const router = useRouter();

  const [form, setForm] = useState<CreateDish>({
    name: "",
    description: "",
    new_price: 0,
    image: "",
    categories: [],
  });

  const { setLoadingModal } = useLoadingContext();
  const { setErrorModal } = useErrorContext();

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
      setLoadingModal({ title: "Creando plato..." });
      try {
        e.preventDefault();
        const createDish = CreateDishSchema.parse(form);
        const { data: dish } = await apiFetcher<DishAndCategories>("/dishes", {
          method: "POST",
          body: JSON.stringify(createDish),
          schema: DishAndCategoriesSchema,
        });
        if (mutateRestaurant !== undefined)
          mutateRestaurant((restaurant) => {
            if (restaurant === undefined) return restaurant;
            if (restaurant.Dish.length === 0)
              return { ...restaurant, Dish: [dish] };
            return {
              ...restaurant,
              dishes: [dish, ...restaurant.Dish],
            };
          });
        router.replace("/mi-restaurante");
      } catch (error) {
        handleErrorModal(error, setErrorModal);
      } finally {
        setLoadingModal(null);
      }
    },
    [form, router, mutateRestaurant, setLoadingModal, setErrorModal]
  );

  if (isLoadingAccount || isLoadingCategories)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Crear Plato</title>
        </Head>
        <main className="mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title> Sabores Pasto - Crear Plato </title>
      </Head>

      <main className="mx-auto flex max-w-7xl items-center justify-center">
        <form className="bg-white " onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Crear plato
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
                        placeholder="Whopper"
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
                      placeholder="23.900"
                      required
                      value={form.new_price.toLocaleString("es-CO")}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          new_price:
                            parseInt(e.target.value.replace(/\D/g, "")) || 0,
                        })
                      }
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
                      defaultValue={""}
                      placeholder="Una hamburguesa de ternera a la parrilla, con tomate, lechuga fresca, mayonesa, pepinillos, un toque de ketchup y cebollas en rodajas en un panecillo suave con semillas de sésamo."
                      required
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Escribe una breve descripción de tu plato.
                  </p>
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
                    Escribe la url de la foto de tu plato, puedes usar el
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

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Categorias
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Selecciona las categorias que mejor describan tu plato.
            </p>

            <div className="mt-10 space-y-4">
              <fieldset>
                <div className="space-y-2">
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <div className="relative flex gap-x-3" key={category.id}>
                        <div className="flex h-6 items-center">
                          <input
                            id={category.id}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            checked={form.categories.includes(category.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setForm({
                                  ...form,
                                  categories: [
                                    ...form.categories,
                                    category.name,
                                  ],
                                });
                              } else {
                                setForm({
                                  ...form,
                                  categories: form.categories.filter(
                                    (cat) => cat !== category.name
                                  ),
                                });
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
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No hay categorias</p>
                  )}
                </div>
              </fieldset>
            </div>
          </div>

          <div className="my-6 flex items-center justify-end gap-x-6">
            <Link
              href="/mi-restaurante"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Atras
            </Link>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Crear
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
