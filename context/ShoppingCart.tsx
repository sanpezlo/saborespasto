import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import { Dish } from "@/types/Dish";

type ShoppingCartContext = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cart: Product[];
  setCart: Dispatch<SetStateAction<Product[]>>;
};

const ShoppingCartContext = createContext<ShoppingCartContext>({
  open: false,
  setOpen: () => {},
  cart: [],
  setCart: () => {},
});

type ShoppingCartProviderProps = {
  children?: ReactNode;
};

export interface Product {
  quantity: number;
  dish: Dish;
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);

  return (
    <ShoppingCartContext.Provider value={{ open, setOpen, cart, setCart }}>
      {children}
    </ShoppingCartContext.Provider>
  );
}

export function useShoppingCartContext() {
  return useContext(ShoppingCartContext);
}
