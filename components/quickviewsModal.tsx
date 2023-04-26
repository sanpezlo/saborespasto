import {
  Dispatch,
  FormEvent,
  Fragment,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { Dish } from "@/types/Dish";
import { Product } from "@/hooks/shoppingCart";

export interface QuickviewsModalProps {
  dish: Dish;
  cart: Product[];
  setCart: Dispatch<SetStateAction<Product[]>>;
  onClose?: () => void;
}

export default function QuickviewsModal({
  dish,
  cart,
  setCart,
  onClose = () => {},
}: QuickviewsModalProps) {
  const [open, setOpen] = useState(true);
  const [quantity, setQuantity] = useState(
    cart.find((p) => p.dish.id === dish.id)?.quantity || 1
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setCart((prev) => {
        const product = prev.find((p) => p.dish.id === dish.id);
        if (product) {
          product.quantity = quantity;
          return [...prev];
        }
        return [...prev, { dish, quantity }];
      });
      onClose();
      setOpen(false);
    },
    [quantity, dish, setCart, onClose]
  );

  return (
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
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                    onClick={() => {
                      onClose();
                      setOpen(false);
                    }}
                  >
                    <span className="sr-only">Cerrar</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                    <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                      <img
                        src={dish.image}
                        alt={""}
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="sm:col-span-8 lg:col-span-7">
                      <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                        {dish.name}
                      </h2>

                      <section
                        aria-labelledby="information-heading"
                        className="mt-2"
                      >
                        <h3 id="information-heading" className="sr-only">
                          Información del plato
                        </h3>

                        <p className="text-2xl text-gray-900">
                          ${dish.new_price.toLocaleString("es-Co")}
                        </p>

                        <div className="mt-6">
                          <h4 className="sr-only">Comentarios</h4>
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[0, 1, 2, 3, 4].map((rating) => (
                                <StarIcon
                                  key={rating}
                                  className={`${
                                    3.9 > rating
                                      ? "text-gray-900"
                                      : "text-gray-200"
                                  } h-5 w-5 flex-shrink-0`}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                            <p className="sr-only">{3.9} de 5 estrellas</p>
                            <a
                              href="#"
                              className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              10 Comentarios
                            </a>
                          </div>
                        </div>
                      </section>

                      <section
                        aria-labelledby="options-heading"
                        className="mt-10"
                      >
                        <h3 id="options-heading" className="sr-only">
                          Opciones del plato
                        </h3>

                        <form onSubmit={handleSubmit}>
                          <div>
                            <label
                              htmlFor="quantity"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Cantidad
                            </label>
                            <div className="mt-2">
                              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                <input
                                  type="number"
                                  min={1}
                                  step={1}
                                  name="quantity"
                                  id="quantity"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  required
                                  value={quantity}
                                  onChange={(e) =>
                                    setQuantity(parseInt(e.target.value))
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Agregar al carrito
                          </button>
                        </form>
                      </section>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
