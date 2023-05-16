import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import EditRestaurantModal, {
  EditRestaurantModalProps,
} from "@/components/modals/editRestaurantModal";

type EditRestaurantContext = {
  setEditRestaurantModal: Dispatch<
    SetStateAction<EditRestaurantModalProps | null>
  >;
};

const EditRestaurantContext = createContext<EditRestaurantContext>({
  setEditRestaurantModal: () => {},
});

type EditRestaurantProviderProps = {
  children?: ReactNode;
};

export function EditRestaurantProvider({
  children,
}: EditRestaurantProviderProps) {
  const [editRestaurantModal, setEditRestaurantModal] =
    useState<EditRestaurantModalProps | null>(null);

  return (
    <EditRestaurantContext.Provider value={{ setEditRestaurantModal }}>
      {editRestaurantModal && (
        <EditRestaurantModal
          restaurant={editRestaurantModal.restaurant}
          onClose={() => {
            setEditRestaurantModal(null);
          }}
        />
      )}

      {children}
    </EditRestaurantContext.Provider>
  );
}

export function useEditRestaurantContext() {
  return useContext(EditRestaurantContext);
}
