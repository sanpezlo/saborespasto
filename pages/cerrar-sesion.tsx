import { useAuthContext } from "@/context/Auth";
import { apiFetcher } from "@/lib/fetcher";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSWRConfig } from "swr";

export default function CerrarSesion() {
  const { mutate } = useSWRConfig();
  const { mutateAccount } = useAuthContext();

  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await mutate("/accounts/favorites/self", null, false);

      await apiFetcher("/logout", {
        method: "POST",
      });
    };

    logout();
    router.push("/");
  }, [mutate, mutateAccount, router]);

  return <></>;
}
