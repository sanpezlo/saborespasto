import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import LoadingModal, {
  LoadingModalProps,
} from "@/components/modals/loadingModal";

type LoadingContext = {
  setLoadingModal: Dispatch<SetStateAction<LoadingModalProps | null>>;
};

const LoadingContext = createContext<LoadingContext>({
  setLoadingModal: () => {},
});

type LoadingProviderProps = {
  children?: ReactNode;
};

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingModal, setLoadingModal] = useState<LoadingModalProps | null>(
    null
  );
  return (
    <LoadingContext.Provider value={{ setLoadingModal }}>
      {loadingModal && <LoadingModal title={loadingModal.title} />}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  return useContext(LoadingContext);
}
