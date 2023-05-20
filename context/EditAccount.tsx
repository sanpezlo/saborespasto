import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import EditAccountModal, {
  EditAccountModalProps,
} from "@/components/modals/editAccount";

type EditAccountContext = {
  setEditAccountModal: Dispatch<SetStateAction<EditAccountModalProps | null>>;
};

const EditAccountContext = createContext<EditAccountContext>({
  setEditAccountModal: () => {},
});

type EditAccountProviderProps = {
  children?: ReactNode;
};

export function EditAccountProvider({ children }: EditAccountProviderProps) {
  const [editAccountModal, setEditAccountModal] =
    useState<EditAccountModalProps | null>(null);

  return (
    <EditAccountContext.Provider value={{ setEditAccountModal }}>
      {editAccountModal && (
        <EditAccountModal
          account={editAccountModal.account}
          onClose={() => {
            setEditAccountModal(null);
          }}
        />
      )}

      {children}
    </EditAccountContext.Provider>
  );
}

export function useEditAccountContext() {
  return useContext(EditAccountContext);
}
