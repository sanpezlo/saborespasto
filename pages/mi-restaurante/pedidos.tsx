import Head from "next/head";
import useSWR from "swr";
import { UserCircleIcon } from "@heroicons/react/24/solid";

import Loading from "@/components/loading";
import { useAdmin } from "@/hooks/admin";
import { Order, OrdersSchema } from "@/types/Order";
import { ErrorResponse } from "@/types/ErrorResponse";
import { apiFetcherSWR } from "@/lib/fetcher";
import Link from "next/link";

export default function Pedidos() {
  const { account, isLoadingAccount } = useAdmin();

  const { data: orders, isLoading: isLoadingOrders } = useSWR<
    Order[],
    ErrorResponse
  >(
    () => (account && account.admin ? "/orders/self" : null),
    apiFetcherSWR({ schema: OrdersSchema }),
    {
      shouldRetryOnError: false,
    }
  );

  if (isLoadingAccount || isLoadingOrders)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Pedidos</title>
        </Head>
        <main className="mt-10 mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title> Sabores Pasto - Pedidos</title>
      </Head>
      <main className="mt-10 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Lista de pedidos
            </h2>
          </div>
          <div className="mx-auto mt-4 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {orders &&
              orders.map((order, index) => (
                <Link
                  href={`/mi-restaurante/pedidos/${order.id}`}
                  key={order.id}
                  className="flex max-w-xl flex-col items-start justify-between border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition ease-in-out duration-150"
                >
                  <div className="flex items-center gap-x-4 text-xs">
                    <time
                      dateTime={new Date(order.createdAt).toLocaleDateString(
                        "es-CO"
                      )}
                      className="text-gray-500"
                    >
                      {new Date(order.createdAt).toLocaleString("es-CO", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </time>
                    <div className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                      {order.status === "pending" && "Pendiente"}
                      {order.status === "preparing" && "Preparando"}
                      {order.status === "completed" && "Completado"}
                      {order.status === "cancelled" && "Cancelado"}
                    </div>
                  </div>
                  <div className="relative">
                    <h3 className="mt-2 text-lg font-semibold leading-6 text-gray-900">
                      <div>
                        <span className="absolute inset-0" />
                        Pedido #{index + 1}
                      </div>
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                      {order.address}
                    </p>
                  </div>
                  <div className="relative mt-4 flex items-center gap-x-2">
                    <UserCircleIcon className="h-10 w-10 rounded-full text-gray-600" />
                    <div className="text-sm leading-6">
                      <p className="font-sfmibold text-gray-900">
                        <div>
                          <span className="absolute inset-0" />
                          {order.name}
                        </div>
                      </p>
                      <p className="text-gray-600"> +57 {order.phone}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </>
  );
}
