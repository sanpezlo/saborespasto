import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import EditDishModal, {
  EditDishModalProps,
} from "@/components/modals/editDishModal";

type EditDishContext = {
  setEditDishModal: Dispatch<SetStateAction<EditDishModalProps | null>>;
};

const EditDishContext = createContext<EditDishContext>({
  setEditDishModal: () => {},
});

type EditDishProviderProps = {
  children?: ReactNode;
};

export function EditDishProvider({ children }: EditDishProviderProps) {
  const [editDishModal, setEditDishModal] = useState<EditDishModalProps | null>(
    null
  );

  return (
    <EditDishContext.Provider value={{ setEditDishModal }}>
      {editDishModal && (
        <EditDishModal
          dish={editDishModal.dish}
          onClose={() => {
            setEditDishModal(null);
          }}
        />
      )}

      {children}
    </EditDishContext.Provider>
  );
}

export function useEditDishContext() {
  return useContext(EditDishContext);
}
