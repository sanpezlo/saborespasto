import { Fragment, ReactElement, ReactNode, useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";

export interface NotificationProps {
  title: string;
  description: string;
  onClose?: () => void;
}

export default function Notification({
  title,
  description,
  onClose = () => {},
}: NotificationProps) {
  let [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      <Transition
        show={isOpen}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 right-0 m-2 bg-white rounded-lg border-gray-300 border p-3 shadow-lg z-10">
          <div className="flex flex-row">
            <div className="px-2">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-2 mr-6">
              <span className="font-semibold">{title}</span>
              <span className="block text-gray-500">{description}</span>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}
