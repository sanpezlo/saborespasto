import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import { Account } from "@/types/Account";

type AuthenticationContext = {
  account?: Account;
  setAccount: Dispatch<SetStateAction<Account | undefined>>;
};

const AuthContext = createContext<AuthenticationContext>({
  account: undefined,
  setAccount: () => {},
});

type AuthProviderProps = {
  children?: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [account, setAccount] = useState<Account | undefined>(undefined);

  return (
    <AuthContext.Provider
      value={{
        account,
        setAccount: setAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
