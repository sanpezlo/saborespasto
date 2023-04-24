import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useState } from "react";

import ErrorModal, { ErrorModalProps } from "@/components/errorModal";
import { Signin, SigninSchema } from "@/types/Signin";
import { apiFetcher } from "@/lib/fetcher";
import { handleErrorModal } from "@/lib/error";
import LoadingModal from "@/components/loadingModal";
import { useSWRConfig } from "swr";
import Loading from "@/components/loading";
import { useGuest } from "@/hooks/guest";

export default function IniciarSesion() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { isLoadingAccount } = useGuest();

  const [form, setForm] = useState<Signin>({
    email: "",
    password: "",
  });
  const [errorModal, setErrorModal] = useState<ErrorModalProps | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      setIsloading(true);
      try {
        e.preventDefault();
        const signin = SigninSchema.parse(form);
        await apiFetcher("/signin", {
          method: "POST",
          body: JSON.stringify({
            email: signin.email,
            password: signin.password,
          }),
        });
        mutate("/accounts/self");
        router.push("/");
      } catch (error) {
        handleErrorModal(error, setErrorModal);
      } finally {
        setIsloading(false);
      }
    },
    [form, router, mutate]
  );

  return (
    <>
      <Head>
        <title> Sabores Pasto - Iniciar Sesion</title>
      </Head>

      {isLoading && <LoadingModal />}
      {isLoadingAccount ? (
        <main className="mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      ) : (
        <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            {/* <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          /> */}
            <div className="mx-auto h-10 w-auto text-gray-900">
              SaboresPastoImg
            </div>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Inicia sesión a tu cuenta
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Contraseña
                  </label>
                  <div className="text-sm">
                    <a
                      href="#" // TODO: Add link to forgot password page
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Iniciar sesión
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              {/* Not a member?{" "} */}
              {/* Español */}
              ¿No tienes una cuenta?{" "}
              <Link
                href="/crear-cuenta"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Registrate
              </Link>
            </p>
          </div>
        </main>
      )}
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
