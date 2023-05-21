import { Fragment, useCallback, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useSWRConfig } from "swr";

import { useLoadingContext } from "@/context/Loading";
import { useNotificationContext } from "@/context/Notification";
import { handleErrorModal } from "@/lib/error";
import { useErrorContext } from "@/context/Error";
import { apiFetcher } from "@/lib/fetcher";

export interface DeleteDishModalProps {
  dishId: string;
  onClose?: () => void;
  onSuccessfulDelete?: () => void;
}

export default function DeleteDishModal({
  dishId,
  onClose = () => {},
  onSuccessfulDelete = () => {},
}: DeleteDishModalProps) {
  const { mutate } = useSWRConfig();

  const [open, setOpen] = useState(true);

  const { setLoadingModal } = useLoadingContext();
  const { setErrorModal } = useErrorContext();
  const { setNotification } = useNotificationContext();

  const handleClick = useCallback(async () => {
    setLoadingModal({ title: "Borrando plato..." });
    try {
      await apiFetcher(`/dishes/${dishId}`, {
        method: "DELETE",
      });

      setNotification({
        title: "Plato borrado",
        description: "Tu plato ha sido borrado exitosamente",
      });

      await mutate("/restaurants/dishes/self");
      onSuccessfulDelete();
    } catch (error) {
      handleErrorModal(error, setErrorModal);
    } finally {
      setLoadingModal(null);
      setOpen(false);
      onClose();
    }
  }, [
    dishId,
    mutate,
    onClose,
    setErrorModal,
    setLoadingModal,
    setNotification,
    onSuccessfulDelete,
  ]);

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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Borrar plato
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          ¿Estás seguro de que quieres borrar este plato? Todos
                          los datos relacionados con este plato se perderán.
                          Esta acción no se puede deshacer.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={handleClick}
                  >
                    Borrar
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      onClose();
                      setOpen(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
