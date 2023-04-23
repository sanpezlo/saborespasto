import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect } from "react";

import { useAuthContext } from "@/context/Auth";
import Loading from "@/components/loading";

export default function MiRestaurante() {
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

  return (
    <>
      <Head>
        <title> Sabores Pasto - Mi Restaurante </title>
      </Head>
      {isLoadingAccount ? (
        <main className="mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      ) : (
        <main className="mx-auto flex max-w-7xl items-center justify-center"></main>
      )}
    </>
  );
}
