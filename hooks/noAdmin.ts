import { useAuthContext } from "@/context/Auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useNoAdmin({ redirectTo = "/404" }: { redirectTo?: string }) {
  const { account, isLoadingAccount } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoadingAccount) return;
    if (account && account.admin) {
      router.replace(redirectTo);
      return;
    }
  });

  return { account, isLoadingAccount };
}
