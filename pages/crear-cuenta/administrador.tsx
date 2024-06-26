import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useEffect, useState } from "react";

import { apiFetcher } from "@/lib/fetcher";
import { handleErrorModal } from "@/lib/error";
import { CreateAccount, CreateAccountSchema } from "@/types/Account";
import Head from "next/head";
import { useAuthContext } from "@/context/Auth";
import { AuthResponse } from "@/types/AuthResponse";
import { Signin } from "@/types/Signin";
import Loading from "@/components/loading";
import { useGuest } from "@/hooks/guest";
import { useLoadingContext } from "@/context/Loading";
import { useErrorContext } from "@/context/Error";
import {
  AccountAndFavorites,
  AccountAndFavoritesSchema,
} from "@/types/AccountAndFavorites";

export default function CrearCuentaAdministrador() {
  const router = useRouter();
  const { isLoadingAccount } = useGuest();
  const { mutateAccount } = useAuthContext();

  const [form, setForm] = useState<CreateAccount>({
    name: "",
    email: "",
    password: "",
    phone: null,
    address: null,
    admin: true,
  });

  const { setLoadingModal } = useLoadingContext();
  const { setErrorModal } = useErrorContext();

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      setLoadingModal({
        title: "Creando cuenta...",
      });
      try {
        e.preventDefault();
        const createAccount = CreateAccountSchema.parse(form);
        const { data: account } = await apiFetcher<AccountAndFavorites>(
          "/accounts",
          {
            method: "POST",
            body: JSON.stringify(createAccount),
            schema: AccountAndFavoritesSchema,
          }
        );

        setLoadingModal({
          title: "Iniciando sesión...",
        });

        const signin: Signin = {
          email: createAccount.email,
          password: createAccount.password,
        };
        const { data } = await apiFetcher<AuthResponse>("/signin", {
          method: "POST",
          body: JSON.stringify(signin),
          refresh: false,
        });

        await mutateAccount(account);
        router.push("/crear-restaurante");
      } catch (error) {
        handleErrorModal(error, setErrorModal);
      } finally {
        setLoadingModal(null);
      }
    },
    [form, mutateAccount, router, setLoadingModal, setErrorModal]
  );

  if (isLoadingAccount)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Crear Cuenta Administrador</title>
        </Head>
        <main className="mt-10 mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title> Sabores Pasto - Crear Cuenta Administrador </title>
      </Head>

      <main className="mt-10 mx-auto flex max-w-7xl items-center justify-center">
        <form className="bg-white " onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-10">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Crear cuenta como administrador
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
                      placeholder="Pedro Sanchez"
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
                      placeholder="pedrosanchez@example.com"
                      required
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
    </>
  );
}
