import Head from "next/head";
import Link from "next/link";

export default function CrearCuenta() {
  return (
    <>
      <Head>
        <title>Sabores Pasto - Crear cuenta</title>
      </Head>
      <main className="bg-white">
        <div className="relative isolate px-6 lg:px-8">
          <div
            className="absolute inset-x-0 -top-10 -z-10 transform-gpu overflow-hidden blur-3xl"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr rotate-[180deg] from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-35rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div
            className="absolute inset-x-0 -top-10 -z-10 transform-gpu overflow-hidden blur-3xl"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr rotate-[30deg] from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-70rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
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
          <div
            className="absolute inset-x-0 top-[calc(100%-20rem)]  sm:top-[calc(100%-40rem)] -z-10 transform-gpu overflow-hidden blur-3xl "
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr rotate-[180deg] from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-20rem)]  sm:top-[calc(100%-40rem)] -z-10 transform-gpu overflow-hidden blur-3xl "
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr  from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
