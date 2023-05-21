import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { FormEvent, useCallback, useState } from "react";

import { apiFetcher, apiFetcherSWR } from "@/lib/fetcher";
import { handleErrorModal } from "@/lib/error";
import Head from "next/head";

import Loading from "@/components/loading";
import { useAdmin } from "@/hooks/admin";
import Link from "next/link";
import {
  CategoriesSchema,
  Category,
  CategorySchema,
  CreateCategory,
  CreateCategorySchema,
} from "@/types/Category";
import { useLoadingContext } from "@/context/Loading";
import { useErrorContext } from "@/context/Error";

export default function CrearRestaurante() {
  const { mutate } = useSWRConfig();
  const { isLoadingAccount } = useAdmin();
  const router = useRouter();

  const [form, setForm] = useState<CreateCategory>({
    name: "",
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
    })
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      setLoadingModal({ title: "Creando categoria..." });
      try {
        e.preventDefault();
        const createCategory = CreateCategorySchema.parse(form);
        await apiFetcher<Category>("/categories", {
          method: "POST",
          body: JSON.stringify(createCategory),
          schema: CategorySchema,
        });

        await mutate("/categories");

        router.push("/mi-restaurante");
      } catch (error) {
        handleErrorModal(error, setErrorModal);
      } finally {
        setLoadingModal(null);
      }
    },
    [form, router, setLoadingModal, mutate, setErrorModal]
  );

  if (isLoadingAccount || isLoadingCategories)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Crear Categoria</title>
        </Head>
        <main className="mt-10 mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title> Sabores Pasto - Crear Categoria </title>
      </Head>

      <main className="mt-10 mx-auto flex max-w-7xl items-center justify-center">
        <form className="bg-white " onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Crear categoria
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Ya hay {categories?.length ?? 0} categorias creadas
              </p>

              <ul className="list-disc mt-2">
                {categories?.map((category) => (
                  <li
                    key={category.id}
                    className="text-sm leading-6 text-gray-600"
                  >
                    {category.name}
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="restaurant"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nombre de la categoria
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="restaurant"
                        id="restaurant"
                        autoComplete="restaurant"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Comidas rapidas"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
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
