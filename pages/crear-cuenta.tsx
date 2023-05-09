import Head from "next/head";
import Link from "next/link";

import Loading from "@/components/loading";
import { useGuest } from "@/hooks/guest";

export default function CrearCuenta() {
  const { isLoadingAccount } = useGuest();

  if (isLoadingAccount)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Crear Cuenta</title>
        </Head>
        <main className="mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title>Sabores Pasto - Crear Cuenta</title>
      </Head>

      <main className="bg-white">
        <div className="relative isolate px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Crea una cuenta
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Hay dos tipos de cuentas, una para administradores y otra para
                usuarios. Elige la que más te convenga, para más información
                <Link
                  href="/" // TODO: Change this to the correct link
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {" "}
                  haz click aquí.
                </Link>
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/crear-cuenta/usuario"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Usuario
                </Link>
                <Link
                  href="/crear-cuenta/administrador"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Administrador
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
