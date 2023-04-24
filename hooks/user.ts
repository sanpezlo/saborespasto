import { useAuthContext } from "@/context/Auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useUser() {
  const { account, isLoadingAccount } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoadingAccount) return;
    if (!account) {
      router.replace("/iniciar-sesion");
      return;
    }
    if (account.admin) {
      router.replace("404");
      return;
    }
  }, [account, router, isLoadingAccount]);

  return { account, isLoadingAccount };
}
