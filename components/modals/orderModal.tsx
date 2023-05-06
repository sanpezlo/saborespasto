import { FormEvent, Fragment, useCallback, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { Product } from "@/hooks/shoppingCart";
import { Account } from "@/types/Account";
import { CreateOrderSchema, Order, OrderSchema } from "@/types/Order";
import { apiFetcher } from "@/lib/fetcher";
import { useLoadingContext } from "@/context/Loading";

export interface OrderModalProps {
  account: Account;
  cart: Product[];
  restaurantId: string;
  onError?: (error: unknown) => void;
  onClose?: () => void;
  onSucess?: () => void;
}

export default function OrderModal({
  account,
  cart,
  restaurantId,
  onError = () => {},
  onClose = () => {},
  onSucess = () => {},
}: OrderModalProps) {
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState<Account>(account);
  const { setLoadingModal } = useLoadingContext();

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      setLoadingModal({
        title: "Procesando orden...",
      });
      try {
        e.preventDefault();
        const createOrder = CreateOrderSchema.parse({
          ...form,
          restaurantId: restaurantId,
          dishes: cart.map((prdocut) => ({
            quantity: prdocut.quantity,
            id: prdocut.dish.id,
          })),
        });

        await apiFetcher<Order>("/orders", {
          method: "POST",
          body: JSON.stringify(createOrder),
          schema: OrderSchema,
        });

        onSucess();
      } catch (error) {
        onError(error);
      } finally {
        setLoadingModal(null);
        setOpen(false);
        onClose();
      }
    },
    [form, restaurantId, cart, onClose, onError, onSucess, setLoadingModal]
  );

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            onClose();
            setOpen(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-50 text-left shadow-xl transition-all sm:my-8 w-full max-w-xl lg:max-w-6xl">
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col lg:flex-row px-4 py-5 sm:p-6 gap-4">
                      <div className="flex-1 bg-gray-50">
                        <div className="">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-7 text-gray-900"
                          >
                            Información de envío
                          </Dialog.Title>
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
                                  required
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  value={form.name}
                                  onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                  }
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
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  required
                                  value={form.address || ""}
                                  onChange={(e) =>
                                    setForm({
                                      ...form,
                                      address: e.target.value,
                                    })
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
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                    +57
                                  </span>
                                  <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    required
                                    value={form.phone || ""}
                                    onChange={(e) =>
                                      setForm({
                                        ...form,
                                        phone: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 w-full">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-7 text-gray-900"
                        >
                          Resumen de la orden
                        </Dialog.Title>
                        <div className="mt-10 flow-root rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-white h-auto px-4 py-5 sm:p-6">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {cart.map((product) => (
                              <li
                                key={product.dish.id}
                                className="flex flex-wrap py-6"
                              >
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={product.dish.image}
                                    alt=""
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex flex-wrap justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href={""}>{product.dish.name}</a>
                                      </h3>
                                      <p className="ml-4">
                                        $
                                        {product.dish.new_price.toLocaleString(
                                          "es-Co"
                                        )}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {product.dish.description}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                      Cantidad {product.quantity}
                                    </p>

                                    {/* <div className="flex">
                                      <button
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                      >
                                        Eliminar
                                      </button>
                                    </div> */}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      {/* <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Deactivate
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button> */}
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:w-auto"
                      >
                        Comfirmar pedido
                      </button>
                      <button
                        className="mt-3 inline-flex w-full justify-center text-sm font-semibold px-3 py-2 leading-6 text-gray-900 sm:mt-0 sm:w-auto"
                        onClick={() => {
                          onClose();
                          setOpen(false);
                        }}
                      >
                        Atras
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
