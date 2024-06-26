import Link from "next/link";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import { useAuthContext } from "@/context/Auth";
import Loading from "@/components/loading";
import Image from "next/image";

export default function Header() {
  const { account, isLoadingAccount } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-900/10">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Sabores Pasto</span>
            <Image
              className="h-8 w-auto hidden sm:block"
              src="/saborespasto.svg"
              alt="Sabores Pasto Logo"
              width="262"
              height="32"
            />
            <Image
              className="h-8 w-auto sm:hidden"
              src="/icon.svg"
              alt="Sabores Pasto Logo"
              width="262"
              height="32"
            />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir menu principal</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* <Popover.Group className="hidden lg:flex lg:gap-x-12"> */}
        {/* <div className="hidden lg:flex lg:gap-x-12"> */}
        {/* <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              Products
              <ChevronDownIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {products.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                    >
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <item.icon
                          className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-auto">
                        <a
                          href={item.href}
                          className="block font-semibold text-gray-900"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                  {callsToAction.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                    >
                      <item.icon
                        className="h-5 w-5 flex-none text-gray-400"
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover> */}

        {/* <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Features
          </a>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Marketplace
          </a>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Company
          </a>
        </div> */}
        {/* </Popover.Group> */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
          {isLoadingAccount ? (
            <Loading />
          ) : account ? (
            account.admin ? (
              <>
                <Link
                  href="/mi-restaurante"
                  className="text-sm font-semibold leading-6 text-gray-900 mr-4"
                >
                  Mi restaurant
                </Link>
                <Link
                  href="/mi-restaurante/pedidos"
                  className="text-sm font-semibold leading-6 text-gray-900 mr-4"
                >
                  Pedidos
                </Link>
                <Link
                  href="/mi-cuenta"
                  className="text-sm font-semibold leading-6 text-gray-900 mr-4"
                >
                  Mi cuenta
                </Link>
                <Link
                  href="/cerrar-sesion"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cerrar sesión
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/mi-cuenta"
                  className="text-sm font-semibold leading-6 text-gray-900 mr-4"
                >
                  Mi cuenta
                </Link>
                <Link
                  href="/mis-pedidos"
                  className="text-sm font-semibold leading-6 text-gray-900 mr-4"
                >
                  Mis pedidos
                </Link>
                <Link
                  href="/cerrar-sesion"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cerrar sesión
                </Link>
              </>
            )
          ) : (
            <>
              <Link
                href="/crear-cuenta"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 leading-6 mr-4"
              >
                Registrarse
              </Link>
              <Link
                href="/iniciar-sesion"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Iniciar sesión <span aria-hidden="true">&rarr;</span>
              </Link>
            </>
          )}
        </div>
      </nav>

      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Sabores Pasto</span>
              <Image
                className="h-8 w-auto"
                src="/icon.svg"
                alt="Sabores Pasto Icono"
                width="54"
                height="32"
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Cerrar menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="py-6">
                {isLoadingAccount ? (
                  <div className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    <Loading />
                  </div>
                ) : account ? (
                  account.admin ? (
                    <>
                      <Link
                        href="/mi-restaurante"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Mi restaurante
                      </Link>
                      <Link
                        href="/mi-restaurante/pedidos"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Pedidos
                      </Link>
                      <Link
                        href="/mi-cuenta"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Mi cuenta
                      </Link>
                      <Link
                        href="/cerrar-sesion"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Cerrar sesión
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/mi-cuenta"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Mi cuenta
                      </Link>
                      <Link
                        href="/mis-pedidos"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Mis pedidos
                      </Link>
                      <Link
                        href="/cerrar-sesion"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Cerrar sesión
                      </Link>
                    </>
                  )
                ) : (
                  <>
                    <Link
                      href="/crear-cuenta"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Registrarse
                    </Link>
                    <Link
                      href="/iniciar-sesion"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Iniciar sesión
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
