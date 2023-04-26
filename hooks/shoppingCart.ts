import { Dish } from "@/types/Dish";
import { useState } from "react";

export interface Product {
  quantity: number;
  dish: Dish;
}

export function useShoppingCart() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);

  return {
    open,
    setOpen,
    cart,
    setCart,
  };
}
