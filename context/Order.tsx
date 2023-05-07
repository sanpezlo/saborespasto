import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import OrderModal, { OrderModalProps } from "@/components/modals/orderModal";

type OrderContext = {
  setOrderModal: Dispatch<SetStateAction<OrderModalProps | null>>;
};

const OrderContext = createContext<OrderContext>({
  setOrderModal: () => {},
});

type OrderProviderProps = {
  children?: ReactNode;
};

export function OrderProvider({ children }: OrderProviderProps) {
  const [orderModal, setOrderModal] = useState<OrderModalProps | null>(null);
  return (
    <OrderContext.Provider value={{ setOrderModal }}>
      {orderModal && (
        <OrderModal
          restaurantId={orderModal.restaurantId}
          onClose={() => setOrderModal(null)}
        />
      )}
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  return useContext(OrderContext);
}
