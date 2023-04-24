import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useState } from "react";

import { apiFetcher } from "@/lib/fetcher";
import { handleErrorModal } from "@/lib/error";
import ModalError, { ErrorModalProps } from "@/components/errorModal";
import {
  Account,
  AccountSchema,
  CreateAccount,
  CreateAccountSchema,
} from "@/types/Account";
import Head from "next/head";
import { AuthResponse } from "@/types/AuthResponse";
import LoadingModal, { LoadingModalProps } from "@/components/loadingModal";
import { Signin } from "@/types/Signin";
import Loading from "@/components/loading";
import { useGuest } from "@/hooks/guest";
import { useAuthContext } from "@/context/Auth";

export default function CrearCuentaUsuario() {
  const router = useRouter();
  const { isLoadingAccount } = useGuest();
  const { mutateAccount } = useAuthContext();

  const [form, setForm] = useState<CreateAccount>({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    admin: false,
  });
  const [errorModal, setModalError] = useState<ErrorModalProps | null>(null);
  const [loadingModal, setLoadingModal] = useState<LoadingModalProps | null>(
    null
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      setLoadingModal({
        title: "Creando cuenta...",
      });
      try {
        e.preventDefault();
        const createAccount = CreateAccountSchema.parse(form);
        const { data: account } = await apiFetcher<Account>("/accounts", {
          method: "POST",
          body: JSON.stringify(createAccount),
          schema: AccountSchema,
        });
        mutateAccount(account);

        setLoadingModal({
          title: "Iniciando sesión...",
        });

        const signin: Signin = {
          email: createAccount.email,
          password: createAccount.password,
        };
        await apiFetcher<AuthResponse>("/signin", {
          method: "POST",
          body: JSON.stringify(signin),
          refresh: false,
        });

        router.replace("/");
      } catch (error) {
        handleErrorModal(error, setModalError);
      } finally {
        setLoadingModal(null);
      }
    },
    [form, mutateAccount, router]
  );

  if (isLoadingAccount)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Crear Cuenta Usuario</title>
        </Head>
        <main className="mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title> Sabores Pasto - Crear Cuenta Usuario </title>
      </Head>

      {loadingModal && <LoadingModal title={loadingModal.title} />}

      <main className="mx-auto flex max-w-7xl items-center justify-center">
        <form className="bg-white " onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-10">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Crear cuenta como usuario
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="fullname"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nombre completo
                  </label>
                  <div className="mt-2">
                    <input
                      id="fullname"
                      name="fullname"
                      type="text"
                      autoComplete="fullname"
                      placeholder="Juan Perez"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                      }}
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Correo electrónico
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="juanperez@example.com"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                      }}
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Contraseña
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="********"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={form.password}
                      onChange={(e) => {
                        setForm({ ...form, password: e.target.value });
                      }}
                    />
                  </div>
                </div>
                <div className="sm:col-span-4">
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
                      value={form.address ?? ""}
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
                        value={form.phone ?? ""}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-x-6">
            <div className="relative flex gap-x-3">
              <div className="flex h-6 items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="text-sm leading-6">
                <label htmlFor="comments" className="font-medium text-gray-900">
                  Aceptar terminos y condiciones
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6">
              <Link
                href="/crear-cuenta"
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
          </div>
        </form>
      </main>

      {errorModal ? (
        <ModalError
          title={errorModal?.title ?? ""}
          description={errorModal?.description ?? ""}
          list={errorModal?.list ?? []}
          onClose={() => setModalError(null)}
        />
      ) : (
        <></>
      )}
    </>
  );
}
