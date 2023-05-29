import { useAuthContext } from "@/context/Auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useUser({ redirectAdminTo = "/404" }) {
  const { account, isLoadingAccount } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoadingAccount) return;
    if (!account) {
      router.push("/iniciar-sesion");
      return;
    }
    if (account.admin) {
      router.push(redirectAdminTo);
      return;
    }
  }, [account, router, isLoadingAccount, redirectAdminTo]);

  return { account, isLoadingAccount };
}
