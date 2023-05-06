import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import ErrorModal, { ErrorModalProps } from "@/components/modals/errorModal";

type ErrorContext = {
  setErrorModal: Dispatch<SetStateAction<ErrorModalProps | null>>;
};

const ErrorContext = createContext<ErrorContext>({
  setErrorModal: () => {},
});

type ErrorProviderProps = {
  children?: ReactNode;
};

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [errorModal, setErrorModal] = useState<ErrorModalProps | null>(null);
  return (
    <ErrorContext.Provider value={{ setErrorModal }}>
      {errorModal && (
        <ErrorModal
          title={errorModal?.title ?? ""}
          description={errorModal?.description ?? ""}
          list={errorModal?.list ?? []}
          onClose={() => setErrorModal(null)}
        />
      )}
      {children}
    </ErrorContext.Provider>
  );
}

export function useErrorContext() {
  return useContext(ErrorContext);
}
