import Head from "next/head";
import Link from "next/link";

import Loading from "@/components/loading";
import { useAdmin } from "@/hooks/admin";

export default function MiRestaurante() {
  const { account, isLoadingAccount, restaurant, isLoadingRestaurant } =
    useAdmin();

  if (isLoadingAccount || isLoadingRestaurant)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Mi Restaurante</title>
        </Head>
        <main className="mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title> Sabores Pasto - Mi Restaurante </title>
      </Head>

      <main>
        <div className="overflow-hidden bg-white py-24 sm:py-32">
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
                <Link
                  href="/mi-restaurante/crear-plato"
                  className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700"
                >
                  Crear Plato
                </Link>
              </div>
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudGVzfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
                alt="Product screenshot"
                className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                width={2432}
                height={1442}
              />
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-center text-justify"></div>
      </main>
    </>
  );
}
