import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

import { apiFetcher } from "@/lib/fetcher";
import { parseErrorResponse } from "@/lib/error";
import Modal from "@/components/modal";
import { ErrorResponse } from "@/types/ErrorResponse";
import { CreateAccountSchema } from "@/types/Account";
import { ZodError } from "zod";
import Head from "next/head";

export default function CrearCuentaAdministrador() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    admin: true,
  });
  const [modal, setModal] = useState<{
    title: string;
    description: string;
    list: string[];
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const test = CreateAccountSchema.parse(form);
      const { data } = await apiFetcher("/accounts", {
        method: "POST",
        body: JSON.stringify(test),
      });
      router.push("/crear-restaurante");
    } catch (error) {
      if (error instanceof ZodError) {
        setModal({
          title: "Error: Datos inválidos",
          description: "",
          list: [
            "El nombre de usuario debe tener al menos 1 caracteres",
            "El correo electrónico debe ser valido y único",
            "La contraseña debe tener al menos 8 caracteres, contener una combinación de letras y números",
          ],
        });
      }
      const e = parseErrorResponse(error);
      if (e.status === 400) {
        setModal({ title: "Error", description: e.error.message, list: [] });
      }
    }
  };

  return (
    <>
      <Head>
        <title> Sabores Pasto - Crear Cuenta Administrador </title>
      </Head>
      <main className="mx-auto flex max-w-7xl items-center justify-center">
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
                Cancelar
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
      {modal ? (
        <Modal
          title={modal?.title ?? ""}
          description={modal?.description ?? ""}
          list={modal?.list ?? []}
          onClose={() => setModal(null)}
        />
      ) : (
        <></>
      )}
    </>
  );
}
