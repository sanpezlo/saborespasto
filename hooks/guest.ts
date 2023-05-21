import { useEffect } from "react";

import { useAuthContext } from "@/context/Auth";
import { useRouter } from "next/router";

export function useGuest() {
  const router = useRouter();
  const { account, isLoadingAccount } = useAuthContext();

  useEffect(() => {
    if (isLoadingAccount) return;
    if (account) {
      router.push("/");
      return;
    }
  }, [isLoadingAccount, account, router]);

  return { isLoadingAccount };
}
