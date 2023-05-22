import Head from "next/head";

import Loading from "@/components/loading";
import { useNoGuest } from "@/hooks/noGuest";
import {
  EditAccountProvider,
  useEditAccountContext,
} from "@/context/EditAccount";
import { Account } from "@/types/Account";

export default function MiRestaurante() {
  const { isLoadingAccount, account } = useNoGuest();

  if (isLoadingAccount)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Mi Cuenta</title>
        </Head>
        <main className="mt-10 mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <EditAccountProvider>
        <Head>
          <title> Sabores Pasto - Mi Cuenta </title>
        </Head>

        <main className="mt-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Informacion personal
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Detalles de la cuenta
            </p>
          </div>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Nombre completo
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {account?.name}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Correo electronico
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {account?.email}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Dirección
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {account?.address}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Telefono
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  +57 {account?.phone}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                {account && <EditAccountButton account={account} />}
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded "
                  onClick={() => {}}
                >
                  Cambiar contraseña
                </button>
              </div>
            </dl>
          </div>
        </main>
      </EditAccountProvider>
    </>
  );
}

function EditAccountButton({ account }: { account: Account }) {
  const { setEditAccountModal } = useEditAccountContext();

  return (
    <button
      className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => setEditAccountModal({ account })}
    >
      Editar perfil
    </button>
  );
}
