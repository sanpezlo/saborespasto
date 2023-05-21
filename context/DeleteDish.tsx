import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import DeleteDishModal, {
  DeleteDishModalProps,
} from "@/components/modals/deleteDishModal";

type DeleteDishContext = {
  setDeleteDishModal: Dispatch<SetStateAction<DeleteDishModalProps | null>>;
};

const DeleteDishContext = createContext<DeleteDishContext>({
  setDeleteDishModal: () => {},
});

type DeleteDishProviderProps = {
  children?: ReactNode;
};

export function DeleteDishProvider({ children }: DeleteDishProviderProps) {
  const [deleteDishModal, setDeleteDishModal] =
    useState<DeleteDishModalProps | null>(null);

  return (
    <DeleteDishContext.Provider value={{ setDeleteDishModal }}>
      {deleteDishModal && (
        <DeleteDishModal
          dishId={deleteDishModal.dishId}
          onClose={() => {
            setDeleteDishModal(null);
          }}
          onSuccessfulDelete={deleteDishModal.onSuccessfulDelete}
        />
      )}

      {children}
    </DeleteDishContext.Provider>
  );
}

export function useDeleteDishContext() {
  return useContext(DeleteDishContext);
}
