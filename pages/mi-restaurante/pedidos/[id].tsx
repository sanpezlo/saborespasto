import { useRouter } from "next/router";
import useSWR from "swr";

import { ErrorResponse } from "@/types/ErrorResponse";
import { apiFetcherSWR } from "@/lib/fetcher";
import Head from "next/head";
import Loading from "@/components/loading";
import { useAdmin } from "@/hooks/admin";
import { OrderAndDishes, OrderAndDishesSchema } from "@/types/OrderAndDishes";

export default function Pedido() {
  const router = useRouter();
  const { id } = router.query;

  const { isLoadingAccount } = useAdmin();

  const { data: order, isLoading: isLoadingOrder } = useSWR<
    OrderAndDishes,
    ErrorResponse
  >(`/orders/dishes/${id}`, apiFetcherSWR({ schema: OrderAndDishesSchema }), {
    shouldRetryOnError: false,
  });

  if (isLoadingAccount || isLoadingOrder)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Pedido</title>
        </Head>
        <main className="mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Información del pedido
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            detalles del pedido
          </p>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Nombre completo
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {order?.name}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Direccion
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {order?.address}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Telefono
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                +57 {order?.phone}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Platos
              </dt>

              <dd
                className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0  
              
              flow-root rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:leading-6 bg-white h-auto px-4 py-5 sm:p-6"
              >
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {order?.DishesInOrder &&
                    order.DishesInOrder.map((product) => (
                      <li key={product.dish.id} className="flex flex-wrap py-6">
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
                                {product.dish.new_price.toLocaleString("es-Co")}
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
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
