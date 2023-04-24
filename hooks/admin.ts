import { useAuthContext } from "@/context/Auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useAdmin() {
  const { account, isLoading: isLoadingAccount } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoadingAccount) return;
    if (!account) {
      router.push("/iniciar-sesion");
      return;
    }
    if (!account.admin) {
      router.push("404");
      return;
    }
  }, [account, router, isLoadingAccount]);

  return { account, isLoadingAccount };
}
