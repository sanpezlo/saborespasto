import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import { Dish } from "@/types/Dish";
import QuickviewsModal, {
  QuickviewsModalProps,
} from "@/components/modals/quickviewsModal";

type QuickviewsContext = {
  setQuickviewsModal: Dispatch<SetStateAction<QuickviewsModalProps | null>>;
};

const QuickviewsContext = createContext<QuickviewsContext>({
  setQuickviewsModal: () => {},
});

type QuickviewsProviderProps = {
  children?: ReactNode;
};

export interface Product {
  quantity: number;
  dish: Dish;
}

export function QuickviewsProvider({ children }: QuickviewsProviderProps) {
  const [quickviewsModal, setQuickviewsModal] =
    useState<QuickviewsModalProps | null>(null);

  return (
    <QuickviewsContext.Provider value={{ setQuickviewsModal }}>
      {quickviewsModal && (
        <QuickviewsModal
          dish={quickviewsModal.dish}
          onClose={() => setQuickviewsModal(null)}
        />
      )}
      {children}
    </QuickviewsContext.Provider>
  );
}

export function useQuickviewsContext() {
  return useContext(QuickviewsContext);
}
